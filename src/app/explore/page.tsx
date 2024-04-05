'use client';

import {useState} from 'react';
import styles from '../page.module.css';
import {Artist} from '@/app/_lib/spotify';

export default function Explore() {

	const [relatedArtists, setRelatedArtists] = useState<Artist[]>([]);
	const [overlapData, setOverlapData] = useState<Array<OverlapAggregation>>([]);

	function handleGetRelatedArtists() {
		try {
			fetch('/api/spotify/related-artists', {
				method:'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({artistid: '45eNHdiiabvmbp4erw26rg'}),
			})
				.then((res) => {
					if (!res.ok) throw new Error('Failed to retrieve data'); return res.json();
				}).then((data) => {
					setRelatedArtists(data);
					// setOverlapData(calculateOverlapData(data));
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
		return tableData.filter((result) => result['count'] > 0)
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
			<button className={styles.button} onClick={handleGetRelatedArtists}>View Related Artists</button>
			<ol className={styles['artist-list']}>
				{relatedArtists.map((data: Artist, index) =>
					<li key={data['id']}>
						<p>{data['id']}</p>
						<p>{data['name']}</p>
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
