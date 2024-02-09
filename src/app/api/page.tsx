import Link from 'next/link';
import styles from '../page.module.css'

export default function Test() {
	return (
		<main className={styles.main}>
			<h2>Showing currently implemented API calls:</h2>
			<Link href='/' className={styles.card}>Back to Home</Link>
		</main>
	);
}
