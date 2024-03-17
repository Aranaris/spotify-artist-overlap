import clientPromise from './mongodb';

function setExpiration(date: Date, seconds: number) {
	const dateCopy = new Date(date);
	dateCopy.setSeconds(date.getSeconds() + seconds);
	return dateCopy;
}

export async function getUserToken(userID: string): Promise<string> {
	const client = await clientPromise;
	const db = client.db('spotify_web_app');

	const document = await db.collection('tokens').findOne({
		spotifyid: {$eq: userID},
	}, {sort: {expires: -1}});

	if (document !== null) {
		if (document['expires'] > new Date().toISOString()) {
			return document['access_token'];
		}
		return refreshUserToken(userID, document['refresh_token']);
	}

	return Promise.resolve('');
}

async function refreshUserToken(userID: string, refreshToken: string): Promise<string> {
	const url = 'https://accounts.spotify.com/api/token';

	const fetchInput = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Authorization': 'Basic ' + Buffer.from(`${process.env.SPOTIFY_API_CLIENTID}:${process.env.SPOTIFY_API_SECRET}`).toString('base64'),
		},
		body: `grant_type=refresh_token&refresh_token=${refreshToken}`,
	};
	const body = await fetch(url, fetchInput);
	const authData = await body.json();

	const expires = new Date(Date.now() + 3600 * 1000);

	const userTokenData = {
		access_token: authData['access_token'],
		spotifyid: userID,
		expires,
		scope: authData['scope'],
		refresh_token: authData['refresh_token'],
	};

	await fetch('http://localhost:3000/api/mongodb/', {
		method: 'POST',
		body: JSON.stringify(userTokenData),
	});

	return authData['access_token'];
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

async function getNewTokenFromSpotify(authCode:string): Promise<any> {
	const redirectURI = 'http://localhost:3000/api/callback/';
	const tokenEndpointURI = 'https://accounts.spotify.com/api/token';
	const fetchInput = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Authorization': 'Basic ' + Buffer.from(`${process.env.SPOTIFY_API_CLIENTID}:${process.env.SPOTIFY_API_SECRET}`).toString('base64'),
		},
		body: `grant_type=authorization_code&code=${authCode}&redirect_uri=${encodeURIComponent(redirectURI)}`,
	};

	const res = await fetch(tokenEndpointURI, fetchInput);
	const authData = await res.json();
	return authData;
}

type User = {
	display_name: string,
	href: string,
	images: Array<any>,
	id: string,
}

async function getUserInfo(authCode:string): Promise<User> {
	const spotifyUserEndpointURI = 'https://api.spotify.com/v1/me';
	const fetchInput = {
		method: 'GET',
		headers: {
			Authorization: 'Bearer ' + authCode,
		},
	};

	const res = await fetch(spotifyUserEndpointURI, fetchInput);
	const {id, href, images, display_name, error} = await res.json();

	if (error) {
		throw new Error(error.message);
	}

	const userData = {
		id,
		href,
		images,
		display_name,
	};

	await fetch(`http://localhost:3000/api/mongodb/user/${userData['id']}`, {
		method: 'POST',
		body: JSON.stringify(userData),
	});

	return userData;
}

type Item = {
	name: string,
}

async function getUserTop(userID: string): Promise<Array<Item>> {
	const spotifyUserTopArtistsURI = 'https://api.spotify.com/v1/me/top/artists';
	const token = await getUserToken(userID);
	const fetchInput = {
		method: 'GET',
		headers: {
			Authorization: 'Bearer ' + token,
		},
	};

	const res = await fetch(spotifyUserTopArtistsURI, fetchInput);
	const userTopData = await res.json();
	return userTopData['items'];

}

export {
	getBearerToken,
	getNewTokenFromSpotify,
	getUserInfo,
	getUserTop,
};
