'use client';

import React from 'react';
import HeaderUpGetbonus from '@/components/HeaderUp/HeaderUpGetbonus';
import styles from './page.module.scss';
import Chat from '@/widgets/chat/ui';
import Header from '@/components/Header/Header';
import SlideBar from '@/components/SlideBar/SlideBar';
import Footer from '@/components/Footer/Footer';

// Компоненты
import LoyaltyHero from '@/components/LoyaltyHero/LoyaltyHero';
import StatusCard from '@/components/StatusCard/StatusCard';
import LoyaltyCarousel from '@/components/LoyaltyCarousel/LoyaltyCarousel';

// Данные для Hero секции
const heroData = {
	currentPoints: 73,
	maxPoints: 100,
	userName: 'Viktor Z',
	nextLevelName: 'GOLD',
	imageSrc: '/medal.svg',
};

// Данные для уровней
const levelsData = [
	{
		title: 'Guest',
		iconSrc: '/medal.svg',
		bgSrc: '/card-bg.jpg',
		currentMoney: 0,
		targetMoney: 100,
		maxProgress: 100,
		benefits: [
			{ label: 'Bonus FS', value: 70, isAvailable: true },
			{ label: 'Deposit bonus', value: '225%', isAvailable: true },
			{ label: 'Cashback for a month', isAvailable: false },
			{ label: 'Deposit bonus every week', isAvailable: false },
			{ label: 'Free tournament every day', isAvailable: false },
			{ label: 'Personal manager', isAvailable: false },
		],
	},
	{
		title: 'Classic',
		iconSrc: '/crown-gold.svg',
		bgSrc: '/card-bg.jpg',
		currentMoney: 73,
		targetMoney: 100,
		maxProgress: 100,
		benefits: [
			{ label: 'Birthday gift', value: '$100', isAvailable: true },
			{ label: 'Exchange rate', value: '$4,59', isAvailable: true },
			{ label: 'Cashback for a month', isAvailable: false },
			{ label: 'Deposit bonus every week', isAvailable: false },
			{ label: 'Free tournament every day', isAvailable: false },
			{ label: 'Personal manager', isAvailable: false },
		],
	},
	{
		title: 'Gold',
		iconSrc: '/coin-gold.svg',
		bgSrc: '/card-bg.jpg',
		currentMoney: 1000,
		targetMoney: 1000,
		maxProgress: 1000,
		benefits: [
			{ label: 'Birthday gift', value: '$450', isAvailable: true },
			{ label: 'Exchange rate', value: '$7,59', isAvailable: true },
			{ label: 'Cashback for a month', value: '7%', isAvailable: true },
			{ label: 'Deposit bonus every week', value: '50%', isAvailable: true },
			{ label: 'Free tournament every day', value: '✓', isAvailable: true },
			{ label: 'Personal manager', isAvailable: false },
		],
	},
	{
		title: 'VIP',
		iconSrc: '/crown-royal.svg',
		bgSrc: '/card-bg.jpg',
		currentMoney: 10000,
		targetMoney: 10000,
		maxProgress: 10000,
		benefits: [
			{ label: 'Birthday gift', value: '$450', isAvailable: true },
			{ label: 'Exchange rate', value: '$7,59', isAvailable: true },
			{ label: 'Cashback for a month', value: '7%', isAvailable: true },
			{ label: 'Deposit bonus every week', value: '50%', isAvailable: true },
			{ label: 'Free tournament every day', value: '✓', isAvailable: true },
			{ label: 'Personal manager', value: '✓', isAvailable: true },
		],
	},
];

export default function LoyaltyPage() {
	return (
		<>
			<HeaderUpGetbonus />
			<Header />

			<div className={styles.wrapper}>
				<SlideBar />

				<main className={styles.mainContent}>
					<LoyaltyHero
						currentPoints={heroData.currentPoints}
						maxPoints={heroData.maxPoints}
						userName={heroData.userName}
						nextLevelName={heroData.nextLevelName}
						imageSrc={heroData.imageSrc}
					/>

					{/* Сетка для десктопа (автоматически скроется на мобиле через CSS) */}
					<div className={styles.cardsGrid}>
						{levelsData.map((level, idx) => (
							<StatusCard key={idx} {...level} />
						))}
					</div>

					{/* Карусель для мобилки (автоматически появится на мобиле через CSS) */}
					<div className={styles.mobileCarouselWrapper}>
						<LoyaltyCarousel levels={levelsData} />
					</div>
				</main>
			</div>

			<Chat />
			<Footer />
		</>
	);
}
