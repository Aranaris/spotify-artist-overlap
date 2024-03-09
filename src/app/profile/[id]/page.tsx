'use client';

import {useEffect, useState} from 'react';
import styles from '../../page.module.css';
import Link from 'next/link';

export default function Profile({params}: { params: { id: string } }) {

	const currentUser = params.id;
	const [userDisplayName, setUserDisplayName] = useState({
		display_name:'',
	});
	const [topArtistList, setTopArtistList] = useState({});

	useEffect(() => {
		fetch(`/api/mongodb/user/${currentUser}`)
			.then((res) => res.json())
			.then(setUserDisplayName);
	}, [currentUser]);

	async function handleGetTopArtists() {
		await fetch('/api/spotify/top')
			.then(res => res.json).then(setTopArtistList);
	}

	return (
		<section className={styles.main}>
			<p>Welcome to your profile {userDisplayName['display_name']}!</p>
			<p>{JSON.stringify(userDisplayName)}</p>

			<button className={styles.button} onClick={handleGetTopArtists}>Get Top Artists</button>
			<p>{JSON.stringify(topArtistList)}</p>
			<Link href='/' className={styles.card}>Back to Home</Link>
		</section>
	);
}
