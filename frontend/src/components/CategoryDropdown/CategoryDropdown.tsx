'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import styles from './CategoryDropdown.module.scss';

const gameTypes = [
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
];

const popularGames = [
	{ id: 'new', label: 'New', src: '/new.svg', alt: 'new' },
	{ id: 'popular', label: 'Popular', src: '/popular.svg', alt: 'pop' },
	{ id: 'bonus', label: 'Bonus wagering', src: '/bonus.svg', alt: 'bonus' },
];

const CategoryDropdown = () => {
	const [isOpen, setIsOpen] = useState(false);
	// Храним текущий выбранный ID
	const [selectedId, setSelectedId] = useState('all');

	const toggleDropdown = () => {
		setIsOpen(!isOpen);
	};

	const handleSelect = (id) => {
		setSelectedId(id);
		setIsOpen(false); // Закрываем дропдаун после выбора
	};

	// Находим активный объект (ищем в обоих массивах), чтобы показать его лейбл в кнопке
	const allItems = [...gameTypes, ...popularGames];
	const activeItem =
		allItems.find((item) => item.id === selectedId) || gameTypes[0];

	return (
		<div className={styles.wrapper}>
			{/* Кнопка открытия */}
			<button
				className={`${styles.dropdownButton} ${isOpen ? styles.open : ''}`}
				onClick={toggleDropdown}
			>
				<div className={styles.buttonLabel}>
					<span className={styles.labelText}>{activeItem.label}</span>
				</div>

				<div className={styles.arrowIcon}>
					{/* Используем простую SVG стрелочку или твою картинку */}
					<svg
						width='14'
						height='8'
						viewBox='0 0 14 8'
						fill='none'
						xmlns='http://www.w3.org/2000/svg'
					>
						<path
							d='M1 1L7 7L13 1'
							stroke='white'
							strokeWidth='2'
							strokeLinecap='round'
							strokeLinejoin='round'
						/>
					</svg>
				</div>
			</button>

			{/* Выпадающий список */}
			{isOpen && (
				<div className={styles.dropdownMenu}>
					<div className={styles.scrollContainer}>
						{/* Группа 1 */}
						<div className={styles.groupLabel}>Game Type</div>
						{gameTypes.map((item) => (
							<div
								key={item.id}
								className={`${styles.menuItem} ${item.id === selectedId ? styles.active : ''}`}
								onClick={() => handleSelect(item.id)}
							>
								<span className={styles.itemText}>{item.label}</span>
								<div className={styles.itemIcon}>
									<Image src={item.src} alt={item.alt} width={20} height={20} />
								</div>
							</div>
						))}

						{/* Разделитель */}
						<div className={styles.divider}></div>

						{/* Группа 2 */}
						<div className={styles.groupLabel}>Popular</div>
						{popularGames.map((item) => (
							<div
								key={item.id}
								className={`${styles.menuItem} ${item.id === selectedId ? styles.active : ''}`}
								onClick={() => handleSelect(item.id)}
							>
								<span className={styles.itemText}>{item.label}</span>
								<div className={styles.itemIcon}>
									<Image src={item.src} alt={item.alt} width={20} height={20} />
								</div>
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
};

export default CategoryDropdown;
