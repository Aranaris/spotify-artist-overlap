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
	const tokenEndpointURL = 'https://accounts.spotify.com/api/token';
	const fetchInput = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		body: `grant_type=client_credentials&client_id=${process.env.SPOTIFY_API_CLIENTID}&client_secret=${process.env.SPOTIFY_API_SECRET}`,
	};

	const res = await fetch(tokenEndpointURL, fetchInput);
	const authData = await res.json();
	const currentDate = new Date();
	const expireDate = setExpiration(currentDate, authData['expires_in']);
	authData['expire_date'] = expireDate;

	await db.collection('tokens').insertOne(authData);

	return authData['access_token'];
}

async function getNewTokenFromSpotify(authCode:string): Promise<any> {
	const redirectURI = 'http://localhost:3000/api/callback/';
	const tokenEndpointURL = 'https://accounts.spotify.com/api/token';
	const fetchInput = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Authorization': 'Basic ' + Buffer.from(`${process.env.SPOTIFY_API_CLIENTID}:${process.env.SPOTIFY_API_SECRET}`).toString('base64'),
		},
		body: `grant_type=authorization_code&code=${authCode}&redirect_uri=${encodeURIComponent(redirectURI)}`,
	};

	const res = await fetch(tokenEndpointURL, fetchInput);
	const authData = await res.json();
	return authData;
}

type Image = {
	url: string,
	height: number,
	width: number,
}

export type User = {
	display_name: string,
	href: string,
	images: Array<Image>,
	id: string,
	followers: {
		total: number,
	}
}

async function getUserInfo(authCode:string): Promise<User> {
	const spotifyUserEndpointURL = 'https://api.spotify.com/v1/me';
	const fetchInput = {
		method: 'GET',
		headers: {
			Authorization: 'Bearer ' + authCode,
		},
	};

	const res = await fetch(spotifyUserEndpointURL, fetchInput);
	const {id, href, images, followers, display_name, error} = await res.json();

	if (error) {
		throw new Error(error.message);
	}

	const userData = {
		id,
		href,
		images,
		followers,
		display_name,
	};

	await fetch(`http://localhost:3000/api/mongodb/user/${userData['id']}`, {
		method: 'POST',
		body: JSON.stringify(userData),
	});

	return userData;
}

export type Artist = {
	name: string,
	artist_id: string,
	images: Array<Image>,
	related_artists: Array<Artist>,
}

async function getUserTop(userID: string, type = 'artists', limit = '25', time_range = 'medium_term'): Promise<Array<Artist>> {

	const apiData = {
		limit,
		time_range,
	};

	const apiSearchParams = new URLSearchParams(apiData);

	const spotifyUserTopArtistsURL = `https://api.spotify.com/v1/me/top/${type}?${apiSearchParams.toString()}`;
	const token = await getUserToken(userID);
	const fetchInput = {
		method: 'GET',
		headers: {
			Authorization: 'Bearer ' + token,
		},
	};

	const res = await fetch(spotifyUserTopArtistsURL, fetchInput);
	const userTopData = await res.json();
	const artists = userTopData['items'];
	for (const i in artists) {
		const related_artists = await getRelatedArtists(artists[i]['id'], token);

		artists[i]['related_artists'] = related_artists;
	}
	return artists;

}

async function getRelatedArtists(artistID: string, accessToken: string): Promise<Array<Artist>> {

	const client = await clientPromise;
	const db = client.db('spotify_web_app');

	// check to see if artist data is already stored

	const artist = await db.collection('artists').findOne({
		artist_id: {$eq: artistID},
	});

	if (artist !== null) {
		if ('related_artists' in artist) {
			console.log('retrieved data from mongodb');
			return artist['related_artists'];
		}
	}

	const spotifyRelatedArtistsURL = `https://api.spotify.com/v1/artists/${artistID}/related-artists`;
	const fetchInput = {
		method: 'GET',
		headers: {
			Authorization: 'Bearer ' + accessToken,
		},
	};

	const res = await fetch(spotifyRelatedArtistsURL, fetchInput);
	const artistData = await res.json();

	const related_artists = artistData['artists'].map((data:any) => {
		return {
			artist_id: data['id'],
			name: data['name'],
		};
	});

	await db.collection('artists').updateOne(
		{artist_id: {$eq: artistID}},
		{$set: {
			related_artists,
			updated: new Date().toISOString(),
		}},
		{upsert:true});

	return related_artists;
}

export {
	getBearerToken,
	getNewTokenFromSpotify,
	getUserInfo,
	getUserTop,
	getRelatedArtists,
};
