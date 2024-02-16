'use client';

import Link from 'next/link';
import styles from '../page.module.css';
import { useEffect, useState } from 'react';

export default function Test() {

	const [validToken, setValidToken] = useState({});

	useEffect(() => {
		fetch('/api/spotify')
			.then((res) => res.json())
			.then((data)=> {
				setValidToken(data['authData'])
			})
	},[])

	return (
		<main className={styles.main}>
			<h2>Showing currently implemented API calls:</h2>
			<p>{JSON.stringify(validToken)}</p>
			<Link href='/' className={styles.card}>Back to Home</Link>
		</main>
	);
}
