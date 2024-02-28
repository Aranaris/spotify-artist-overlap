import {SignJWT, jwtVerify} from 'jose';

interface UserJwtPayload {
	[key: string]: string,
}

const key = new TextEncoder().encode(process.env.JWT_SECRET_KEY);

export async function encrypt(payload: UserJwtPayload) {
	return await new SignJWT(payload)
		.setProtectedHeader({alg:'HS256'})
		.setIssuedAt()
		.setExpirationTime('5 minutes from now')
		.sign(key);
}

export async function decrypt(input: string): Promise<any>{
	const {payload} = await jwtVerify(input, key, {
		algorithms: ['HS256'],
	});
	return payload;
}
