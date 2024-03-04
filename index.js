const fs = require('node:fs/promises');
const path = require('node:path');
const Piscina = require('piscina');

const piscina = new Piscina({
  filename: path.resolve(__dirname, 'worker.js')
});

async function main() {
  const files = await fs.readdir(path.join(__dirname, './src'));
  for (const file of files) {
    if (file.match(/.*-benchmark\.js$/)) {
      const benchFile = path.join(__dirname, './src/', file);
      const result = await piscina.run(benchFile);
      console.log('results', JSON.stringify(result, null, 2));
    }
    console.log('Done...', file)
  }
}

main();
