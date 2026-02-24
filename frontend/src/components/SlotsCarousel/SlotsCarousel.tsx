'use client';

import React, { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { Carousel } from '@mantine/carousel';
import '@mantine/carousel/styles.css';
import PlayCard from '../PlayCard/PlayCard';
import styles from './SlotsCarousel.module.scss';
import { slotsData } from '@/data/slots';
import { api } from '@/shared/lib/api/axios';
import { useRouter } from 'next/navigation';
import { Center, Loader } from '@mantine/core';
import { useAppDispatch, useAppSelector } from '@/shared/lib/redux/hooks';
import { fetchLobby } from '@/entities/games/model/slice';

type Game = {
	id: string;
	name: string;
	img: string;
	title: string;
	categories: string;
};

interface EmblaInstance {
	scrollPrev: () => void;
	scrollNext: () => void;
}

export default function SlotsCarousel() {
	const [embla, setEmbla] = useState<EmblaInstance | null>(null);

	const [games, setGames] = useState<Game[]>([]);
	const [loading, setLoading] = useState(true);
	const router = useRouter();
	const { popular, personalized } = useAppSelector((state: any) => state.games);
	const appDispatch = useAppDispatch();

	useEffect(() => {
		api.get('games/list').then((res) => {
			const raw = res.data;
			const flat: Game[] = Object.values(raw).flat();
			setGames(flat);
			setLoading(false);
		});

		appDispatch(fetchLobby());
	}, []);

	if (loading) {
		return (
			<Center h='100vh'>
				<Loader />
			</Center>
		);
	}

	const handleScrollPrev = useCallback(() => {
		if (embla) embla.scrollPrev();
	}, [embla]);
	const handleScrollNext = useCallback(() => {
		if (embla) embla.scrollNext();
	}, [embla]);
	const handleInfoClick = (id: number) => {};

	const newSlots = games.slice(0, 8);

	return (
		<section className={styles.section}>
			<div className={styles.container}>
				<div className={styles.headerWrapper}>
					<h2 className={styles.sectionTitle}>Popular Slots</h2>
					<div className={styles.controlsGroup}>
						<button
							onClick={handleScrollPrev}
							className={styles.navButton}
							aria-label='Prev'
						>
							<Image src='/arrow-left.svg' alt='Prev' width={15} height={15} />
						</button>
						<button
							onClick={handleScrollNext}
							className={styles.navButton}
							aria-label='Next'
						>
							<Image src='/arrow-right.svg' alt='Next' width={15} height={15} />
						</button>
					</div>
				</div>

				<Carousel
					getEmblaApi={(instance) =>
						setEmbla(instance as unknown as EmblaInstance)
					}
					withIndicators={false}
					withControls={false}
					slideGap={{ base: '5px', sm: '10px', lg: '24px' }}
					slideSize={{
						base: '33.333333%',
						sm: '33.333333%',
						lg: '25%',
						xl: '20%',
					}}
					classNames={{
						root: styles.carouselRoot,
						slide: styles.carouselSlide,
					}}
				>
					{/* Рендерим только отобранные 8 слотов */}
					{games.map((slot) => (
						<Carousel.Slide key={slot.id}>
							<PlayCard
								item={{
									id: slot.id,
									title: slot.title,
									imageSrc: slot.img,
									linkHref: `/game/${slot.providerGameId}`,
								}}
								onInfoClick={handleInfoClick}
							/>
						</Carousel.Slide>
					))}
				</Carousel>
			</div>
		</section>
	);
}
