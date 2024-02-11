async function getBearerToken() {
	const tokenEndpointURI = 'https://accounts.spotify.com/api/token';
	const res = await fetch(tokenEndpointURI, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		body: `grant_type=client_credentials&client_id=${process.env.SPOTIFY_API_CLIENTID}&client_secret=${process.env.SPOTIFY_API_SECRET}`,
	});

	return res;
}

const spotifyBearerToken = getBearerToken();

export default spotifyBearerToken;
