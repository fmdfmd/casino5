'use client';

import HeaderUpGetbonus from '@/components/HeaderUp/HeaderUpGetbonus';
import styles from './page.module.scss';
import Chat from '@/widgets/chat/ui';
import Header from '@/components/Header/Header';
import SlideBar from '@/components/SlideBar/SlideBar';
import Footer from '@/components/Footer/Footer';
import ImageCarousel from '@/components/ImageCarousel/ImageCarousel';
import GameNavigation from '@/components/GameNavigation/GameNavigation';
import CategoryGrid from '@/components/CategoryGrid/CategoryGrid';
import { slotsData, SlotGame } from '@/data/slots';

export default function SlotsPage() {
	return (
		<>
			{/* <HeaderUpGetbonus /> */}
			<Header />

			<div className={styles.wrapper}>
				<SlideBar />

				<main className={styles.mainContent}>
					<ImageCarousel />
					<GameNavigation />

					<CategoryGrid
						title='Popular Slots'
						games={slotsData.filter((s: SlotGame) => !!s.isPopular)}
					/>
					<CategoryGrid
						title='New Releases'
						games={slotsData.filter((s: SlotGame) => !!s.isNew)}
					/>
					<CategoryGrid
						title='Bonus Buy'
						games={slotsData.filter(
							(s: SlotGame) => s.category === 'buy-bonus',
						)}
					/>
					<CategoryGrid
						title='Megaways'
						games={slotsData.filter((s: SlotGame) => s.category === 'megaways')}
					/>
				</main>
			</div>

			<Chat />
			<Footer />
		</>
	);
}
