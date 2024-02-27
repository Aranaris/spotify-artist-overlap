import {redirect} from 'next/navigation';
import {NextRequest, NextResponse} from 'next/server';

export function middleware(request: NextRequest) {
	const currentUser = request.cookies.get('currentUser')?.value;
	if (currentUser) {
		return NextResponse.next();
	}
	redirect('/');
}

export const config = {
	matcher: ['/profile/:path'],
};

