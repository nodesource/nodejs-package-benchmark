const { spawn } = require('node:child_process');
const assert = require('node:assert');

const autocannon = require('autocannon');
const { Bench } = require('tinybench');

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
  tinybench: async (opts) => {
    const suite = new Bench({ time: 100 });

    for (const operation of opts.operations) {
      suite.add(operation.name, operation.fn);
    }
    await suite.warmup();
    await suite.run();
    const results = [];
    const tasks = suite.tasks;
    for (const task of tasks) {
      const result = task.result
      results.push({
        name: task.name,
        opsSec: result.hz,
        samples: result.samples.length,
        sd: result.sd,
        variance: result.variance,
      })
    }
    return results;
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
  tinybench: (settings, result) => {
    return {
      name: settings.name,
      method: 'tinybench',
      operations: result,
    }
  }
}

const ALLOWED_BENCHMARKER = ['autocannon', 'tinybench'];

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
