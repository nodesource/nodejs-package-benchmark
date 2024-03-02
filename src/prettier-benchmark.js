const fs = require('node:fs');
const path = require('node:path');
const prettier = require('prettier');

const payloads = [
  'lodash.fp.js',
].map((file) => fs.readFileSync(path.join(__dirname, '..', 'fixtures', file), 'utf8'));

module.exports = {
  name: 'prettier',
  type: 'operation',
  operations: [
    {
      name: 'format (semi=true)',
      fn: () => {
        let v = undefined;
        for (const p of payloads) {
          v= prettier.format(p, { semi: true, parser: 'babel' });
        }
        return v;
      },
    },
    // {
    //   name: 'format (singleQuote=true semi=true tabs=true)',
    //   fn: () => {
    //     let v = undefined;
    //     for (const p of payloads) {
    //       v = prettier.format(
    //         p,
    //         { singleQuote: true, semi: true, tabs: true, parser: 'babel' },
    //       );
    //     }
    //     return v;
    //   },
    // },
    // {
    //   name: 'format (singleQuote=false semi=false tabs=false)',
    //   fn: () => {
    //     let v = undefined;
    //     for (const p of payloads) {
    //       v = prettier.format(
    //         p,
    //         { singleQuote: false, semi: false, tabs: false, parser: 'babel' }
    //       );
    //     }
    //     return v;
    //   },
    // },
  ],
  benchmarker: 'benchmarkjs',
};
