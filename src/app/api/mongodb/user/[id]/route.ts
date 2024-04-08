import clientPromise from '@/app/_lib/mongodb';

export const dynamic = 'force-dynamic'; // defaults to auto
export async function GET(
	request: Request,
	{params}: { params: {id:string}},
) {
	console.log('testing get user route for user: ' + params.id);

	const userID = params.id;

	const client = await clientPromise;
	const db = client.db('spotify_web_app');

	const user = await db.collection('users').findOne({id: userID});

	if (user) {
		return Response.json({
			display_name: user['display_name'],
			link: user['href'],
			image_url: user['images'][0]['url'],
			id: user['id'],
			followers: user['followers']['total'],
		});
	}

}

export async function POST(
	request: Request,
	{params}: { params: {id:string}},
) {
	console.log('testing post user mongodb route...');

	const client = await clientPromise;
	const db = client.db('spotify_web_app');

	const userData = await request.json();
	const userID = params.id;
	const user = await db.collection('users').findOne({id: userID});

	if (!user) {
		await db.collection('users').insertOne(userData);
		console.log('user added!');
	}

	return Response.json({});
}
