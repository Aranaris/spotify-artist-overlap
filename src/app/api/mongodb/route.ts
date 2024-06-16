import clientPromise from '@/app/_lib/mongodb';

export async function POST(request: Request) {
	console.log('testing mongodb post route...');

	try {
		const client = await clientPromise;
		const db = client.db('spotify_web_app');
		const userTokenData = await request.json();

		if (typeof userTokenData['refresh_token'] === 'undefined') {
			throw new Error('no refresh token');
		}
		await db.collection('tokens').insertOne(userTokenData);
		console.log('user token added');
		return Response.json({});
	} catch (err) {
		console.log(err);
		return new Response('Internal server error', {status: 500});
	}

}
