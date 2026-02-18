'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './PlayCard.module.scss';
import { useRouter } from 'next/navigation';

export interface PlayCardItem {
	id: number;
	imageSrc: string;
	linkHref: string;
	title?: string;
}

interface PlayCardProps {
	item: PlayCardItem;
	onInfoClick: (id: number) => void;
}

const PlayCard: React.FC<PlayCardProps> = ({ item, onInfoClick }) => {
	const [isLiked, setIsLiked] = useState(false);
	const router = useRouter();

	const handleInfoClick = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		onInfoClick(item.id);
	};

	const handleLikeClick = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setIsLiked(!isLiked);
	};

	return (
		<div className={styles.card}>
			{/* Оборачиваем в Link для перехода на страницу слота */}
			<Link href={item.linkHref} className={styles.linkWrapper}>
				<div className={styles.imageContainer}>
					<Image
						src={item.imageSrc}
						alt={item.title || 'Slot Game'}
						fill
						sizes='(max-width: 768px) 33vw, (max-width: 1200px) 25vw, 20vw'
						className={styles.image}
					/>

					<div className={styles.overlay}>
						<div className={styles.heartIcon} onClick={handleLikeClick}>
							<div
								style={{ position: 'relative', width: '100%', height: '100%' }}
							>
								<Image
									src={isLiked ? '/heart-filled.svg' : '/heart.svg'}
									alt='Like'
									fill
								/>
							</div>
						</div>

						<div className={styles.playButton}>
							<Image
								src='/play-triangle.svg'
								alt='Play'
								width={16}
								height={16}
							/>
							<span className={styles.playText}>Play</span>
						</div>
					</div>
				</div>
			</Link>

			<button
				className={styles.infoButton}
				onClick={handleInfoClick}
				type='button'
			>
				<div style={{ position: 'relative', width: '60%', height: '60%' }}>
					<Image
						src='/question.svg'
						alt='Info'
						fill
						className={styles.iconImage}
					/>
				</div>
			</button>
		</div>
	);
};

export default PlayCard;
