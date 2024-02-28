const Fastify = require('fastify');

const app = Fastify({ logger: false });

app.get('/', (req, reply) => {
  reply.send({ hello: 'world' });
});

const schema = {
  response: {
    default: {
      type: 'object',
      properties: {
        hello: {
          type: 'string',
        }
      }
    },
  },
};

app.get('/schema', schema, (req, reply) => {
  reply.send({ hello: 'world' });
});

app.listen({ port: 3000 }, (err, server) => {
  if (err) throw err;
})
