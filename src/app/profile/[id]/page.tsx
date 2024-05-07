'use client';

import {FormEvent, useEffect, useState} from 'react';
import styles from '../../page.module.css';
import Image from 'next/image';
import {Artist} from '@/app/_lib/spotify';

export default function Profile({params}: { params: { id: string } }) {

	const currentUser = params.id;
	const [userInfo, setUserInfo] = useState({
		id: '',
		display_name: '',
		link: '',
		image_url: '',
		followers: 0,
	});

	const [userTopArtists, setUserTopArtists] = useState<Artist[]>([]);

	useEffect(() => {
		fetch(`/api/mongodb/user/${currentUser}`)
			.then((res) => res.json())
			.then(setUserInfo);
	}, [currentUser]);

	function handleGetUserTopArtists(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const formData = new FormData(event.currentTarget);
		const rawFormData = {
			// type: formData.get('type') as string,
			type: 'artists',
			limit: formData.get('limit') as string,
			time_range: formData.get('time_range') as string,
		};

		try {
			fetch('/api/spotify/top?' + new URLSearchParams(rawFormData))
				.then((res) => {
					if (!res.ok) throw new Error('Failed to retrieve data'); return res.json();
				}).then((data) => {
					setUserTopArtists(data);
					// setOverlapData(calculateOverlapData(data));
				});

		} catch(err: any) {
			console.log(err.message);
		}
	}

	return (
		<section className={styles.main}>
			{userInfo['display_name'] !== '' &&
			<div className={styles['profile-header']}>
				<Image alt='user profile' className={styles.logo} src={userInfo['image_url']} width={24} height={24}></Image>
				<h2>{userInfo['display_name']}</h2>
				<ul className={styles['info-list']}>
					<li>Spotify ID: {userInfo['id']}</li>
					<li>Followers: {userInfo['followers']}</li>
				</ul>
			</div>
			}
			<div className={styles['section-header']}>
				<h2>Top Artists</h2>
			</div>
			<form onSubmit={handleGetUserTopArtists} className={styles['form-submit']}>
				<label>
					Time Range:
					<select name='time_range'>
						<option value='short_term'>Last Month</option>
						<option value='medium_term'>Last 6 Months</option>
						<option value='long_term'>All Time</option>
					</select>
				</label>
				<label>
					Limit:
					<input type='number' name='limit' defaultValue='10' min={1} max={50}></input>
				</label>
				<button type="submit" className={styles.button}>View</button>
			</form>
			<ol className={styles['artist-list']}>
				{userTopArtists.map((data: Artist, index) =>
					<li key={data['artist_id']}>
						<p>{index + 1}.</p>
						<Image alt='artist image' className={styles.logo} src={data['images'][0]['url']} width={24} height={24}></Image>
						<p>{data['name']}</p>

					</li>,
				)}
			</ol>
		</section>
	);
}
