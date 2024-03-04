const moment = require('moment');

module.exports = {
  name: 'moment',
  type: 'operation',
  operations: [
    {
      name: 'format (full)',
      fn: () => {
        return moment().format('MMMM Do YYYY, h:mm:ss a');
      },
    },
    {
      name: 'format',
      fn: () => {
        return moment().format();
      },
    },
    {
      name: 'fromNow (YYYYMMDD)',
      fn: () => {
        return moment('20111031', 'YYYYMMDD').fromNow();
      },
    },
    {
      name: 'subtract (10)',
      fn: () => {
        return moment().subtract(10, 'days').calendar();
      },
    },
  ],
  benchmarker: 'benchmarkjs',
};
