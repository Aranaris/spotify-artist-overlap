import {cookies} from 'next/headers';

export async function GET(request: Request) {

	const state = cookies().get('state')?.value;

	if (typeof state === 'undefined') {
		return Response.json({status: 400});
	}

	if (cookies().get('auth')) {
		cookies().delete('state');
		return Response.redirect(new URL('/profile', request.url));
	}

	const redirectURI = `${process.env.BASE_URL}/api/callback/`;
	const scope = 'user-top-read';

	const params = {
		response_type: 'code',
		client_id: process.env.SPOTIFY_API_CLIENTID || '',
		scope: scope,
		state: state,
		redirect_uri:redirectURI,
	};
	const searchParams = new URLSearchParams(params);

	const spotifyAuthURI = `https://accounts.spotify.com/authorize?${searchParams}`;
	return Response.redirect(spotifyAuthURI);
}
