const fs = require('node:fs/promises');
const { setTimeout: delay } = require('node:timers/promises');
const path = require('node:path');
const { spawn } = require('node:child_process');
const assert = require('node:assert');
const autocannon = require('autocannon');

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
  assert.ok(settings.http.server, 'HTTP Benchmark must have a server to be spawned');
  assert.ok(ALLOWED_BENCHMARKER.includes(settings.benchmarker), 'Invalid settings.benchmarker');

  let server = undefined;
  if (settings.type === 'http') {
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

async function main() {
  const files = await fs.readdir(path.join(__dirname, './src'));
  for (const file of files) {
    if (file.match(/.*-benchmark\.js$/)) {
      const bench = require(path.join(__dirname, './src/', file));
      console.log(bench.name, 'results', await runBenchmark(bench));
    }
  }
}

main();
