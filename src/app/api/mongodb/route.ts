import clientPromise from '@/app/_lib/mongodb';

export const dynamic = 'force-dynamic'; // defaults to auto
export async function GET(request: Request) {
	console.log('testing mongodb route...');

	const client = await clientPromise;
	const db = client.db('spotify_web_app');
	const userList = await db.collection('users').findOne({});

	return Response.json(userList);

}

export async function POST(request: Request) {
	console.log('testing mongodb route...');

	const client = await clientPromise;

	const db = client.db('spotify_web_app');
	const userTokenData = await request.json();

	try {
		await db.collection('tokens').insertOne(userTokenData);
		console.log('user token added');
		return Response.json({});
	} catch (err) {
		console.log(err);
		return new Response('Internal server error', {status: 500});
	}

}
