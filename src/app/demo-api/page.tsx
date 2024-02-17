'use client';

import Link from 'next/link';
import styles from '../page.module.css';
import { useState } from 'react';

export default function Test() {

	const [validToken, setValidToken] = useState({});
	const [mongoOutput, setMongoOutput] = useState({});

	function handleSpotifyTokenClick() {
		fetch('/api/spotify')
			.then((res) => res.json())
			.then((data)=> {
				setValidToken(data['access_token'])
			})
	}

	function handleGetMongoOutput() {
		fetch('/api/mongodb')
			.then((res) => res.json())
			.then((data)=> {
				setMongoOutput(data)
			})
	}

	return (
		<main className={styles.main}>
			<h2>Showing currently implemented API calls:</h2>
			<button className={styles.button} onClick={handleSpotifyTokenClick}>Test Get Bearer Token</button>
			<p>{JSON.stringify(validToken)}</p>

			<button className={styles.button} onClick={handleGetMongoOutput}>Test Mongo Query</button>
			<p>{JSON.stringify(mongoOutput)}</p>
			<Link href='/' className={styles.card}>Back to Home</Link>
		</main>
	);
}
