const pino = require('pino');
const logger = pino(pino.destination('/dev/null'));

module.exports = {
  name: 'pinojs',
  type: 'operation',
  operations: [
    {
      name: 'info (10x)',
      fn: () => {
        for (let i = 0; i < 10; ++i) {
          logger.info('hello world');
        }
      },
    },
  ],
  benchmarker: 'bench-node',
};
