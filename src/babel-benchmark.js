const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert');
const Babel = require('@babel/standalone');

const payloads = [
  'lodash.fp.js',
].map((file) => fs.readFileSync(path.join(__dirname, '..', 'fixtures', file), 'utf8'));

module.exports = {
  name: 'babel',
  type: 'operation',
  operations: [
    {
      name: 'transform (code=true ast=true)',
      fn: () => {
        let v = undefined;
        for (const p of payloads) {
          v = Babel.transform(p, { code: true, ast: true }).code;
          assert.ok(v)
        }
        return v;
      },
    },
    {
      name: 'transform (code=false)',
      fn: () => {
        let v = undefined;
        for (const p of payloads) {
          v = Babel.transform(p, { code: false });
          assert.ok(v);
        }
        return v;
      },
    }
  ],
  benchmarker: 'tinybench',
};
