import getBearerToken from '@/app/_lib/spotify';


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
	console.log('testing spotify get artist by id route...');

	const access_token = await getBearerToken();

	const artistID = '45eNHdiiabvmbp4erw26rg';
	const artistURL = `https://api.spotify.com/v1/artists/${artistID}`;
	const artistData = await getSpotifyData(artistURL, access_token);

	const relatedArtistsURL = `https://api.spotify.com/v1/artists/${artistID}/related-artists`;
	const relatedArtistsData = await getSpotifyData(relatedArtistsURL, access_token);
	const relatedArtistsList = [];
	for (const artist of relatedArtistsData.artists) {
		relatedArtistsList.push(artist.name);
	}

	// const currentUserData = await getSpotifyData('https://api.spotify.com/v1/me', access_token);
	// console.log(currentUserData);

	artistData.artists = relatedArtistsList;

	return Response.json(artistData);
}
