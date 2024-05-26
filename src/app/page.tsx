'use client';

import styles from './page.module.css';

export default function Home() {
	return (
		<main className={styles.main}>
			<div className={styles.center}>
				<h2>Listening Insights</h2>
				<p>View your profile to see top artists and track the evolution of your music journey</p>
			</div>
			<div className={styles.center}>
				<h2>Music Exploration</h2>
				<p>Unlock the Spotify music library and find new favorites with tailored recommendations based on your listening history</p>
			</div>
			<div className={styles.center}>
				<h2>...Get Started!</h2>
				<p>Click the Login button to link your Spotify and start discovering music!</p>
			</div>
		</main>

	);
}
