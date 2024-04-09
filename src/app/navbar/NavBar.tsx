'use client';

import Link from 'next/link';
import styles from '../page.module.css';
import Image from 'next/image';
import {clearSessionCookie, setStateCookie} from '../actions';
import {useRouter} from 'next/navigation';
import {Menu} from '@headlessui/react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCaretDown} from '@fortawesome/free-solid-svg-icons';

export default function NavBar(props: {session: any}) {
	const router = useRouter();

	async function handleSpotifyClick() {
		await setStateCookie();
		router.push('/api/spotify/login');
	}

	async function handleLogOutClick() {
		await clearSessionCookie();
	}
	return (
		<nav className={styles.nav}>
			<Link className={styles.logo} href='/'>
				<Image alt='site logo' className={styles.logo} src='/logo_vye.svg' width={24} height={24}></Image>
				<p>Muse Metrics</p>
			</Link>
			<section className={styles.navlinks}>
				<Link href='/explore'>Explore</Link>
				<Link href='/about'>About</Link>
				<Link href='/demo-api'>Demo API</Link>
				{!props.session && <button className={styles['spotify-login']} onClick={handleSpotifyClick}>
					<p>Login With</p>
					<Image alt='site logo' className={styles.logo} src='/Spotify_Logo_RGB_Black.png' width={70} height={21}></Image>
				</button>}
				{props.session &&
				<div>
					<Menu>
						<Menu.Button className={styles['spotify-username']}>
							<FontAwesomeIcon className='fa-1x' icon={faCaretDown}/> <p>{props.session.display_name}</p>
						</Menu.Button>
						<Menu.Items className={styles['menu-dropdown']}>
							<Menu.Item>
								<Link href='/profile'>My Profile</Link>
							</Menu.Item>
							<Menu.Item>
								<Link href='/' onClick={handleLogOutClick}>Log Out</Link>
							</Menu.Item>
						</Menu.Items>
					</Menu>
				</div>
				}
			</section>
		</nav>
	);
}
