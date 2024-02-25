import getBearerToken from '@/app/_lib/spotify';

async function getSpotifyData(url:string, token:string): Promise<string> {
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

	const artistURL = 'https://api.spotify.com/v1/artists/45eNHdiiabvmbp4erw26rg?si=2P9PKYwNRO2wpv6shTm0PQ';
	const artistData = await getSpotifyData(artistURL, access_token);

	return Response.json(artistData);
}
