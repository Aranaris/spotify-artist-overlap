import {NextRequest, NextResponse} from 'next/server';

export function middleware(request: NextRequest) {
	const currentUser = request.cookies.get('currentUser')?.value;
	if (currentUser) {
		console.log('successful authentication');
		return NextResponse.next();
	}
	console.log('unauthenticated');
	NextResponse.redirect(new URL('/', request.url));
}

export const config = {
	matcher: ['/profile/:path'],
};

