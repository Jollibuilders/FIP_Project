const fastify = require('fastify')({ logger: true });
const cors = require('@fastify/cors');

fastify.register(cors, { origin: '*' });

fastify.get('/', async (request, reply) => {
    return { message: 'Hello from our backend!' };
});

fastify.get('/profiles', async (request, reply) => {
    try {
        const snapshot = await db.collection('users').get();
        let users = [];
        snapshot.forEach(doc => {
            users.push({ id: doc.id, ...doc.data() });
        });
        return { users };
    } catch (error) {
        reply.status(500).send({ error: 'Error fetching profiles for display' });
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