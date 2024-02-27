'use server';

import {nanoid} from 'nanoid';
import {cookies} from 'next/headers';

export async function setCookie() {
	const state = nanoid(16);
	cookies().set('state', state);
}
