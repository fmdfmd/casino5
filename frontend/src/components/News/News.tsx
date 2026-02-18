'use client'; 

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './New.module.scss';

export interface NewsItem {
    id: number;
    stepTime: string | number; 
    stepTitle: string;
    description: string;
    imageSrc: string; 
    linkHref: string; 
}

interface NewsProps {
    item: NewsItem;
    showReadMore?: boolean; // <-- Добавили необязательный проп
}

const News: React.FC<NewsProps> = ({ item, showReadMore = false }) => {
    return (
        <Link href={item.linkHref} className={styles.newsLink}>
            <div className={styles.news}>
                <div className={styles.newsHeader}>
                    <span className={styles.stepTitle}>{item.stepTitle}</span>
                    <span className={styles.stepTime}>{item.stepTime}</span>
                </div>
                
                <div className={styles.imageWrapper}>
                    <Image 
                        src={item.imageSrc} 
                        alt={item.stepTitle}
                        width={511} 
                        height={143}
                        style={{ width: '100%', height: 'auto' }} 
                        className={styles.image}
                    />
                </div>
                
                <div className={styles.contentBody}>
                    <p className={styles.description}>{item.description}</p>

                    {/* Рендерим только если передали showReadMore={true} */}
                    {showReadMore && (
                        <div className={styles.readMore}>
                            Read More <span>→</span>
                        </div>
                    )}
                </div>
            </div>
        </Link>
    )
}

export default News;