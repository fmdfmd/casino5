"use client";

import HeaderUpGetbonus from '@/components/HeaderUp/HeaderUpGetbonus';
import styles from './page.module.scss';
import Chat from '@/widgets/chat/ui';
import Header from '@/components/Header/Header';
import SlideBar from '@/components/SlideBar/SlideBar';
import Footer from '@/components/Footer/Footer';
import ImageCarousel from '@/components/ImageCarousel/ImageCarousel';
import GameNavigation from '@/components/GameNavigation/GameNavigation';
import CategoryGrid from '@/components/CategoryGrid/CategoryGrid';
import { liveGamesData, LiveGame } from '@/data/live-games'; 

export default function LiveCasinoPage() {
    return (
        <>
            <HeaderUpGetbonus />
            <Header /> 

            <div className={styles.wrapper}>
                <SlideBar /> 

                <main className={styles.mainContent}>
                    <ImageCarousel />
                    <GameNavigation />

                    <CategoryGrid 
                        title="Live Shows" 
                        games={liveGamesData.filter((g: LiveGame) => g.type === 'show')} 
                    />
                    <CategoryGrid 
                        title="Roulette" 
                        games={liveGamesData.filter((g: LiveGame) => g.type === 'roulette')} 
                    />
                    <CategoryGrid 
                        title="Blackjack" 
                        games={liveGamesData.filter((g: LiveGame) => g.type === 'blackjack')} 
                    />
                    <CategoryGrid 
                        title="Poker" 
                        games={liveGamesData.filter((g: LiveGame) => g.type === 'poker')} 
                    />
                </main>
            </div>

            <Chat />
            <Footer />
        </>
    );
}