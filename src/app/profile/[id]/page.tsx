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
	const [overlapData, setOverlapData] = useState<Array<OverlapAggregation>>([]);

	useEffect(() => {
		fetch(`/api/mongodb/user/${currentUser}`)
			.then((res) => res.json())
			.then(setUserInfo);
	}, [currentUser]);

	function handleGetUserTopArtists(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const formData = new FormData(event.currentTarget);
		const rawFormData = {
			type: formData.get('type') as string,
			limit: formData.get('limit') as string,
			time_range: formData.get('time_range') as string,
		};

		try {
			fetch('/api/spotify/top?' + new URLSearchParams(rawFormData))
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
				const dataIndex = tableData.findIndex(x => x.id === related_artist['artist_id']);
				if (dataIndex === -1) {
					tableData.push({
						id: related_artist['artist_id'],
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
		return tableData.filter((result) => result['count'] > 1)
			.sort((a,b) => {
				if (a.count > b.count) {
					return -1;
				}
				if (a.count < b.count) {
					return 1;
				}
				if (a.name > b.name) {
					return -1;
				}
				return 1;
			});
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

			<form onSubmit={handleGetUserTopArtists} className={styles['form-submit']}>
				<label>
					Type:
					<select name='type'>
						<option value='artists'>Artists</option>
						<option value='tracks'>Songs</option>
					</select>
				</label>
				<label>
					Limit:
					<input type='number' name='limit' defaultValue='10' min={1} max={50}></input>
				</label>
				<label>
					Time Range:
					<select name='time_range'>
						<option value='short_term'>Last Month</option>
						<option value='medium_term'>Last 6 Months</option>
						<option value='long_term'>All Time</option>
					</select>
				</label>
				<button type="submit" className={styles.button}>Submit</button>
			</form>
			<ol className={styles['artist-list']}>
				{userTopArtists.map((data: Artist, index) =>
					<li key={data['artist_id']}>
						<p>{index + 1}.</p>
						<Image alt='artist image' className={styles.logo} src={data['images'][0]['url']} width={24} height={24}></Image>
						<p>{data['name']}</p>
						<div className={styles['related-artist-list']}><p><em>Related Artists: </em></p>{data['related_artists'].map((artist) =>
							<p key={data['artist_id'] + artist['artist_id']}>| {artist['name']} |</p>,
						)}
						</div>
					</li>,
				)}
			</ol>

			<div className={styles.center}>
				<h2>Related Artist List</h2>
			</div>
			<ol className={styles['artist-list']}>
				{overlapData.length > 0 && overlapData.map((data, index) =>
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
		</section>
	);
}
