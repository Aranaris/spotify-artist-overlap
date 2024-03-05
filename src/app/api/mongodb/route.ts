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

	// const client = await clientPromise;
}
