const { spawn } = require('node:child_process');
const assert = require('node:assert');

const autocannon = require('autocannon');
const { Bench } = require('tinybench');
const { Suite } = require('bench-node');

const { setTimeout: delay } = require('node:timers/promises');

const runner = {
  autocannon: async (opts, aggregated) => {
    if (!aggregated.sortKey) {
      aggregated.sortKey = 'requests'
    }

    const url = `http://localhost:${opts.http.serverPort}`
    const results = await autocannon({
      url,
      connections: 100,
      pipelining: 1,
      duration: 10 * opts.http.routes.length,
      requests: opts.http.routes,
    })
    if (!aggregated[url]) {
      aggregated[url] = [results]
    } else {
      aggregated[url].push(results)
    }
  },
  'bench-node': async (opts, aggregated) => {
    if (!aggregated.sortKey) {
      aggregated.sortKey = 'opsSec'
    }

    const suite = new Suite({ reporter: false });

    for (const operation of opts.operations) {
      suite.add(operation.name, operation.fn);
    }

    const results = await suite.run();
    for (const result of results) {
      if (!aggregated[result.name]) {
        aggregated[result.name] = [{
          opsSec: result.opsSec,
          samples: result.iterations,
          sd: '',
          variance: '',
        }]
      } else {
        aggregated[result.name].push({
          opsSec: result.opsSec,
          samples: result.iterations,
          sd: '',
          variance: '',
        })
      }
    }
  },
  tinybench: async (opts, aggregated) => {
    if (!aggregated.sortKey) {
      aggregated.sortKey = 'opsSec'
    }

    const suite = new Bench({ time: 100 });

    for (const operation of opts.operations) {
      suite.add(operation.name, operation.fn);
    }
    await suite.warmup();
    await suite.run();
    const tasks = suite.tasks;
    for (const task of tasks) {
      const result = task.result
      if (!aggregated[task.name]) {
        aggregated[task.name] = [{
          opsSec: result.hz,
          samples: result.samples.length,
          sd: result.sd,
          variance: result.variance,
        }]
      } else {
        aggregated[task.name].push({
          opsSec: result.hz,
          samples: result.samples.length,
          sd: result.sd,
          variance: result.variance,
        })
      }
    }
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
  },
  'bench-node': (settings, result) => {
    return {
      name: settings.name,
      method: 'bench-node',
      operations: result,
    }
  }
}

const ALLOWED_BENCHMARKER = ['autocannon', 'tinybench', 'bench-node'];

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

function findMedian(aggregated) {
  const results = []
  // Select median
  const sortKey = aggregated.sortKey
  for (const k of Object.keys(aggregated)) {
    if (aggregated[k] === sortKey) continue
    aggregated[k].sort((a, b) => a[sortKey] > b[sortKey])
    const middleIndex = Math.floor(aggregated[k].length / 2);
    results.push({
      name: k,
      ...aggregated[k][middleIndex]
    })
  }
  return results
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

  const aggregated = {};
  for (let i = 0; i < 10; ++i) {
    await benchRunner(settings, aggregated)
  }
  const results = findMedian(aggregated)
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
