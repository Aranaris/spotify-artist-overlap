import {NextRequest} from 'next/server';
import {updateSession} from './app/_lib/auth';

export async function middleware(request: NextRequest) {
	console.log('test middleware');
	return await updateSession(request);

	// if (verifiedToken) {
	// 	console.log('successful authentication');
	// 	return NextResponse.next();
	// }
	// console.log('unauthenticated');
	// return NextResponse.redirect('http://localhost:3000/');
}

export const config = {
	matcher: ['/profile/:path*'],
};

