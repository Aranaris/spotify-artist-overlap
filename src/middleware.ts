import {NextRequest, NextResponse} from 'next/server';
// import { verifyJWT } from './app/_lib/spotify';

export async function middleware(request: NextRequest) {
	const jwtToken = request.cookies.get('session')?.value;
	const verifiedToken =
		jwtToken;

	if (verifiedToken) {
		console.log('successful authentication');
		return NextResponse.next();
	}
	console.log('unauthenticated');
	return NextResponse.redirect('http://localhost:3000/');
}

export const config = {
	matcher: ['/profile/:path'],
};

