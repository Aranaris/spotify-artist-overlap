import {getSession} from '@/app/_lib/auth';

export const dynamic = 'force-dynamic'; // defaults to auto
export async function GET(request: Request) {
	const parsed = await getSession();
	return Response.json(parsed);
}
