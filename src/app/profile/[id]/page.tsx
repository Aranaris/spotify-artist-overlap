'use client';

import {useEffect, useState} from 'react';
import styles from '../../page.module.css';
import Link from 'next/link';

export default function Profile({params}: { params: { id: string } }) {

	const currentUser = params.id;
	const [userDisplayName, setUserDisplayName] = useState({
		display_name:'',
	});

	useEffect(() => {
		fetch(`/api/mongodb/user/${currentUser}`)
			.then((res) => res.json())
			.then(setUserDisplayName);
	}, [currentUser]);

	return (
		<section className={styles.main}>
			<p>Welcome to your profile {userDisplayName['display_name']}!</p>
			{/* <button className={styles.button} onClick={handleShowUser}>Test Get User Info</button> */}
			<p>{JSON.stringify(userDisplayName)}</p>
			<Link href='/' className={styles.card}>Back to Home</Link>
		</section>
	);
}
