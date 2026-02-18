'use client';
import HeaderUpGetbonus from '@/components/HeaderUp/HeaderUpGetbonus';
import styles from './page.module.scss';
import Chat from '@/widgets/chat/ui';
import Header from '@/components/Header/Header';
import SlideBar from '@/components/SlideBar/SlideBar';
import Footer from '@/components/Footer/Footer';
import ImageCarousel from '@/components/ImageCarousel/ImageCarousel';
import GameNavigation from '@/components/GameNavigation/GameNavigation';
import Stages from '@/components/Stages/Stages';
import NewsPage from '@/components/CarouselNews/CarouselNews';
import SlotsCarousel from '@/components/SlotsCarousel/SlotsCarousel';
import RecentWinnings from '@/components/RecentWinnings/RecentWinnings';
import { useAppDispatch } from '@/shared/lib/redux/hooks';
import { useEffect } from 'react';
import { fetchMe } from '@/features/auth/model/authSlice';
import axios from 'axios';

export default function Home() {
	const dispatch = useAppDispatch();

	useEffect(() => {
		dispatch(fetchMe());
	}, []);

	return (
		<>
			{/* <HeaderUpGetbonus /> */}
			<Header />
			<Chat />
			<div className={styles.wrapper}>
				<SlideBar />

				<main className={styles.mainContent}>
					<ImageCarousel />
					<GameNavigation />
					<SlotsCarousel />
					<Stages />
					<NewsPage />
					<RecentWinnings />
				</main>
			</div>

			<Footer />
		</>
	);
}
