const assert = require('node:assert');
const moment = require('moment');

module.exports = {
  name: 'moment',
  type: 'operation',
  operations: [
    {
      name: 'format (full)',
      fn: () => {
        assert.ok(moment().format('MMMM Do YYYY, h:mm:ss a'));
      },
    },
    {
      name: 'format',
      fn: () => {
        assert.ok(moment().format());
      },
    },
    {
      name: 'fromNow (YYYYMMDD)',
      fn: () => {
        assert.ok(moment('20111031', 'YYYYMMDD').fromNow());
      },
    },
    {
      name: 'subtract (10)',
      fn: () => {
        assert.ok(moment().subtract(10, 'days').calendar());
      },
    },
  ],
  benchmarker: 'bench-node',
};
