import {getSession} from '@/app/_lib/auth';
import {getUserTop} from '@/app/_lib/spotify';
import {NextRequest} from 'next/server';

export const dynamic = 'force-dynamic'; // defaults to auto
export async function GET(request: NextRequest) {
	console.log('testing spotify get top artists route...');
	const parsed = await getSession();
	const userID = parsed['spotifyid'];

	const topData = await getUserTop(userID);
	if (topData === undefined || topData.length === 0) {
		throw new Error('no items retrieved');
	}
	const artists = topData.map(data => data['name']);

	return Response.json(artists);
}
