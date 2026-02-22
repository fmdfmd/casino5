'use client';

import styles from './page.module.scss';
import News from '@/components/News/News';
import HeaderUpGetbonus from '@/components/HeaderUp/HeaderUpGetbonus';
import Header from '@/components/Header/Header';
import SlideBar from '@/components/SlideBar/SlideBar';
import Chat from '@/widgets/chat/ui';
import Footer from '@/components/Footer/Footer';
import { newsData } from '@/data/newsData';

export default function NewsPage() {
	return (
		<>
			{/* <HeaderUpGetbonus /> */}
			<Header />

			<div className={styles.wrapper}>
				<SlideBar />

				<main className={styles.mainContent}>
					<div className={styles.container}>
						<h1 className={styles.title}>News</h1>

						<div className={styles.grid}>
							{newsData.map((item) => (
								<News key={item.id} item={item} showReadMore={true} />
							))}
						</div>
					</div>
				</main>
			</div>

			<Chat />
			<Footer />
		</>
	);
}
