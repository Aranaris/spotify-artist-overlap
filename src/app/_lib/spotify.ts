import clientPromise from "./mongodb";

async function getBearerToken() {

	// const client = await clientPromise;
	// const db = client.db('spotify_web_app')


	// const token_query = 
	// const token = await db.collection

	const tokenEndpointURI = 'https://accounts.spotify.com/api/token';
	const fetchInput = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		body: `grant_type=client_credentials&client_id=${process.env.SPOTIFY_API_CLIENTID}&client_secret=${process.env.SPOTIFY_API_SECRET}`,
	}

	const res = await fetch(tokenEndpointURI, fetchInput);
	// const authData = await res.json();

	// await db.collection('token').insertOne(authData);

	return res;
}

export default getBearerToken;
