'use client';

import styles from '../page.module.css';
import {Artist} from '../_lib/spotify';
import {MouseEvent, useState} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faRefresh} from '@fortawesome/free-solid-svg-icons';

interface OverlapProps {
	artists: Array<Artist>,
}

type OverlapAggregation = {
	id: string,
	name: string,
	count: number,
	related?: Array<string>,
}

export default function Overlap({artists}: OverlapProps) {

	const [showRecs, setShowRecs] = useState(0);
	const [overlapData, setOverlapData] = useState<OverlapAggregation[]>([]);

	async function handleGenerateRecs(event: MouseEvent<HTMLButtonElement>) {
		event.preventDefault();
		console.log('generating recs...');
		const updatedArtistList = artists;
		try {
			for (const artist of updatedArtistList) {
				await fetch('/api/spotify/related-artists', {
					method:'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({artistname: artist['artist_name']}),
				})
					.then((res) => {
						if (!res.ok) {
							throw new Error(`Failed to retrieve data for ${artist['artist_name']}`);
						}
						return res.json();
					}).then((data) => {
						artist['related_artists'] = data;
					});
			}
			setShowRecs(1);
			setOverlapData(calculateOverlapData(updatedArtistList));
		} catch(err: any) {
			console.log(err.message);
		}
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
		<section className={styles.overlap}>
			{showRecs ? (
				<section className={styles.overlap}>
					<div className={styles['section-header']}>
						<h2>Recommended Artists</h2>
						<button onClick={handleGenerateRecs} className={styles.button}>
							<FontAwesomeIcon className='fa-1x' icon={faRefresh}/>
						</button>
					</div>
					<ol className={styles['artist-list']}>
						{overlapData.length > 0 && overlapData.map((data) =>
							<li key={data['id']}>
								<span>{data['name']}</span>
								<div className={styles['overlap-artists']}>
									<p>{data['count']} Matching Artists</p>
									<div className={styles['related-artist-list']}>{data['related'].map((artist) =>
										<p key={data['id'] + artist}> {artist}</p>,
									)}
									</div>
								</div>
							</li>,
						)}
					</ol>
				</section>
			):(<button onClick={handleGenerateRecs} className={styles.button}>Show Recommendations</button>)}
		</section>
	);
}
