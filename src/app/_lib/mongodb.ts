import * as mongoDB from 'mongodb';

const client:mongoDB.MongoClient = new mongoDB.MongoClient(process.env.MONGODB_URI, {
	serverApi: {
		version: mongoDB.ServerApiVersion.v1,
		// turning off strict because it affects text index queries
		// strict: true,
		deprecationErrors: true,
	},
});

const clientPromise = client.connect();

export default clientPromise;
