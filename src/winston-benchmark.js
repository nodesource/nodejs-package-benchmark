const fs = require('node:fs');
const winston = require('winston');

const logger = winston.createLogger({
  transports: [
    new winston.transports.Stream({
      stream: fs.createWriteStream('/dev/null'),
    }),
  ],
});

module.exports = {
  name: 'winston',
  type: 'operation',
  operations: [
    {
      name: 'info (10x)',
      fn: () => {
        for (let i = 0; i < 10; ++i) {
          logger.log('info', 'hello world');
        }
      },
    },
  ],
  benchmarker: 'bench-node',
};
