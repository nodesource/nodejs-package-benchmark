const { spawn } = require('node:child_process');
const assert = require('node:assert');

const autocannon = require('autocannon');
const Benchmark = require('benchmark');

const { setTimeout: delay } = require('node:timers/promises');

const runner = {
  autocannon: (opts) => {
    return autocannon({
      url: `http://localhost:${opts.http.serverPort}`,
      connections: 100,
      pipelining: 1,
      duration: 10 * opts.http.routes.length,
      requests: opts.http.routes,
    })
  },
  benchmarkjs: (opts) => {
    const suite = new Benchmark.Suite;

    for (const operation of opts.operations) {
      suite.add(operation.name, operation.fn);
    }

    return new Promise((resolve) => {
      const results = [];
      suite.on('cycle', function(event) {
        results.push({
          name: event.target.name,
          opsSec: event.target.hz,
          samples: event.target.cycles,
        });
      }).on('complete', function () {
        resolve(results);
      })
      .run({ 'async': false });
    })
  },
}

const parser = {
  autocannon: (settings, result) => {
    return {
      name: settings.name,
      method: 'autocannon',
      http: {
        totalReq: asNumber(result.requests),
        duration: result.duration,
        errors: result.errors,
      }
    };
  },
  benchmarkjs: (settings, result) => {
    return {
      name: settings.name,
      method: 'benchmarkjs',
      operations: result,
    }
  }
}

const ALLOWED_BENCHMARKER = ['autocannon', 'benchmarkjs'];

function asNumber (stat) {
  const result = Object.create(null)
  for (const k of Object.keys(stat)) {
    result[k] = stat[k].toLocaleString(undefined, {
      // to show all digits
      maximumFractionDigits: 20
    })
  }
  return result
}

function spawnServer(settings) {
  const server = spawn(
    process.execPath,
    [settings.http.server],
    { stdio: 'inherit' },
  );
  return server;
}

async function runBenchmark(settings) {
  assert.ok(ALLOWED_BENCHMARKER.includes(settings.benchmarker), 'Invalid settings.benchmarker');

  let server = undefined;
  if (settings.type === 'http') {
    assert.ok(settings.http.server, 'HTTP Benchmark must have a server to be spawned');
    server = spawnServer(settings);
    // TODO: replace this workaround to use IPC to know when server is up
    await delay(1000);
  }

  const benchRunner = runner[settings.benchmarker];
  const benchParser = parser[settings.benchmarker];
  const results = await benchRunner(settings);
  if (server) {
    server.kill('SIGINT');
  }
  return benchParser(settings, results);
}

async function main (benchFile)  {
  const bench = require(benchFile);
  const result = await runBenchmark(bench);
  return result;
}

module.exports = main;
