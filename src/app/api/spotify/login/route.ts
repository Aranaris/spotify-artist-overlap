import {cookies} from 'next/headers';
import {redirect} from 'next/navigation';

export async function GET(request: Request) {

	const state = cookies().get('state')?.value;

	if (typeof state === 'undefined') {
		return Response.json({status: 400});
	}

	const redirectURI = 'http://localhost:3000/api/callback/';
	const scope = 'user-top-read';

	const params = {
		response_type: 'code',
		client_id: process.env.SPOTIFY_API_CLIENTID || '',
		scope: scope,
		state: state,
	};
	const searchParams = new URLSearchParams(params).toString();
	const spotifyAuthURI = 'https://accounts.spotify.com/authorize?'
	+ searchParams + `&redirect_uri=${encodeURIComponent(redirectURI)}`;

	redirect(spotifyAuthURI);
}
