const { MongoClient } = require('mongodb');
require('dotenv').config({ 'path': '.env.local'});

const testClient = new MongoClient(
	process.env.MONGODB_URI
);

async function run() {
	await testClient.connect();
	const result = testClient.db('spotify_web_app').collection('tokens').find({});
	for await (const doc of result) {
		console.log(doc)
	}
	await testClient.close();
}

run()


