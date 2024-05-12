import {getSession} from '@/app/_lib/auth';
import {getRelatedArtists} from '@/app/_lib/spotify';
import {NextRequest} from 'next/server';

export const dynamic = 'force-dynamic'; // defaults to auto
export async function POST(request: NextRequest) {
	console.log('testing spotify get related artists route...');
	const parsed = await getSession();
	if (parsed === null) {
		throw new Error('no active session');
	}

	try {
		const requestData = await request.json();
		const artistName = requestData['artistName'];
		const relatedArtists = await getRelatedArtists(artistName, parsed['spotifyid']);

		return Response.json(relatedArtists);
	} catch (err) {
		console.log(err);
	}
}
