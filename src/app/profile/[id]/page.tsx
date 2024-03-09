'use client';

import {useEffect, useState} from 'react';
import styles from '../../page.module.css';
import Link from 'next/link';

export default function Profile({params}: { params: { id: string } }) {

	const currentUser = params.id;
	const [userDisplayName, setUserDisplayName] = useState({
		display_name:'',
	});
	const [sessionPayload, setSessionPayload] = useState({});

	useEffect(() => {
		fetch(`/api/mongodb/user/${currentUser}`)
			.then((res) => res.json())
			.then(setUserDisplayName);
	}, [currentUser]);

	function handleGetSessionPayload() {
		fetch('/api/spotify/auth')
			.then(res => res.json()).then(setSessionPayload);
	}

	return (
		<section className={styles.main}>
			<p>Welcome to your profile {userDisplayName['display_name']}!</p>
			<p>{JSON.stringify(userDisplayName)}</p>

			<button className={styles.button} onClick={handleGetSessionPayload}>Show Session Payload</button>
			<p>{JSON.stringify(sessionPayload)}</p>
			<Link href='/' className={styles.card}>Back to Home</Link>
		</section>
	);
}
