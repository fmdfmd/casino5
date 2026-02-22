'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './Favorites.module.scss';
import { slotsData } from '@/data/slots';
import HeaderUpGetbonus from '@/components/HeaderUp/HeaderUpGetbonus';
import Header from '@/components/Header/Header';
import SlideBar from '@/components/SlideBar/SlideBar';
import Footer from '@/components/Footer/Footer';
import Chat from '@/widgets/chat/ui';
import PlayCard from '@/components/PlayCard/PlayCard';

export default function Favorites() {
	const router = useRouter();
	const [favorites] = useState(slotsData.slice(0, 6));
	const [preferences] = useState(slotsData.slice(6, 12));
	const [recommendations] = useState(slotsData.slice(12, 18));

	const handleInfoClick = (id: number) => {
		console.log('Клик по info ID:', id);
	};

	const handleGameClick = (slug: string) => {
		router.push(`/game/${slug}`);
	};

	return (
		<>
			{/* <HeaderUpGetbonus /> */}
			<Header />

			<div className={styles.wrapper}>
				<SlideBar />

				<main className={styles.mainContent}>
					<div className={styles.container}>
						{/* --- SECTION 1: FAVORITES --- */}
						<h1 className={styles.pageTitle}>FAVORITES</h1>
						{favorites.length > 0 ? (
							<div className={styles.grid}>
								{favorites.map((slot) => (
									<div
										key={slot.id}
										className={styles.cardWrapper}
										onClick={() => handleGameClick(slot.slug)}
										style={{ cursor: 'pointer' }}
									>
										<PlayCard
											item={{
												id: slot.id,
												title: slot.title,
												imageSrc: slot.imageSrc,
												linkHref: `/game/${slot.slug}`,
											}}
											onInfoClick={handleInfoClick}
										/>
									</div>
								))}
							</div>
						) : (
							<div className={styles.emptyState}>
								<div className={styles.emptyIcon}>💔</div>
								<h2>No favorites yet</h2>
								<p>
									It looks like you haven't added any games to your favorites
									yet.
								</p>
								<button
									className={styles.goHomeBtn}
									onClick={() => router.push('/')}
								>
									Go to Games
								</button>
							</div>
						)}

						{/* --- SECTION 2: BASED ON PREFERENCES --- */}
						<h2 className={styles.sectionTitle}>
							RECOMMENDED GAMES BASED ON YOUR PREFERENCES
						</h2>
						{preferences.length > 0 ? (
							<div className={styles.grid}>
								{preferences.map((slot) => (
									<div
										key={slot.id}
										className={styles.cardWrapper}
										onClick={() => handleGameClick(slot.slug)}
										style={{ cursor: 'pointer' }}
									>
										<PlayCard
											item={{
												id: slot.id,
												title: slot.title,
												imageSrc: slot.imageSrc,
												linkHref: `/game/${slot.slug}`,
											}}
											onInfoClick={handleInfoClick}
										/>
									</div>
								))}
							</div>
						) : (
							<div className={styles.emptyStateSimple}>
								<h2>We are learning your taste... 🕵️‍♂️</h2>
							</div>
						)}

						{/* --- SECTION 3: RECOMMENDATIONS --- */}
						{recommendations.length > 0 && (
							<>
								<h2 className={styles.sectionTitle}>RECOMMENDATIONS</h2>
								<div className={styles.grid}>
									{recommendations.map((slot) => (
										<div
											key={slot.id}
											className={styles.cardWrapper}
											onClick={() => handleGameClick(slot.slug)}
											style={{ cursor: 'pointer' }}
										>
											<PlayCard
												item={{
													id: slot.id,
													title: slot.title,
													imageSrc: slot.imageSrc,
													linkHref: `/game/${slot.slug}`,
												}}
												onInfoClick={handleInfoClick}
											/>
										</div>
									))}
								</div>
							</>
						)}
					</div>
				</main>
			</div>

			<Chat />
			<Footer />
		</>
	);
}
