import clientPromise from './mongodb';

async function getUserToken(userID: string): Promise<string> {
	const client = await clientPromise;
	const db = client.db('spotify_web_app');

	const document = await db.collection('tokens').findOne({
		spotifyid: {$eq: userID},
	}, {sort: {expires: -1}});

	if (document !== null) {
		const tokenExpiration = new Date(document['expires']);
		if (tokenExpiration > new Date()) {
			return document['access_token'];
		} else {
			console.log('token expired, refreshing...');
			return await refreshUserToken(userID, document['refresh_token']);
		}
	}
	console.log('no valid token');
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

	const expires = new Date(Date.now() + authData['expires_in']);

	if (typeof authData['refresh_token'] === 'undefined') {
		authData['refresh_token'] = refreshToken;
	}

	const userTokenData:Token = {
		access_token: authData['access_token'],
		spotifyid: userID,
		expires,
		scope: authData['scope'],
		refresh_token: authData['refresh_token'],
	};

	try {
		await saveTokenToDB(userTokenData);
	} catch (err) {
		console.log(err);
	}


	return authData['access_token'];
}

async function getNewTokenFromSpotify(authCode:string): Promise<any> {
	const redirectURI = `${process.env.BASE_URL}/api/callback/`;
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

	try {
		await fetch(`${process.env.BASE_URL}/api/mongodb/user/${userData['id']}`, {
			method: 'POST',
			body: JSON.stringify(userData),
		});
	} catch (err) {
		console.log(err);
	}

	return userData;
}

export type Artist = {
	artist_name: string,
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

	return await updateArtists(userTopData['items']);
}

async function updateArtists(artists:Array<any>): Promise<Array<Artist>>{
	const client = await clientPromise;
	const db = client.db('spotify_web_app');

	// check to see if artist data is already stored

	for (const i in artists) {
		const artistID = artists[i]['id'];
		const artistName = artists[i]['name'];
		artists[i]['artist_name'] = artistName;
		artists[i]['artist_id'] = artistID;

		const artist = await db.collection('artists').findOne({
			artist_id: {$eq: artistID},
		});

		if (artist === null) {
			await db.collection('artists').updateOne(
				{artist_id: {$eq: artistID}},
				{$set: {
					artist_id: artistID,
					artist_name: artistName,
					popularity: artists[i]['popularity'],
					updated: new Date().toISOString(),
				}},
				{upsert:true});
		}
	}

	return artists;
}

async function getRelatedArtists(artistName: string, userID: string): Promise<Array<Artist>> {

	const client = await clientPromise;
	const db = client.db('spotify_web_app');

	//search artist by name
	const search = await db.collection('artists').find( {$text: {$search: artistName}}).toArray();
	const artist = search[0];

	// check to see if artist data is already stored

	if (artist.length === 0) {
		throw new Error('artist data unavailable');
	}

	if ('related_artists' in artist) {
		console.log('retrieved data from mongodb');
		return artist['related_artists'];
	}

	const accessToken = await getUserToken(userID);
	const spotifyRelatedArtistsURL = `https://api.spotify.com/v1/artists/${artist['artist_id']}/related-artists`;
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
			artist_name: data['name'],
		};
	});

	await db.collection('artists').updateOne(
		{artist_id: {$eq: artist['artist_id']}},
		{$set: {
			related_artists,
			updated: new Date().toISOString(),
		}},
		{upsert:false});

	return related_artists;
}


export interface Token {
	access_token: string,
	spotifyid: string,
	expires: Date,
	scope: string,
	refresh_token: string,
}

export async function saveTokenToDB(tokenData:Token) {
	const client = await clientPromise;
	const db = client.db('spotify_web_app');

	if (typeof tokenData['refresh_token'] === 'undefined') {
		throw new Error('no refresh token');
	}
	await db.collection('tokens').insertOne(tokenData);
	console.log('user token added');
}
export {
	getNewTokenFromSpotify,
	getUserInfo,
	getUserTop,
	getRelatedArtists,
};
