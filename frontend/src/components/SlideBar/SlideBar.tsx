'use client'; 

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation'; 
import styles from './SlideBar.module.scss'; 


// Группа 1: Основная навигация
const mainItems = [
    { name: 'Home', icon: '/home.svg', link: '/' },
    { name: 'Bonuses', icon: '/gift.svg', link: '/bonuses' },
    { name: 'Partners', icon: '/handshake.svg', link: '/partners' },
    { name: 'Slots', icon: '/slots.svg', link: '/slots' },
    { name: 'Live casino', icon: '/cards.svg', link: '/live-casino' },
    { name: 'Tournaments', icon: '/trophy.svg', link: '/tournaments' },
    { name: 'Loyalty', icon: '/loyalty.svg', link: '/loyalty' },
];

// Группа 2: Поддержка и настройки
const supportItems = [
    { name: 'Questions & Answers', icon: '/chat.svg', link: '/faq' },
    { name: 'News', icon: '/news.svg', link: '/news' },
    { name: 'Settings', icon: '/settings.svg', link: '/settings' },
    { name: 'Support', icon: '/headset.svg', link: '/support' },
];

const SlideBar = () => {
    const pathname = usePathname();

    return (
        <aside className={styles.sidebar}>
            {/* Первая карточка: Основное меню */}
            <div className={styles.card}>
                <nav className={styles.nav}>
                    {mainItems.map((item) => {
                        const isActive = pathname === item.link;
                        return (
                            <Link 
                                key={item.name} 
                                href={item.link} 
                                className={`${styles.item} ${isActive ? styles.active : ''}`}
                            >
                                <div className={styles.iconWrapper}>
                                    <Image 
                                        src={item.icon} 
                                        alt={item.name} 
                                        width={24} 
                                        height={24} 
                                    />
                                </div>
                                <span className={styles.text}>{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>

            {/* Вторая карточка: Поддержка */}
            <div className={styles.card}>
                <nav className={styles.nav}>
                    {supportItems.map((item) => {
                        const isActive = pathname === item.link;
                        return (
                            <Link 
                                key={item.name} 
                                href={item.link} 
                                className={`${styles.item} ${isActive ? styles.active : ''}`}
                            >
                                <div className={styles.iconWrapper}>
                                    <Image 
                                        src={item.icon} 
                                        alt={item.name} 
                                        width={24} 
                                        height={24} 
                                    />
                                </div>
                                <span className={styles.text}>{item.name}</span>
                            </Link>
                        )
                    })}
                </nav>
            </div>
        </aside>
    );
};

export default SlideBar;