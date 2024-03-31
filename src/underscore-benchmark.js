const underscore = require('underscore');

module.exports = {
  name: 'underscore',
  type: 'operation',
  operations: [
    {
      name: '.chunk',
      fn: () => {
        underscore.chunk(['a', 'b', 'c', 'd'], 2);
      },
    },
    {
      name: '.groupBy',
      fn: () => {
        underscore.groupBy([6.1, 4.2, 6.3], Math.floor);
      },
    },
    {
      name: '.includes',
      fn: () => {
        underscore.includes({ 'a': 1, 'b': 2 }, 1);
      },
    },
    {
      name: '.orderBy',
      fn: () => {
        const users = [
          { 'user': 'fred',   'age': 48 },
          { 'user': 'barney', 'age': 34 },
          { 'user': 'fred',   'age': 40 },
          { 'user': 'barney', 'age': 36 }
        ];
        underscore.sortBy(users, ['user', 'age'], ['asc', 'desc']);
      }
    }
  ],
  benchmarker: 'tinybench',
};
