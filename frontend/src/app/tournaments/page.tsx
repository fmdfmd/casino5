'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './page.module.scss';
import { tournamentsData, Tournament } from '@/data/tournamentsData';
import HeaderUpGetbonus from '@/components/HeaderUp/HeaderUpGetbonus';
import Header from '@/components/Header/Header';
import SlideBar from '@/components/SlideBar/SlideBar';
import Footer from '@/components/Footer/Footer';

const TournamentCard: React.FC<{ tournament: Tournament }> = ({
	tournament,
}) => {
	const { timer } = tournament;

	const renderTimerItems = () => (
		<>
			<div className={styles.timerBox}>
				<span className={styles.timeVal}>{timer.days}</span>
				<span className={styles.timeLabel}>Days</span>
			</div>
			<div className={styles.timerBox}>
				<span className={styles.timeVal}>{timer.hours}</span>
				<span className={styles.timeLabel}>Hours</span>
			</div>
			<div className={styles.timerBox}>
				<span className={styles.timeVal}>{timer.minutes}</span>
				<span className={styles.timeLabel}>Minutes</span>
			</div>
			<div className={styles.timerBox}>
				<span className={styles.timeVal}>{timer.seconds}</span>
				<span className={styles.timeLabel}>Seconds</span>
			</div>
		</>
	);

	return (
		<div className={styles.cardWrapper}>
			<div className={styles.mainBlock}>
				<div className={styles.imageWrapper}>
					<Image
						src={tournament.imageSrc}
						alt={tournament.title}
						width={250}
						height={250}
						className={styles.cardImage}
					/>
				</div>

				<div className={styles.infoWrapper}>
					<h2 className={styles.cardTitle}>{tournament.title}</h2>

					<div className={styles.prizeBlock}>
						<span className={styles.prizeLabel}>Prize pool</span>
						<span className={styles.prizeValue}>{tournament.prizePool}</span>
					</div>

					<div className={styles.timerDesktop}>{renderTimerItems()}</div>

					{/* ЗАМЕНИЛИ ТЕКСТ: Теперь кнопка называется PARTICIPATE */}
					<Link
						href={`/tournaments/${tournament.id}`}
						className={styles.actionButton}
					>
						VIEW DETAILS
					</Link>
				</div>
			</div>

			<div className={styles.timerMobile}>
				<div className={styles.timerGrid}>{renderTimerItems()}</div>
			</div>
		</div>
	);
};

export default function TournamentsPage() {
	return (
		<div className={styles.pageContainer}>
			{/* <HeaderUpGetbonus /> */}
			<Header />

			<div className={styles.wrapper}>
				<SlideBar />

				<main className={styles.mainContent}>
					<h1 className={styles.pageTitle}>TOURNAMENTS</h1>

					<div className={styles.tournamentsList}>
						{tournamentsData.map((tournament) => (
							<TournamentCard key={tournament.id} tournament={tournament} />
						))}
					</div>
				</main>
			</div>

			<Footer />
		</div>
	);
}
