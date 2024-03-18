'use client';

import {useEffect, useState} from 'react';
import styles from '../../page.module.css';
import Link from 'next/link';
import Image from 'next/image';
import {Artist} from '@/app/_lib/spotify';

export default function Profile({params}: { params: { id: string } }) {

	const currentUser = params.id;
	const [userInfo, setUserInfo] = useState({
		display_name:'',
		link:'',
		image_url:'',
	});

	const [sessionPayload, setSessionPayload] = useState({});
	const [userTopArtists, setUserTopArtists] = useState([]);

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
		try {
			fetch('/api/spotify/top')
				.then((res) => {
					if (!res.ok) throw new Error('Failed to retrieve data'); return res.json();
				}).then(setUserTopArtists);
		} catch(err: any) {
			console.log(err.message);
		}
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

			<button className={styles.button} onClick={handleGetUserTopArtists}>View My Top Artists</button>
			<ol className={styles['artist-list']}>
				{userTopArtists.map((data: Artist, index) =>
					<li key={data['id']}><p>{index + 1}.</p><Image alt='artist image' className={styles.logo} src={data['images'][0]['url']} width={24} height={24}></Image>{data['name']}</li>,
				)}
			</ol>

			<button className={styles.button} onClick={handleGetSessionPayload}>Show Session Payload</button>
			<p>{JSON.stringify(sessionPayload)}</p>
			<Link href='/' className={styles.card}>Back to Home</Link>
		</section>
	);
}
