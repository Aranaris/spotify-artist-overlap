import {nanoid} from 'nanoid';
import {redirect} from 'next/navigation';

export async function GET(request: Request) {

	//TODO need to store and check state in callback
	const state = nanoid(16);
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
