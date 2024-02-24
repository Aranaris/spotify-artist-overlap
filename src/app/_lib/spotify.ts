import clientPromise from './mongodb';

function setExpiration(date: Date, seconds: number) {
	const dateCopy = new Date(date);
	dateCopy.setSeconds(date.getSeconds() + seconds);
	return dateCopy;
}


async function getBearerToken(): Promise<string> {

	const client = await clientPromise;
	const db = client.db('spotify_web_app');

	// check to see if a new token is necessary
	// const token_query =
	// const token = await db.collection

	const tokenEndpointURI = 'https://accounts.spotify.com/api/token';
	const fetchInput = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		body: `grant_type=client_credentials&client_id=${process.env.SPOTIFY_API_CLIENTID}&client_secret=${process.env.SPOTIFY_API_SECRET}`,
	};

	const res = await fetch(tokenEndpointURI, fetchInput);
	const authData = await res.json();
	const currentDate = new Date();
	const expireDate = setExpiration(currentDate, authData['expires_in']);
	authData['expire_date'] = expireDate;

	await db.collection('tokens').insertOne(authData);

	return authData['access_token'];
}

export default getBearerToken;
