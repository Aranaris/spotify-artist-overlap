import styles from '../page.module.css';
import Link from 'next/link';

export default function Footer() {
	return (
		<footer className={styles.footer}>
			<div className={styles['spotify-disclaimer']}>
				<p>Music data and artist images are provided by Spotify. Spotify is a trademark of Spotify AB.</p>
			</div>
			<div className={styles.description}>
				<ul className={styles['info-list']}>
					<li><Link href='https://github.com/Aranaris/spotify-artist-overlap'>Github Source Code</Link></li>
					<li><Link href='https://developer.spotify.com/documentation/web-api'>Spotify API Documentation</Link></li>
				</ul>
			</div>
		</footer>
	);
}
