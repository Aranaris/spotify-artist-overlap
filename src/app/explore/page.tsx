'use client';

import {FormEvent, useState} from 'react';
import styles from '../page.module.css';
import {Artist} from '@/app/_lib/spotify';

export default function Explore() {

	const [relatedArtists, setRelatedArtists] = useState<Artist[]>([]);

	async function handleGetRelatedArtists(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();

		const data = new FormData(event.currentTarget);
		const artistName = data.get('artistname') as string;

		try {
			await fetch('/api/spotify/related-artists', {
				method:'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({artistname: artistName}),
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
			<form onSubmit={handleGetRelatedArtists} className={styles['form-submit']}>
				<label>
					See Related Artists for:
					<input type='text' name='artistname' defaultValue='Illenium'></input>
				</label>
				<button type='submit' className={styles.button}>Search</button>
			</form>
			<div className={styles.center}>
				<h2>Related Artists:</h2>
			</div>
			<ol className={styles['artist-list']}>
				{relatedArtists.map((data: Artist, index) =>
					<li key={data['artist_id']}>
						<p>{data['artist_id']}</p>
						<p>{data['artist_name']}</p>
					</li>,
				)}
			</ol>
		</section>
	);
}
