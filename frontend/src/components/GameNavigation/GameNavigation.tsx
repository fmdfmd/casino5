'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import styles from './GameNavigation.module.scss';
import CategoryDropdown from '../CategoryDropdown/CategoryDropdown';

const SEARCH_ICON_SRC = '/search.svg';

interface CategoryItem {
	id: string;
	label: string;
	src: string;
	alt: string;
}

const gameTypes: CategoryItem[] = [
	{ id: 'all', label: 'All categories', src: '/all.svg', alt: 'all' },
	{ id: 'slots', label: 'Slots', src: '/slotss.svg', alt: 'slots' },
	{ id: 'live', label: 'Live casino', src: '/live.svg', alt: 'live' },
	{ id: 'tables', label: 'Tables', src: '/tables.svg', alt: 'tables' },
	{ id: 'jackpots', label: 'Jackpots', src: '/jackpots.svg', alt: 'jackpots' },
	{
		id: 'crypto',
		label: 'Crypto-games',
		src: '/cryptogame.svg',
		alt: 'crypto',
	},
	{
		id: 'exclusive',
		label: 'Exclusive',
		src: '/exclusive.svg',
		alt: 'exclusive',
	},
	{ id: 'branded', label: 'Branded', src: '/branded.svg', alt: 'branded' },
	{ id: 'lobby', label: 'Lobby', src: '/exclusive.svg', alt: 'lobby' },
];

const popularGames: CategoryItem[] = [
	{ id: 'new', label: 'New', src: '/new.svg', alt: 'new' },
	{
		id: 'pre-release',
		label: 'Pre-release',
		src: '/pre-release.svg',
		alt: 'pre',
	},
	{ id: 'popular', label: 'Popular', src: '/popular.svg', alt: 'pop' },
	{ id: 'month', label: 'Games of the month', src: '/month.svg', alt: 'month' },
	{
		id: 'jackpots-pop',
		label: 'Jackpots',
		src: '/jackpots.svg',
		alt: 'jackpots',
	},
	{ id: 'bonus', label: 'Bonus wagering', src: '/bonus.svg', alt: 'bonus' },
	{
		id: 'providers',
		label: 'Top providers',
		src: '/providers.svg',
		alt: 'providers',
	},
	{ id: 'low-bets', label: 'Low bets', src: '/low-bets.svg', alt: 'low' },
];

export const GameNavigation: React.FC = () => {
	const [activeCategory, setActiveCategory] = useState<string>('all');
	const [activePopular, setActivePopular] = useState<string>('new');

	return (
		<div className={styles.container}>
			{/* Sections: Hidden on Mobile (<600px) via CSS */}
			<div className={styles.section}>
				<div className={styles.title}>Game Type</div>
				<div className={styles.list}>
					{gameTypes.map((item) => (
						<button
							key={item.id}
							className={`${styles.chip} ${
								item.id === activeCategory ? styles.active : ''
							}`}
							onClick={() => setActiveCategory(item.id)}
						>
							<div className={styles.icon}>
								<Image src={item.src} alt={item.alt} width={28} height={28} />
							</div>
							<span>{item.label}</span>
						</button>
					))}
				</div>
			</div>

			<div className={styles.section}>
				<div className={styles.title}>Popular Games</div>
				<div className={styles.list}>
					{popularGames.map((item) => (
						<button
							key={item.id}
							className={`${styles.chip} ${item.id === activePopular ? styles.active : ''}`}
							onClick={() => setActivePopular(item.id)}
						>
							<div className={styles.icon}>
								<Image src={item.src} alt={item.alt} width={28} height={28} />
							</div>
							<span>{item.label}</span>
						</button>
					))}
				</div>
			</div>

			{/* Search: Always visible */}
			<div className={styles.searchContainer}>
				<div className={styles.searchWrapper}>
					<div className={styles.searchIcon}>
						<Image src={SEARCH_ICON_SRC} alt='Search' width={24} height={24} />
					</div>
					<input
						type='text'
						placeholder='Search'
						className={styles.searchInput}
					/>
				</div>
			</div>

			<div className={styles.mobileCategoryWrapper}>
				<CategoryDropdown />
			</div>
		</div>
	);
};

export default GameNavigation;
