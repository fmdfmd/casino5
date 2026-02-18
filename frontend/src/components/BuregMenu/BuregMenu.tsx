import React, { FC, SyntheticEvent } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './BuregMenu.module.scss';

interface MenuItem {
	name: string;
	href: string;
	icon: string;
}

interface BuregMenuProps {
	isOpen: boolean;
	onClose: () => void;
}

const MENU_ITEMS: MenuItem[] = [
	{ name: 'Home', href: '/', icon: '/home.svg' },
	{ name: 'Bonuses', icon: '/gift.svg', href: '/bonuses' },
	{ name: 'Partners', href: '/partners', icon: '/handshake.svg' },
	{ name: 'Slots', href: '/slots', icon: '/slots.svg' },
	{ name: 'Live casino', href: '/live-casino', icon: '/cards.svg' },
	{ name: 'Tournaments', href: '/tournaments', icon: '/trophy.svg' },
	{ name: 'Loyalty', href: '/loyalty', icon: '/loyalty.svg' },
	{ name: 'Questions & Answers', href: '/faq', icon: '/chat.svg' },
	{ name: 'News', href: '/news', icon: '/news.svg' },
	{ name: 'Settings', href: '/settings', icon: '/settings.svg' },
	{ name: 'Support', href: '/support', icon: '/headset.svg' },
];

const BuregMenu: FC<BuregMenuProps> = ({ isOpen, onClose }) => {
	if (!isOpen) return null;

	const handleImageError = (e: SyntheticEvent<HTMLImageElement, Event>) => {
		e.currentTarget.style.display = 'none';
	};

	return (
		<>
			<div className={styles.overlay} onClick={onClose} />
			<div className={styles.menuContainer}>
				<div className={styles.menuHeader}>
					<div className={styles.titleWrapper}>
						<button className={styles.closeButton} onClick={onClose}>
							{/* Размеры здесь только для аспекта, реальный размер задается в CSS */}
							<Image
								src='/close.svg'
								alt='Close'
								width={32}
								height={32}
								onError={handleImageError}
							/>
						</button>
						<span className={styles.menuTitle}>Menu</span>
					</div>
				</div>

				<nav className={styles.navList}>
					{MENU_ITEMS.map((item, index) => (
						<Link
							key={index}
							href={item.href}
							className={styles.navItem}
							onClick={onClose}
						>
							<Image
								src={item.icon}
								alt={item.name}
								width={24}
								height={24}
								onError={handleImageError}
							/>
							<span>{item.name}</span>
						</Link>
					))}
				</nav>
			</div>
		</>
	);
};

export default BuregMenu;
