'use client';

import {useState} from 'react';
import styles from '../page.module.css';
import {Artist} from '@/app/_lib/spotify';

export default function Explore() {

	const [relatedArtists, setRelatedArtists] = useState<Artist[]>([]);

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
				});

		} catch(err: any) {
			console.log(err.message);
		}
	}

	return (
		<section className={styles.main}>
			<button className={styles.button} onClick={handleGetRelatedArtists}>View Related Artists</button>
			<div className={styles.center}>
				<h2>Related Artist List</h2>
			</div>
			<ol className={styles['artist-list']}>
				{relatedArtists.map((data: Artist, index) =>
					<li key={data['artist_id']}>
						<p>{data['artist_id']}</p>
						<p>{data['name']}</p>
					</li>,
				)}
			</ol>
		</section>
	);
}
