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
	const [userTopArtists, setUserTopArtists] = useState<Artist[]>([]);
	const [tableData, setOverlapData] = useState<Array<OverlapAggregation>>([]);

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
				}).then((data) => {
					setUserTopArtists(data);
					setOverlapData(calculateOverlapData(data));
				});

		} catch(err: any) {
			console.log(err.message);
		}
	}

	type OverlapAggregation = {
		id: string,
		name: string,
		count: number,
		related: Array<string>,
	}

	function calculateOverlapData(data: Array<Artist>): Array<OverlapAggregation> {
		const tableData = [];
		for (const artist of data) {
			for (const related_artist of artist['related_artists']) {
				const dataIndex = tableData.findIndex(x => x.id === related_artist['id']);
				if (dataIndex === -1) {
					tableData.push({
						id: related_artist['id'],
						name: related_artist['name'],
						count: 1,
						related: [artist['name']],
					});
				} else {
					tableData[dataIndex]['count']++;
					tableData[dataIndex]['related'].push(artist['name']);
				}
			}
		}
		return tableData.filter((result) => result['count'] > 1);
	}

	return (
		<section className={styles.main}>
			{userInfo['display_name'] !== '' &&
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
					<li key={data['id']}>
						<p>{index + 1}.</p>
						<Image alt='artist image' className={styles.logo} src={data['images'][0]['url']} width={24} height={24}></Image>
						<p>{data['name']}</p>
						<div className={styles['related-artist-list']}><p><em>Related Artists: </em></p>{data['related_artists'].map((artist) =>
							<p key={data['id'] + artist['id']}>| {artist['name']} |</p>,
						)}
						</div>
					</li>,
				)}
			</ol>

			<div className={styles.center}>
				<h2>Related Artist List</h2>
			</div>
			<ol className={styles['artist-list']}>
				{tableData.length > 0 && tableData.map((data, index) =>
					<li key={data['id']}>
						<p>{index + 1}.</p>
						<p>{data['name']}</p>
						<p>{data['count']}</p>
						<div className={styles['related-artist-list']}><p><em>Related Artists: </em></p>{data['related'].map((artist) =>
							<p key={data['id'] + artist}>| {artist} |</p>,
						)}
						</div>
					</li>,
				)}
			</ol>
			<button className={styles.button} onClick={handleGetSessionPayload}>Show Session Payload</button>
			<p>{JSON.stringify(sessionPayload)}</p>
			<Link href='/' className={styles.card}>Back to Home</Link>
		</section>
	);
}
