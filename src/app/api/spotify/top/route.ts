import {getSession} from '@/app/_lib/auth';
import {getUserTop} from '@/app/_lib/spotify';
import {NextRequest} from 'next/server';

export const dynamic = 'force-dynamic'; // defaults to auto
export async function GET(request: NextRequest) {
	console.log('testing spotify get top artists route...');
	const parsed = await getSession();
	const userID = parsed['id'];
	const topData = await getUserTop(userID);
	const artists = [];
	for (const data of topData['items']) {
		artists.push(data['name']);
	}
	return Response.json(artists);
}
