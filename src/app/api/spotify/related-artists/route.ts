import {getSession} from '@/app/_lib/auth';
import {getRelatedArtists, getUserToken} from '@/app/_lib/spotify';
import {NextRequest} from 'next/server';

export const dynamic = 'force-dynamic'; // defaults to auto
export async function POST(request: NextRequest) {
	console.log('testing spotify get related artists route...');
	const parsed = await getSession();
	if (parsed === null) {
		throw new Error('no active session');
	}

	try {
		const token = await getUserToken(parsed['spotifyid']);
		const requestData = await request.json();
		const artistID = requestData['artistid'];
		const relatedArtists = await getRelatedArtists(artistID, token);

		return Response.json(relatedArtists);
	} catch (err) {
		console.log(err);
	}
}
