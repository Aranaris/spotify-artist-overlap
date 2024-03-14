import {NextRequest} from 'next/server';
import {updateSession} from './app/_lib/auth';

export async function middleware(request: NextRequest) {
	return await updateSession(request);
}

export const config = {
	matcher: ['/profile/:path*'],
};

