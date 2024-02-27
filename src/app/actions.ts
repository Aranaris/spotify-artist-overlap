'use server';

import {nanoid} from 'nanoid';
import {cookies} from 'next/headers';

export async function setStateCookie() {
	const state = nanoid(16);
	cookies().set('state', state);
}
