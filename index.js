const fs = require('node:fs/promises');
const path = require('node:path');
const Piscina = require('piscina');

const piscina = new Piscina({
  filename: path.resolve(__dirname, 'worker.js'),
  resourceLimits: {
    // 16GiB for each Worker (1 per run)
    // This was required due to prettier benchmark
    maxOldGenerationSizeMb: 16384,
  },
  maxQueue: 1,
});

let output;
// Considering this script won't be called as a
// child_process, stdout.isTTY should be reliable enough.
if (process.stdout.isTTY) {
  output = require('./console-output');
} else {
  output = {
    log: () => {},
    printResults: (results) => {
      console.log(JSON.stringify(results, null, 2));
    }
  }
}

async function main() {
  const files = await fs.readdir(path.join(__dirname, './src'));
  output.log('Running Node.js Package Benchmark...');
  const results = [];
  for (const file of files) {
    if (file.match(/.*-benchmark\.js$/)) {
      const benchFile = path.join(__dirname, './src/', file);
      const result = await piscina.run(benchFile);
      results.push(result);
    }
  }
  output.printResults(results);
}

main();
