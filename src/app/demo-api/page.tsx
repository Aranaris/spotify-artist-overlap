'use client';

import Link from 'next/link';
import styles from '../page.module.css';
import {useState} from 'react';

export default function Test() {

	const [validToken, setValidToken] = useState({});
	const [mongoOutput, setMongoOutput] = useState({});
	const [spotifyArtist, setSpotifyArtist] = useState({
		name : '',
	});

	function handleSpotifyTokenClick() {
		fetch('/api/spotify/auth')
			.then((res) => res.json())
			.then(setValidToken);
	}

	function handleSpotifyGetArtistClick() {
		fetch('/api/spotify/')
			.then((res) => res.json())
			.then(setSpotifyArtist);
	}

	function handleGetMongoOutput() {
		fetch('/api/mongodb')
			.then((res) => res.json())
			.then(setMongoOutput);
	}

	return (
		<main className={styles.main}>
			<h2>Showing currently implemented API calls:</h2>
			<button className={styles.button} onClick={handleSpotifyTokenClick}>Test Get Bearer Token</button>
			<p>{JSON.stringify(validToken)}</p>

			<button className={styles.button} onClick={handleSpotifyGetArtistClick}>Test Get Artist Info</button>
			<p>{spotifyArtist.name}</p>

			<button className={styles.button} onClick={handleGetMongoOutput}>Test Mongo Query</button>
			<p>{JSON.stringify(mongoOutput)}</p>
			<Link href='/' className={styles.card}>Back to Home</Link>
		</main>
	);
}
