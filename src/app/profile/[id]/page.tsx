'use client';

import {useEffect, useState} from 'react';
import styles from '../../page.module.css';
import Link from 'next/link';
import Image from 'next/image';

export default function Profile({params}: { params: { id: string } }) {

	const currentUser = params.id;
	const [userInfo, setUserInfo] = useState({
		display_name:'',
		link:'',
		image_url:'',
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
			.then((res) => {
				if (!res.ok) throw new Error('Failed to retrieve data'); return res.json();
			}).then(setUserTopArtists);
	}

	return (
		<section className={styles.main}>
			{ userInfo['display_name'] !== '' &&
			<div className={styles.center}>
				<Image alt='user profile' className={styles.logo} src={userInfo['image_url']} width={24} height={24}></Image>
				<h2>{userInfo['display_name']}</h2>
			</div>
			}
			<ul className={styles['info-list']}>
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
