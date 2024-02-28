import clientPromise from './mongodb';
// import { importSPKI, jwtVerify } from 'jose';

function setExpiration(date: Date, seconds: number) {
	const dateCopy = new Date(date);
	dateCopy.setSeconds(date.getSeconds() + seconds);
	return dateCopy;
}

async function getBearerToken(): Promise<string> {

	const client = await clientPromise;
	const db = client.db('spotify_web_app');

	// check to see if a new token is necessary

	const document = await db.collection('tokens').findOne({
		expire_date: {$gt: new Date()},
	});

	if (document !== null) {
		return document['access_token'];
	}

	// if no valid token, get a new one from spotify and store in MongoDB
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

async function getUserAccessToken(authCode:string): Promise<string> {
	const redirectURI = 'http://localhost:3000/api/callback/';
	const tokenEndpointURI = 'https://accounts.spotify.com/api/token';
	const fetchInput = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Authorization': 'Basic ' + (Buffer.from(process.env.SPOTIFY_API_CLIENTID + ':' + process.env.SPOTIFY_API_SECRET)).toString('base64'),
		},
		body: `grant_type=authorization_code&code=${authCode}&redirect_uri=${encodeURIComponent(redirectURI)}`,
	};

	const res = await fetch(tokenEndpointURI, fetchInput);
	const authData = await res.json();
	const {access_token} = authData;
	return access_token;
}

async function getUserInfo(authCode:string) {
	const spotifyUserEndpointURI = 'https://api.spotify.com/v1/me';
	const fetchInput = {
		method: 'GET',
		headers: {
			Authorization: 'Bearer ' + authCode,
		},
	};

	const res = await fetch(spotifyUserEndpointURI, fetchInput);
	const userData = await res.json();
	const {display_name, id, href} = userData;
	return {display_name, id, href};

}
// async function verifyJWT(token:string) :Promise<boolean>{
// 	const publicKey = await importSPKI(process.env.JWT_PUBLIC_KEY, 'RS256');
// 	const decoded = await jwtVerify(token, publicKey);
// 	console.log(decoded);
// 	return false;
// }

export {
	getBearerToken,
	getUserAccessToken,
	getUserInfo,
	// verifyJWT,
};
