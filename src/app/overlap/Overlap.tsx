'use client';

import styles from '../page.module.css';
import {useState} from 'react';
import {Artist} from '../_lib/spotify';

export default function Overlap() {
	const [overlapData, setOverlapData] = useState<Array<OverlapAggregation>>([]);

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
						name: related_artist['artist_name'],
						count: 1,
						related: [artist['artist_name']],
					});
				} else {
					tableData[dataIndex]['count']++;
					tableData[dataIndex]['related'].push(artist['artist_name']);
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
		<section className={styles.card}>
			<h2>Artist Recommendations</h2>
			<ol className={styles['artist-list']}>
				{overlapData.length > 0 && overlapData.map((data, index) =>
					<li key={data['id']}>
						<p>{index + 1}.</p>
						<p>{data['name']}</p>
						<p>{data['count']}</p>
						<div className={styles['related-artist-list']}><p><em>Matching Artists: </em></p>{data['related'].map((artist) =>
							<p key={data['id'] + artist}>| {artist} |</p>,
						)}
						</div>
					</li>,
				)}
			</ol>
		</section>
	);
}
