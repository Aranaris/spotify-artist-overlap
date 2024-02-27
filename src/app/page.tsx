'use client';

import Image from 'next/image';
import styles from './page.module.css';
import Link from 'next/link';
import {setStateCookie} from './actions';
import {useRouter} from 'next/navigation';

export default function Home() {
	const router = useRouter();
	async function handleSpotifyClick() {
		await setStateCookie();
		router.push('/api/spotify/login');
	}
	return (
		<main className={styles.main}>
			<div className={styles.center}>
				<Image alt='site logo' className={styles.logo} src='/logo_vye.svg' width={24} height={24}></Image>
				<h2>Testing Spotify API</h2>
			</div>
			<button className={styles['spotify-login']} onClick={handleSpotifyClick}>
				<Image alt='site logo' className={styles.logo} src='/Spotify_icon.svg' width={24} height={24}></Image>
				<p>Login With Spotify</p>
			</button>
			<Link href='/demo-api' className={styles.card}>Test API Info</Link>
			<div className={styles.description}>
				<p>Additional Resources:</p>
				<Link href='https://github.com/Aranaris/spotify-artist-overlap'>Github Repo</Link>
			</div>

		</main>

	);
}
