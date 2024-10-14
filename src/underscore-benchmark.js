const underscore = require('underscore');
const assert = require('node:assert');

module.exports = {
  name: 'underscore',
  type: 'operation',
  operations: [
    {
      name: '.chunk',
      fn: () => {
        assert.ok(underscore.chunk(['a', 'b', 'c', 'd'], 2));
      },
    },
    {
      name: '.groupBy',
      fn: () => {
        assert.ok(underscore.groupBy([6.1, 4.2, 6.3], Math.floor));
      },
    },
    {
      name: '.includes',
      fn: () => {
        assert.ok(underscore.includes({ 'a': 1, 'b': 2 }, 1));
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
        assert.ok(underscore.sortBy(users, ['user', 'age'], ['asc', 'desc']));
      }
    }
  ],
  benchmarker: 'bench-node',
};
