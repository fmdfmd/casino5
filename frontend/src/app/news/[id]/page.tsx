'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import styles from './SingleNews.module.scss'; 

// 1. Импорт данных (убедись, что файл создан в папке data)
import { newsData } from '@/data/newsData';

// 2. Импорт компонентов Layout
import HeaderUpGetbonus from '@/components/HeaderUp/HeaderUpGetbonus';
import Header from '@/components/Header/Header';
import SlideBar from '@/components/SlideBar/SlideBar';
import Chat from '@/widgets/chat/ui';
import Footer from '@/components/Footer/Footer';

// 3. Импорт ТВОЕГО слайдера (убедись в пути)
import CarouselNews from '@/components/CarouselNews/CarouselNews';

export default function SingleNewsPage() {
    // Безопасное получение ID
    const params = useParams();
    const id = params?.id ? Number(params.id) : null;

    // Ищем текущую новость
    const currentNews = newsData.find((item) => item.id === id);

    if (!currentNews || !id) {
        return (
            <div style={{ padding: 100, textAlign: 'center', color: 'white' }}>
                <HeaderUpGetbonus />
                <Header />
                <h1>News not found</h1>
            </div>
        );
    }

    return (
        <>
            <HeaderUpGetbonus />
            <Header />

            <div className={styles.wrapper}>
                <SlideBar />

                <main className={styles.mainContent}>
                    <div className={styles.container}>
                        
                        {/* Кнопка "Назад" / Хлебные крошки */}
                        <div className={styles.topHeader}>
                            <Link href="/news" className={styles.backLink}>News</Link>
                        </div>

                        {/* Дата */}
                        <div className={styles.date}>{currentNews.stepTime}</div>

                        {/* Большая картинка */}
                        <div className={styles.heroImageWrapper}>
                            <Image 
                                src={currentNews.imageSrc}
                                alt={currentNews.stepTitle}
                                width={1000}
                                height={400}
                                className={styles.heroImage}
                            />
                        </div>

                        {/* Заголовок */}
                        <h1 className={styles.newsTitle}>{currentNews.stepTitle}</h1>

                        {/* Текст новости */}
                        <div className={styles.textContent}>
                            <p className={styles.paragraph}>
                                {currentNews.fullDescription || currentNews.description}
                            </p>
                            
                            {/* Список с квадратными точками */}
                            {currentNews.features && (
                                <ul className={styles.featureList}>
                                    {currentNews.features.map((feature, index) => (
                                        <li key={index}>{feature}</li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        {/* Вставляем компонент слайдера вместо ручной верстки */}
                        {/* Передаем ID, чтобы скрыть текущую новость из рекомендаций */}
                        <div className={styles.moreNewsSection}>
                             <CarouselNews currentId={id} />
                        </div>

                    </div>
                </main>
            </div>

            <Chat />
            <Footer />
        </>
    );
}