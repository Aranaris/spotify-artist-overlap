'use client';
import styles from './page.module.css';
import Link from 'next/link';


export default function Home() {
	return (
		<main className={styles.main}>
			<div className={styles.center}>
				<h2>Listening Insights</h2>
				<p>View your profile to see top artists and track the evolution of your music journey</p>
			</div>
			<div className={styles.center}>
				<h2>Discover Music</h2>
				<p>Explore the Spotify music library and find new favorites with tailored recommendations based on your listening history</p>
			</div>
			<div className={styles.description}>
				<p>Additional Resources:</p>
				<Link href='https://github.com/Aranaris/spotify-artist-overlap'>Github Repo</Link>
			</div>

		</main>

	);
}
