const fastify = require('fastify')({ logger: true });
const cors = require('@fastify/cors');

fastify.register(cors, { origin: '*' });

fastify.get('/', async (request, reply) => {
    return { message: 'Hello from our backend!' };
});

fastify.post('/api/like', async (request, reply) => {
    try {
        const data = request.body;
        const toUserId = data['toUserId'];
        console.log(toUserId);
    } catch (err) {
        // catch error and report
        fastify.log.error(err);
        process.exit(1);
    }
});

const start = async () => {
    try {
        await fastify.listen({ port: 3000 });
        console.log('Server is running on http://localhost:3000');
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

start();
