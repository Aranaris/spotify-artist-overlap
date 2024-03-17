'use client';

import {useEffect, useState} from 'react';
import styles from '../../page.module.css';
import Link from 'next/link';

export default function Profile({params}: { params: { id: string } }) {

	const currentUser = params.id;
	const [userInfo, setUserInfo] = useState({
		display_name:'',
		link:'',
	});

	const [sessionPayload, setSessionPayload] = useState({});
	const [userTopArtists, setUserTopArtists] = useState({});

	useEffect(() => {
		fetch(`/api/mongodb/user/${currentUser}`)
			.then((res) => res.json())
			.then(setUserInfo);
	}, [currentUser]);

	function handleGetSessionPayload() {
		fetch('/api/spotify/auth')
			.then(res => res.json()).then(setSessionPayload);
	}

	function handleGetUserTopArtists() {
		fetch('/api/spotify/top')
			.then(res => res.json()).then(setUserTopArtists);
	}

	return (
		<section className={styles.main}>
			<p>Welcome to your profile {userInfo['display_name']}!</p>
			<ul>
				<li>Display Name: {userInfo['display_name']}</li>
				<li>Spotify API Link: <a href={userInfo['link']}>{userInfo['link']}</a></li>
			</ul>

			<button className={styles.button} onClick={handleGetUserTopArtists}>Get Top Artists</button>
			<p>{JSON.stringify(userTopArtists)}</p>

			<button className={styles.button} onClick={handleGetSessionPayload}>Show Session Payload</button>
			<p>{JSON.stringify(sessionPayload)}</p>
			<Link href='/' className={styles.card}>Back to Home</Link>
		</section>
	);
}
