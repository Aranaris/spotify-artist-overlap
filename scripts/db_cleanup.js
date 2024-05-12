const {MongoClient} = require('mongodb');
require('dotenv').config({path: '.env.local'});

const testClient = new MongoClient(
	process.env.MONGODB_URI,
);

async function run() {
	await testClient.connect();
	await testClient.db('spotify_web_app')
		.collection('tokens').deleteMany({});
	await testClient.db('spotify_web_app')
		.collection('users').deleteMany({});
	await testClient.db('spotify_web_app')
		.collection('artists').deleteMany({});
	await testClient.db('spotify_web_app').collection('artists').dropIndexes();
	await testClient.db('spotify_web_app').collection('artists').createIndex({artist_name: 'text'});

	await testClient.close();
}

run();


