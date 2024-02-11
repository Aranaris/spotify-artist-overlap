import clientPromise from "@/app/_lib/mongodb";

export const dynamic = 'force-dynamic'; // defaults to auto
export async function GET(request: Request) {
	console.log('testing mongodb route...');

	const client = await clientPromise;
	const db = client.db('sample_mflix');

	const movies = await db.collection('movies').findOne({'rated': 'TV-G'});

	return Response.json({ movies })

}
