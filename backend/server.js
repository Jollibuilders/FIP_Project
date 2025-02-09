require('dotenv').config();
const admin = require('firebase-admin');   
const fastify = require('fastify')({ logger: true });
const cors = require('@fastify/cors');
fastify.register(cors, { origin: '*' });

const serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY,
};

// initializing Firebase Admin with service account credentialss
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

// initialize db
const db = admin.firestore();
  
fastify.decorate('authenticate', async (request, reply) => {
  try {
      const authHeader = request.headers.authorization;
      if (!authHeader) {
          return reply.code(401).send({ error: 'No token provided' });
        }
        
        const token = authHeader.split(' ')[1];
        if (!token) {
            return reply.code(401).send({ error: 'Invalid token format' });
        }
        
        const decodedToken = await admin.auth().verifyIdToken(token);
        request.user = decodedToken;
    } catch (error) {
        return reply.code(401).send({ error: 'Unauthorized', details: error.message });
    }
});

// root endpoint 
fastify.get('/', async (request, reply) => {
    return { message: 'Hello from our backend!' };
});

// like endpoint
fastify.post('/api/like', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    try {
        // get toUserId and authenticated user's id (from request.user)
        const { toUserId } = request.body;
        const fromUserId = request.user.uid; // Using the authenticated user's uid

        // if toUserId is null, throw invalid payload
        if(!toUserId) { throw { message: 'Invalid payload.' }; }
        
        // create a new document in Firestore likes with fromUserId, toUserId
        const userReference = db.collection('users').doc(fromUserId);
        const doc = await userReference.get();

        // check if user exists
        if(!doc.exists) { throw { message: 'User does not exist.' }; }

        // checks if user data for likes exists; if not return empty array
        const likes = doc.data().likes || [];
        if(likes.includes(toUserId)) { throw { message: 'A like for this user already exists.' }; }

        // otherwise, update userArray
        else {
            await userReference.update({
                likes: admin.firestore.FieldValue.arrayUnion(toUserId),
            });
        }
        
        // if everything has been achieved, return json success
        return { message : 'Success', statusCode : 200, };
        
    } catch (err) {
        // catch error and report
        fastify.log.error(err);
        return { message : err['message'], statusCode : 400};
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
    
    