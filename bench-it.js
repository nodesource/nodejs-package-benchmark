#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');

const NODEJS_PACKAGE_BENCHMARK_PATH = __dirname;

if (process.argv.length < 3) {
  console.log("You must pass the binary as argument. Example: bench-it ./node");
  process.exit(1);
}

const BINARY = process.argv[2];

if (process.argv[3] === "baseline") {
  const result = execSync(`${BINARY} --allow-natives-syntax ${NODEJS_PACKAGE_BENCHMARK_PATH}/index.js`, {
    env: { TTY: true },
  }).toString();
  fs.writeFileSync('baseline.out', `${result}`);
  console.log("Baseline generated.");
  process.exit(0);
}

if (!fs.existsSync('./baseline.out')) {
  console.log(`The baseline.out does not exist. Generate it with: $ bench-it ${BINARY} baseline.`);
  process.exit(1);
}

let diffCmd = "colordiff";
try {
  execSync("command -v colordiff");
} catch (error) {
  console.log("⚠️ 'colordiff' was not found. Using 'diff' as fallback.");
  diffCmd = "diff";
}

const currentResult = execSync(`${BINARY} --allow-natives-syntax ${NODEJS_PACKAGE_BENCHMARK_PATH}/index.js`, {
  env: { TTY: true },
}).toString();
fs.writeFileSync('current.out', currentResult);

try {
  const stdout = execSync(`${diffCmd} -y baseline.out current.out`, {
    cwd: process.cwd()
  })
  console.log(stdout.toString())
} catch (e) {
  // `diff` returns a non-0 exit code
  console.log(e.message)
  console.log(e.stdout.toString())
}
