'use client';

import Link from 'next/link';
import styles from '../page.module.css';
import Image from 'next/image';
import {setStateCookie} from '../actions';
import {useRouter} from 'next/navigation';

export default function NavBar () {
	const router = useRouter();
	async function handleSpotifyClick() {
		await setStateCookie();
		router.push('/api/spotify/login');
	}
	return (
		<nav className={styles.nav}>
			<Link className={styles.logo} href='/'>
				<Image alt='site logo' className={styles.logo} src='/logo_vye.svg' width={24} height={24}></Image>
				<p>Muse Metrics</p>
			</Link>
			<section className={styles.navlinks}>
				<Link href='/profile'>Profile</Link>
				<Link href='/explore'>Explore</Link>
				<Link href='/about'>About</Link>
				<Link href='/demo-api'>Demo API</Link>
				<button className={styles['spotify-login']} onClick={handleSpotifyClick}>
					<p>Login With</p>
					<Image alt='site logo' className={styles.logo} src='/Spotify_Logo_RGB_Black.png' width={70} height={21}></Image>
				</button>
			</section>
		</nav>
	);
}
