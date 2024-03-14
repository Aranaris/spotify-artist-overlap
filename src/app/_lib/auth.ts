import {SignJWT, jwtVerify} from 'jose';
import {cookies} from 'next/headers';
import {NextRequest, NextResponse} from 'next/server';

interface UserJwtPayload {
	[key: string]: string,
}

const key = new TextEncoder().encode(process.env.JWT_SECRET_KEY);

export async function encrypt(payload: UserJwtPayload) {
	return await new SignJWT(payload)
		.setProtectedHeader({alg:'HS256'})
		.setIssuedAt()
		.setExpirationTime('30 minutes from now')
		.sign(key);
}

export async function decrypt(input: string): Promise<any>{
	const {payload} = await jwtVerify(input, key, {
		algorithms: ['HS256'],
	});
	return payload;
}

export async function getSession() {
	const session = cookies().get('session')?.value;
	if(!session) return null;
	return await decrypt(session);
}

export async function updateSession(request: NextRequest) {
	const session = cookies().get('session')?.value;
	if(!session) return;

	const parsed = await decrypt(session);
	parsed.expires = new Date(Date.now() + 30 * 60 * 1000);

	const res = NextResponse.next();
	res.cookies.set({
		name: 'session',
		value: await encrypt(parsed),
		httpOnly: true,
		expires: parsed.expires,
	});

	return res;
}
