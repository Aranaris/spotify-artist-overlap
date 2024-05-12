import {getSession} from '@/app/_lib/auth';
import {getUserTop} from '@/app/_lib/spotify';
import {NextRequest} from 'next/server';

export const dynamic = 'force-dynamic'; // defaults to auto
export async function GET(request: NextRequest) {
	console.log('testing spotify get top artists route...');

	const parsed = await getSession();
	if (parsed === null) {
		throw new Error('no active session');
	}
	const userID = parsed['spotifyid'];
	const type = request.nextUrl.searchParams.get('type');
	const limit = request.nextUrl.searchParams.get('limit');
	const time_range = request.nextUrl.searchParams.get('time_range');

	const topData = await getUserTop(
		userID,
		type!==null?type:undefined,
		limit!==null?limit:undefined,
		time_range!==null?time_range:undefined);
	if (topData === undefined || topData.length === 0) {
		throw new Error('no items retrieved');
	} else if (topData.length < Number(limit)){
		console.log(`${topData.length} artists retrieved`);
	}

	return Response.json(topData);
}
