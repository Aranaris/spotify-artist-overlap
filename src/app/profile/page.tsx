'use client';

import {useState} from 'react';
import styles from '../page.module.css';

export default function Profile() {

	const [jwt, setJwt] = useState();

	function handleGetJWT() {
		fetch('/api/spotify/')
			.then((res) => res.json())
			.then(setJwt);
	}

	return (
		<section className={styles.main}>
			<p>Welcome to your profile!</p>
			<button className={styles.button} onClick={handleGetJWT}>Test JWT functions</button>
			<p>{JSON.stringify(jwt)}</p>
		</section>
	);
}
