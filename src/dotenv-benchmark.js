const path = require('node:path');
const dotenv = require('dotenv');

const envFile = path.join(__dirname, '..', 'fixtures', '.env.sample');

module.exports = {
  name: 'dotenv',
  type: 'operation',
  operations: [
    {
      name: 'config',
      fn: () => {
        return dotenv.config({ path: envFile });
      },
    },
  ],
  benchmarker: 'tinybench',
};
