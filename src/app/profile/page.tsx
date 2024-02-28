'use client';

import {useState} from 'react';
import styles from '../page.module.css';
import Link from 'next/link';

export default function Profile() {

	const currentUser = '1211232997';
	const [userDisplayName, setUserDisplayName] = useState({
		display_name:'',
	});

	function handleShowUser() {
		fetch(`/api/mongodb/user/${currentUser}`)
			.then((res) => res.json())
			.then((data) => setUserDisplayName(data['user']));
	}

	return (
		<section className={styles.main}>
			<p>Welcome to your profile {userDisplayName['display_name']}!</p>
			<button className={styles.button} onClick={handleShowUser}>Test Get User Info</button>
			<p>{JSON.stringify(userDisplayName)}</p>
			<Link href='/' className={styles.card}>Back to Home</Link>
		</section>
	);
}
