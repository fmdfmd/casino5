'use client';

import React, { useState, use } from 'react'; // Добавили use
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import styles from './page.module.scss';
import { tournamentsData } from '@/data/tournamentsData';

import HeaderUpGetbonus from '@/components/HeaderUp/HeaderUpGetbonus';
import Header from '@/components/Header/Header';
import SlideBar from '@/components/SlideBar/SlideBar';
import Chat from '@/widgets/chat/ui';
import Footer from '@/components/Footer/Footer';

// Иконка для аккордеона
const ToggleIcon = ({ isOpen }: { isOpen: boolean }) => (
	<div className={styles.iconWrapper}>
		<Image
			src='/arrow-down.svg'
			alt='toggle'
			width={14}
			height={8}
			className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`}
		/>
	</div>
);

// В Next.js 15 params приходят как Promise в пропсах компонента
export default function TournamentIdPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	// 1. Разворачиваем параметры (нужно для Next.js 15)
	const resolvedParams = use(params);
	const id = resolvedParams?.id ? Number(resolvedParams.id) : null;

	// Состояния аккордеонов
	const [isTermsOpen, setIsTermsOpen] = useState(false);
	const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);

	// 2. Ищем данные турнира
	const currentTournament = tournamentsData.find((item) => item.id === id);

	// Если турнир не найден (выводим отладочную информацию)
	if (!currentTournament) {
		return (
			<div
				className={styles.notFoundWrapper}
				style={{ color: 'white', textAlign: 'center', paddingTop: '100px' }}
			>
				<h1>Tournament not found</h1>
				<p>ID in URL: {resolvedParams?.id}</p>
				<Link
					href='/tournaments'
					style={{ color: '#00ff00', textDecoration: 'underline' }}
				>
					Back to tournaments list
				</Link>
			</div>
		);
	}

	const renderPlace = (place: number) => {
		if (place === 1) return <span className={styles.medal}>🥇</span>;
		if (place === 2) return <span className={styles.medal}>🥈</span>;
		if (place === 3) return <span className={styles.medal}>🥉</span>;
		return <span className={styles.placeNumber}>{place}</span>;
	};

	return (
		<>
			{/* <HeaderUpGetbonus /> */}
			<Header />

			<div className={styles.wrapper}>
				<SlideBar />

				<main className={styles.mainContent}>
					<div className={styles.topNav}>
						<Link href='/tournaments' className={styles.backLink}>
							TOURNAMENTS
						</Link>
					</div>

					<div className={styles.detailCard}>
						<div className={styles.heroImageWrapper}>
							<Image
								src={currentTournament.imageSrc}
								alt={currentTournament.title}
								width={300}
								height={300}
								className={styles.heroImage}
								priority
							/>
						</div>
					</div>

					<div className={styles.titleSection}>
						<h1 className={styles.tournamentTitle}>
							{currentTournament.title}
						</h1>
						<div className={styles.prizeLabel}>Prize pool</div>
						<div className={styles.prizeValue}>
							{currentTournament.prizePool}
						</div>
					</div>

					<div className={styles.rulesCard}>
						<div className={styles.rulesBlock}>
							<div className={styles.ruleRow}>
								<strong>Dates:</strong>
								<p>{currentTournament.dates}</p>
							</div>
							<div className={styles.ruleRow}>
								<strong>How to place a bet:</strong>
								<p>Minimum Bet: {currentTournament.minBet}</p>
							</div>
							<div className={styles.ruleRow}>
								<strong>How to get points:</strong>
								<p>{currentTournament.scoringRules}</p>
							</div>
							<p className={styles.smallNote}>
								Time to award players 72 hours after the tournament termination.
							</p>
						</div>
						<button className={styles.loginButton}>Log in/Sign up</button>
					</div>

					{/* === TERMS & CONDITIONS === */}
					<div
						className={`${styles.accordionCard} ${!isTermsOpen ? styles.closed : ''}`}
					>
						<div
							className={`${styles.cardHeader} ${isTermsOpen ? styles.headerOpen : ''}`}
							onClick={() => setIsTermsOpen(!isTermsOpen)}
						>
							<span>TERMS & CONDITIONS</span>
							<ToggleIcon isOpen={isTermsOpen} />
						</div>
						<div
							className={`${styles.collapsibleContent} ${isTermsOpen ? styles.contentOpen : ''}`}
						>
							<div className={styles.innerContent}>
								{currentTournament.terms.map((term, index) => (
									<p key={index}>
										{index + 1}. {term}
									</p>
								))}
							</div>
						</div>
					</div>

					{/* === LEADERBOARDS === */}
					<div
						className={`${styles.accordionCard} ${!isLeaderboardOpen ? styles.closed : ''}`}
					>
						<div
							className={`${styles.cardHeader} ${isLeaderboardOpen ? styles.headerOpen : ''}`}
							onClick={() => setIsLeaderboardOpen(!isLeaderboardOpen)}
						>
							<span>LEADERBOARDS</span>
							<ToggleIcon isOpen={isLeaderboardOpen} />
						</div>
						<div
							className={`${styles.collapsibleContent} ${isLeaderboardOpen ? styles.contentOpen : ''}`}
						>
							<div className={styles.leaderboardWrapper}>
								<div className={styles.tableHeader}>
									<span>Place</span>
									<span>Name</span>
									<span>Prize</span>
								</div>
								<div className={styles.leaderboardList}>
									{currentTournament.leaderboard.length > 0 ? (
										currentTournament.leaderboard.map((user) => (
											<div
												key={user.place}
												className={`${styles.row} ${user.isTop ? styles.topRow : ''}`}
											>
												<div className={styles.placeCell}>
													{renderPlace(user.place)}
												</div>
												<div className={styles.nameCell}>{user.name}</div>
												<div className={styles.prizeCell}>{user.prize}</div>
											</div>
										))
									) : (
										<div className={styles.emptyState}>No participants yet</div>
									)}
								</div>
							</div>
						</div>
					</div>
				</main>
			</div>

			<Chat />
			<Footer />
		</>
	);
}
