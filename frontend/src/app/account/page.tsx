'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { LuPencilLine, LuPlus } from 'react-icons/lu';

import HeaderUpGetbonus from '@/components/HeaderUp/HeaderUpGetbonus';
import Header from '@/components/Header/Header';
import SlideBar from '@/components/SlideBar/SlideBar';
import Footer from '@/components/Footer/Footer';
import WalletNavigation from '@/components/WalletNavigation/WalletNavigation';
import ExitModal from '@/components/ExitModal/ExitModal';
// 1. Импортируем модалку выбора аватара
import AvatarSelectModal from '@/components/AvatarSelectModal/AvatarSelectModal';

import styles from './page.module.scss';

const TIERS = [
	{ name: 'Guest', label: '', value: '$0 / $0', icon: '/medal.svg' },
	{
		name: 'Classic',
		label: 'To next level',
		value: '$73 / $100',
		icon: '/crown-gold.svg',
	},
	{
		name: 'Gold',
		label: 'Place bets on',
		value: '$1000',
		icon: '/coin-gold.svg',
	},
	{
		name: 'VIP',
		label: 'Place bets on',
		value: '$10 000',
		icon: '/crown-royal.svg',
	},
];

export default function ProfileDashboardPage() {
	const [userProgress] = useState(22);
	const [isEditing, setIsEditing] = useState(false);
	const [userName, setUserName] = useState('Viktor Z');
	const [copied, setCopied] = useState(false);

	// Состояния для модалок
	const [isExitModalOpen, setIsExitModalOpen] = useState(false);
	// 2. Состояние для модалки аватара и самого изображения аватара
	const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
	const [currentAvatar, setCurrentAvatar] = useState('/lc.svg'); // Начальный аватар

	const referralLink = 'https://casino.com/ref/viktor_z77';
	const totalTicks = 100;
	const peakIndices = [12, 37, 62, 87];

	const handleCopyLink = () => {
		navigator.clipboard.writeText(referralLink);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	const handleFinalExit = () => {
		console.log('User logged out');
		window.location.href = '/';
	};

	// 3. Функция сохранения аватара из модалки
	const handleSaveAvatar = (newAvatarUrl: string) => {
		setCurrentAvatar(newAvatarUrl);
		// Тут можно добавить API запрос для сохранения в БД
	};

	return (
		<div className={styles.pageLayout}>
			{/* <HeaderUpGetbonus /> */}
			<Header />

			<div className={styles.wrapper}>
				<SlideBar />

				<main className={styles.mainContent}>
					<div className={styles.container}>
						<div className={styles.navWrapper}>
							<WalletNavigation />
						</div>

						<section className={styles.profileHero}>
							<div className={styles.heroLeft}>
								<div className={styles.avatarBox}>
									<div className={styles.avatarCircle}>
										<Image
											src={currentAvatar} // Используем состояние аватара
											alt='User'
											width={80}
											height={80}
											className={styles.avatarImg}
										/>
										{/* 4. Меняем label на button для вызова модалки */}
										<button
											className={styles.addBtn}
											onClick={() => setIsAvatarModalOpen(true)}
										>
											<LuPlus size={16} strokeWidth={3} />
										</button>
									</div>
								</div>

								<div className={styles.userDetails}>
									<div className={styles.nameRow}>
										{isEditing ? (
											<input
												className={styles.nameInput}
												value={userName}
												onChange={(e) => setUserName(e.target.value)}
												onBlur={() => setIsEditing(false)}
												autoFocus
											/>
										) : (
											<h1>{userName}</h1>
										)}
										<button
											className={styles.editBtn}
											onClick={() => setIsEditing(!isEditing)}
										>
											<LuPencilLine size={18} />
										</button>
									</div>
									<p className={styles.userStatus}>
										Online • Member since 2023
									</p>
								</div>
							</div>

							<div className={styles.heroActions}>
								<button
									className={styles.logoutBtn}
									title='Sign Out'
									onClick={() => setIsExitModalOpen(true)}
								>
									<Image
										src='/logout-icon.svg'
										alt='Logout'
										width={18}
										height={18}
									/>
									<span>Logout</span>
								</button>
							</div>
						</section>

						<section className={styles.loyaltyBox}>
							<div className={styles.tiersContainer}>
								{TIERS.map((tier) => (
									<div
										key={tier.name}
										className={`${styles.tierCard} ${
											tier.name === 'Classic' ? styles.activeTier : ''
										}`}
									>
										<div className={styles.rankIcon}>
											<Image
												src={tier.icon}
												alt={tier.name}
												width={110}
												height={110}
											/>
										</div>
										<h3 className={styles.rankName}>{tier.name}</h3>
										{tier.label && (
											<span className={styles.rankLabel}>{tier.label}</span>
										)}
										<div className={styles.rankValue}>
											{tier.name === 'Classic' ? (
												<>
													<span className={styles.blue}>$73</span> / $100
												</>
											) : tier.name === 'Guest' ? (
												<>
													<span className={styles.blue}>$0</span> / $0
												</>
											) : (
												tier.value
											)}
										</div>
									</div>
								))}
							</div>

							<div className={styles.progressWrapper}>
								<div className={styles.ticksLine}>
									{Array.from({ length: totalTicks }).map((_, i) => {
										const isPeak = peakIndices.includes(i);
										const isNearPeak = peakIndices.some(
											(p) => Math.abs(p - i) === 1,
										);
										let heightClass = styles.h_sm;
										if (isPeak) heightClass = styles.h_lg;
										else if (isNearPeak) heightClass = styles.h_md;
										const isActive =
											i <= Math.floor((userProgress / 100) * totalTicks);
										return (
											<span
												key={i}
												className={`${styles.tick} ${heightClass}`}
												style={{
													backgroundColor: isActive ? '#785EDB' : '#C7F5FC',
													opacity: isActive ? 1 : 0.15,
												}}
											/>
										);
									})}
								</div>
								<div
									className={styles.currentLevelMarker}
									style={{ left: `${userProgress}%` }}
								>
									Current level
								</div>
							</div>
						</section>

						<div className={styles.statsGrid}>
							{/* Referral Program Block */}
							<div className={styles.infoBlock}>
								<h2 className={styles.blockTitle}>Referral Program</h2>
								<div className={styles.blockCard}>
									<div className={styles.refContent}>
										<div className={styles.refText}>
											<h3>Earn up to 15% from friends</h3>
											<p>
												Get commissions from every wager made by your referrals.
											</p>
										</div>

										<div className={styles.linkContainer}>
											<input
												readOnly
												value={referralLink}
												className={styles.refInput}
											/>
											<button
												className={styles.copyBtn}
												onClick={handleCopyLink}
											>
												<Image
													src='/check-icon.svg'
													alt='Copied'
													width={18}
													height={18}
												/>
												<span>{copied ? 'Copied' : 'Copy'}</span>
											</button>
										</div>

										<div className={styles.refStatsMini}>
											<div className={styles.miniItem}>
												<span>Total Referred</span>
												<strong>12</strong>
											</div>
											<div className={styles.miniItem}>
												<span>Total Earned</span>
												<strong className={styles.blue}>$140.50</strong>
											</div>
										</div>
									</div>
								</div>
							</div>

							{/* Gaming Activity Block */}
							<div className={styles.infoBlock}>
								<h2 className={styles.blockTitle}>Gaming Activity</h2>
								<div className={styles.statsCard}>
									<div className={styles.statsMainGrid}>
										<div className={styles.statItem}>
											<span className={styles.statLabel}>Total Win</span>
											<span className={styles.statValue}>$ 1,099.30</span>
										</div>
										<div className={styles.statItem}>
											<span className={styles.statLabel}>Total Wagered</span>
											<span className={styles.statValue}>$ 5,240.00</span>
										</div>
										<div className={styles.statItem}>
											<span className={styles.statLabel}>Favorite Game</span>
											<span className={styles.statValue}>Sweet Bonanza</span>
										</div>
										<div className={styles.statItem}>
											<span className={styles.statLabel}>
												Biggest Multiplier
											</span>
											<span className={`${styles.statValue} ${styles.green}`}>
												x450
											</span>
										</div>
									</div>
									<button className={styles.historyBtn}>
										View Full History
									</button>
								</div>
							</div>
						</div>
					</div>
				</main>
			</div>

			{/* 5. Подключаем обе модалки */}
			<ExitModal
				isOpen={isExitModalOpen}
				onClose={() => setIsExitModalOpen(false)}
				onConfirm={handleFinalExit}
			/>

			<AvatarSelectModal
				isOpen={isAvatarModalOpen}
				onClose={() => setIsAvatarModalOpen(false)}
				onSave={handleSaveAvatar}
			/>

			<Footer />
		</div>
	);
}
