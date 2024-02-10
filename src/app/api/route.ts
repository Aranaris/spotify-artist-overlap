async function getBearerToken() {
	const tokenEndpointURI = 'https://accounts.spotify.com/api/token';
	const res = await fetch(tokenEndpointURI, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		body: `grant_type=client_credentials&client_id=${process.env.SPOTIFY_API_CLIENTID}&client_secret=${process.env.SPOTIFY_API_SECRET}`,
	});
	const data = await res.json();
	return data;
}

async function getSpotifyData(url:string, token:string) {
	const res = await fetch(url, {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
	const data = await res.json();
	return data;
}

export const dynamic = 'force-dynamic'; // defaults to auto
export async function GET(request: Request) {
	console.log('testing route...');

	const authData = await getBearerToken();
	console.log(authData.access_token, authData.expires_in);

	const artistURL = 'https://api.spotify.com/v1/artists/45eNHdiiabvmbp4erw26rg?si=2P9PKYwNRO2wpv6shTm0PQ';
	const artistData = await getSpotifyData(artistURL, authData.access_token);

	console.log(artistData);
}
