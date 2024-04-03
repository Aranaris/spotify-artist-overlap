import {getSession} from '../_lib/auth';
import {NextRequest, NextResponse} from 'next/server';

export async function GET(req: NextRequest) {
	const parsed = await getSession();
	const url = req.nextUrl.clone();
	if (parsed) {
		url.pathname = `/profile/${parsed['spotifyid']}`;
		return NextResponse.redirect(url);
	}

	//TODO: add unauthorized/please login page
	url.pathname = '/';
	return NextResponse.redirect(url);
}
