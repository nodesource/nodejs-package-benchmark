#!/usr/bin/env node

const fs = require('node:fs/promises');
const path = require('node:path');
const Piscina = require('piscina');
const os = require('node:os');

const piscina = new Piscina({
  filename: path.resolve(__dirname, 'worker.js'),
  resourceLimits: {
    // 16GiB for each Worker (1 per run)
    // This was required due to prettier benchmark
    maxOldGenerationSizeMb: 16384
  },
  maxQueue: 1
});

let output;
// Considering this script won't be called as a
// child_process, stdout.isTTY should be reliable enough.
if (process.env.TTY || process.stdout.isTTY) {
  output = require('./console-output');
} else {
  const results = [];

  output = {
    info: () => {},
    start: () => {},
    end: () => console.log(JSON.stringify(results, null, 2)),
    step: (result) => results.push(result)
  };
}

async function main() {
  const files = await fs.readdir(path.join(__dirname, './src'));
  output.info(`cpu: ${os.cpus()[0].model} (${os.cpus().length} cores)`);
  output.info(`node: ${process.version} (${process.execPath})`);
  output.info(`os: ${os.type()} ${os.release()} ${os.arch()}`);

  output.start();

  for (const file of files) {
    if (!file.match(/.*-benchmark\.js$/)) {
      continue;
    }

    const benchFile = path.join(__dirname, './src/', file);
    const result = await piscina.run(benchFile);
    output.step(result);
  }

  output.end();
}

main();
