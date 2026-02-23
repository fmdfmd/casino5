'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

import styles from './SlotPage.module.scss';

// Импорт основных блоков
import HeaderUpGetbonus from '@/components/HeaderUp/HeaderUpGetbonus';
import Header from '@/components/Header/Header';
import SlideBar from '@/components/SlideBar/SlideBar';
import Footer from '@/components/Footer/Footer';
import Chat from '@/widgets/chat/ui';

// Импорт контента
import SlotsCarousel from '@/components/SlotsCarousel/SlotsCarousel';
import RecentWinnings from '@/components/RecentWinnings/RecentWinnings';
import { Center, Loader } from '@mantine/core';
import { api } from '@/shared/lib/api/axios';

export default function SlotPage() {
	const { id } = useParams();

	const [gameUrl, setGameUrl] = useState<string | null>(null);

	useEffect(() => {
		if (!id) return;

		api
			.post(
				'/games/open',
				{
					id,
					demo: false,
				},
				{ withCredentials: true },
			)
			.then((res) => {
				setGameUrl(res.data.content.game.url);
			});
	}, [id]);

	if (!gameUrl) {
		return (
			<Center h='100vh'>
				<Loader />
			</Center>
		);
	}

	return (
		<>
			{/* <HeaderUpGetbonus /> */}
			<Header />

			<div className={styles.wrapper}>
				<SlideBar />

				<main className={styles.mainContent}>
					<iframe
						src={gameUrl}
						style={{
							height: '100vh',
							width: '100%',
							border: 'none',
							maxWidth: '1626px',
							maxHeight: '738px',
							paddingInline: '20px',
							borderRadius: '10px',
						}}
						allow='fullscreen'
					/>
					<SlotsCarousel />
					<RecentWinnings />
				</main>
			</div>

			<Chat />
			<Footer />
		</>
	);
}
