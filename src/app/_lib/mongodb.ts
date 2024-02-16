import * as mongoDB from "mongodb";

const uri:string = process.env.MONGODB_URI!;

const client:mongoDB.MongoClient = new mongoDB.MongoClient(uri, {
	'serverApi': {
		'version': mongoDB.ServerApiVersion.v1,
		'strict': true,
		'deprecationErrors': true,
	}
});

const clientPromise = client.connect();

export default clientPromise;
