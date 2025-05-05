require('dotenv').config();
const admin = require('firebase-admin');   
const fastify = require('fastify')({ logger: true });
const cors = require('@fastify/cors');
fastify.register(cors, { origin: '*' });

const serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
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

fastify.get('/me', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    try {
        const userId = request.user.uid;

        const userReference = db.collection('users').doc(userId);
        const doc = await userReference.get();

        if (!doc.exists) {
            return reply.status(404).send({ message: 'User does not exist.' });
        }

        return reply.status(200).send(doc.data());

    } catch (error) {
        fastify.log.error(err);
        return reply.status(400).send({ message: err.message });
    }
});


// profiles endpoint for retrieving
fastify.get('/profiles/:id', async (request, reply) => {
    try {
        // retreive
        const { id } = request.params;
        const snapshot = await db.collection('users').get();
        let user = null;
        snapshot.forEach(doc => {
            if(doc.id === id) { user = ({ id: doc.id, ...doc.data() }); }
        })
        if(!user) {
            throw { message: "User not found." };
        }
        else {
            return ({ user });
        }
    } catch (error) {
        reply.status(404).send({ error: error.message });
    }
});


// like endpoint
fastify.post('/api/like', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    try {
        const { toUserId } = request.body;
        const fromUserId = request.user.uid;

        if (!toUserId) {
            return reply.status(400).send({ message: 'Invalid payload.' });
        }

        const userReference = db.collection('users').doc(fromUserId);
        const doc = await userReference.get();

        const toUserReference = db.collection('users').doc(toUserId); //switched to users
        const toDoc = await toUserReference.get();

        if (!doc.exists) {
            return reply.status(404).send({ message: 'User does not exist.' });
        }

        if (!toDoc.exists) {
            return reply.status(404).send({ message: 'Liked user does not exist.' });
        }

        const likes = doc.data().likes || [];
        if (likes.includes(toUserId)) {
            return reply.status(400).send({ message: 'A like for this user already exists.' });
        }

        await userReference.update({
            likes: admin.firestore.FieldValue.arrayUnion(toUserId),
        });

        const toLikes = toDoc.data().likes || [];
        const fromUserName = doc.data().fullName;
        const toUserName = toDoc.data().fullName; //switched from name to fullName
        console.log(toUserName);
        if (toLikes.includes(fromUserId)) {
            const matchRef = db.collection('matches').doc();
            await matchRef.set({
                user1: fromUserId,
                user1name: fromUserName,
                user2: toUserId,
                user2name: toUserName,
                timestamp: admin.firestore.FieldValue.serverTimestamp(), // Store timestamp from the server
            });
            return reply.status(200).send({ message: 'Match detected' });
        }

        return reply.status(200).send({ message: 'Like recorded' });

    } catch (err) {
        fastify.log.error(err);
        return reply.status(400).send({ message: err.message });
    }
});
    

// unlike endpoint
fastify.post('/api/unlike',  { preHandler: [fastify.authenticate] }, async (request, reply) => {
    try {
        const { toUserId } = request.body;
        const fromUserId = request.user.id;

        // if toUserId is null, throw invalid payload
        if(!toUserId) { throw { message: 'Invalid payload.' }; }

        const userReference = db.collection('users').doc(fromUserId);
        const doc = await userReference.get();

        // check if user exists
        if(!doc.exists) { throw { message: 'User does not exist.'}; }

        const likes = doc.data().likes || [];
        if(!likes.includes(toUserId)) { throw { message: 'No like exists for this user.' }; }

        // otherwise remove likes
        else {
            await userReference.update({
                likes : admin.firestore.FieldValue.arrayRemove(toUserId),
            })
        }

        return reply.status(200).send({ message: 'Success' });
    }
    catch (err) {
        // catch error and report
        fastify.log.error(err);
        reply.status(400).send({ message: err.message })
    }
});

//get liked profiles
fastify.get('/api/getLikes', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    try {
        const fromUserId = request.user.uid;

        const userReference = db.collection('users').doc(fromUserId);
        const doc = await userReference.get();

        if (!doc.exists) {
            return reply.status(404).send({ message: 'User does not exist.' });
        }

        const likes = doc.data().likes || [];
        return reply.status(200).send({
            message: likes.length > 0 ? 'Success' : 'No likes',
            likes: likes
        });

    } catch (err) {
        fastify.log.error(err);
        return reply.status(400).send({ message: err.message });
    }
});

//get matches
fastify.get('/api/getMatches', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    try {
        const fromUserId = request.user.uid;

        const matchesRef = db.collection('matches');
        const matches = [];

        const matchesSnapshot = await matchesRef
            .where('user1', '==', fromUserId)
            .get();

        const matchesSnapshot2 = await matchesRef
            .where('user2', '==', fromUserId)
            .get();
        //could do one get and just check later if user 1 or 2 is person
        
        matchesSnapshot.forEach(doc => {
            matches.push({ id: doc.id, likedUser: doc.data().user2name, date: doc.data().timestamp });
        });

        matchesSnapshot2.forEach(doc => {
            matches.push({ id: doc.id, likedUser: doc.data().user1name, date: doc.data().timestamp });
        });

        console.log(matches);

        return reply.status(200).send({
            message: matches.length > 0 ? 'Matches found' : 'No matches found',
            matches
        });
    } catch (err) {
        fastify.log.error(err);
        return reply.status(400).send({ message: err.message });
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
    
    
