import getBearerToken from '@/app/_lib/spotify';

export const dynamic = 'force-dynamic'; // defaults to auto
export async function GET(request: Request) {
	console.log('testing spotify route...');

	const access_token = await getBearerToken();

	return Response.json(access_token);
}
