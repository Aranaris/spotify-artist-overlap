'use client';
//TODO refactor this into a server component and use session to update values
import Link from 'next/link';
import styles from '../page.module.css';
import {useState} from 'react';

export default function Test() {

	const [validToken, setValidToken] = useState({});
	const [spotifyArtist, setSpotifyArtist] = useState({
		name : '',
		artists: [],
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

	return (
		<main className={styles.main}>
			<h2>Showing currently implemented API calls:</h2>
			<button className={styles.button} onClick={handleSpotifyTokenClick}>Test Get Bearer Token</button>
			<p>Bearer Token: {JSON.stringify(validToken)}</p>

			<button className={styles.button} onClick={handleSpotifyGetArtistClick}>Test Get Artist Info</button>
			<p>Artist: {spotifyArtist.name}</p>
			<p>Related Artists: {JSON.stringify(spotifyArtist.artists)}</p>
			<Link href='/' className={styles.card}>Back to Home</Link>
		</main>
	);
}
