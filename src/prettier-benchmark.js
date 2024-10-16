const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert');
const prettier = require('prettier');

const payloads = [
  'lodash.fp.js',
].map((file) => fs.readFileSync(path.join(__dirname, '..', 'fixtures', file), 'utf8'));

module.exports = {
  name: 'prettier',
  type: 'operation',
  operations: [
    {
      name: 'format',
      fn: () => {
        let v = undefined;
        for (const p of payloads) {
          v = prettier.format(p, { parser: 'babel' });
          assert.ok(v);
        }
        return v;
      },
    },
    {
      name: 'format (singleQuote=true useTabs=true)',
      fn: () => {
        let v = undefined;
        for (const p of payloads) {
          v = prettier.format(
            p,
            { singleQuote: true, useTabs: true, parser: 'babel' },
          );
          assert.ok(v);
        }
        return v;
      },
    },
    {
      name: 'format (semi=false)',
      fn: () => {
        let v = undefined;
        for (const p of payloads) {
          v = prettier.format(
            p,
            { semi: false, parser: 'babel' }
          );
          assert.ok(v);
        }
        return v;
      },
    },
  ],
  benchmarker: 'tinybench',
};
