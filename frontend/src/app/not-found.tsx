'use client';


import Link from 'next/link';
import Image from 'next/image';
import styles from './NotFound.module.scss'; 
import HeaderUpGetbonus from '@/components/HeaderUp/HeaderUpGetbonus';
import Header from '@/components/Header/Header';
import SlideBar from '@/components/SlideBar/SlideBar';
import Footer from '@/components/Footer/Footer';
import Chat from '@/widgets/chat/ui';

export default function NotFound() {
  return (
    <>
      <HeaderUpGetbonus />
      <Header />

      <div className={styles.wrapper}>
        <SlideBar />

        <main className={styles.mainContent}>
          <div className={styles.errorContainer}>
            
            {/* Изображение 404 (Вам нужно добавить картинку в папку public) */}
            <div className={styles.imageWrapper}>
               {/* Если у вас пока нет картинки, этот блок создаст текстовую заглушку, 
                   но лучше заменить src на реальный путь к картинке с космонавтом */}
               <Image 
                 src="/404-astro.svg" 
                 alt="404 Astronaut" 
                 width={1000} 
                 height={500}
                 className={styles.heroImage}
                 priority
               />
            </div>

            <h1 className={styles.title}>Oops! This galaxy doesn’t exist</h1>
            
            <p className={styles.description}>
              The page you’re trying to reach doesn’t exist. But don’t worry — let’s get you back to where the action is.
            </p>

            <Link href="/" className={styles.homeButton}>
              Go Home
            </Link>
          </div>
        </main>
      </div>

      <Chat />
      <Footer />
    </>
  );
}