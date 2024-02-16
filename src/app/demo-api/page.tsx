'use client';

import Link from 'next/link';
import styles from '../page.module.css';
import { useState } from 'react';

export default function Test() {

	const [validToken, setValidToken] = useState({});

	function handleClick() {
		fetch('/api/spotify')
			.then((res) => res.json())
			.then((data)=> {
				setValidToken(data['authData'])
			})
	}

	return (
		<main className={styles.main}>
			<h2>Showing currently implemented API calls:</h2>
			<button className={styles.button} onClick={handleClick}>Test Get Bearer Token</button>
			<p>{JSON.stringify(validToken)}</p>
			<Link href='/' className={styles.card}>Back to Home</Link>
		</main>
	);
}
