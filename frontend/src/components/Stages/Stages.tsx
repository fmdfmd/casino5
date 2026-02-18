'use client'; 

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Stages.module.scss';

interface StageItem {
    id: number;
    stepNumber: string;
    stepTitle: string;
    description: string;
    imageSrc: string; 
    linkHref: string;
    buttondescription: string;
}

const stagesData: StageItem[] = [
    {
        id: 1,
        stepNumber: '01',
        stepTitle: 'Game Type',
        description: 'Create your account',
        imageSrc: '/icon-check.svg', 
        linkHref: '/lobby',
        buttondescription: 'Start',
    },
    {
        id: 2,
        stepNumber: '02',
        stepTitle: 'Make to Deposit',
        description: 'Top up youe balance',
        imageSrc: '/icon-coin.svg',
        linkHref: '/lobby',
        buttondescription: 'Deposit',
    },
    {
        id: 3,
        stepNumber: '03',
        stepTitle: 'Claim Free Spins',
        description: 'Grab your the spins',
        imageSrc: '/icon-apple.svg',
        linkHref: '/lobby',
        buttondescription: 'Get',
    },
    {
        id: 4,
        stepNumber: '04',
        stepTitle: 'Play & Win',
        description: 'Enjoy the games and win real rewards',
        imageSrc: '/icon-trophy.svg',
        linkHref: '/lobby',
        buttondescription: 'Play',
    },
    {
        id: 5,
        stepNumber: '05',
        stepTitle: 'Fast Withdrawals',
        description: 'Withdrawals in under 15 minutes',
        imageSrc: '/icon-watch.svg',
        linkHref: '/lobby',
        buttondescription: 'Withdraw',
    },
];

const Stages = () => {
    const [activeStepId, setActiveStepId] = useState<number | null>(null);

    const handleStepClick = (id: number) => {
        setActiveStepId(id);
    };

    return (
        <section className={styles.stagesSection}>
            <div className={styles.container}>
                
                <h2 className={styles.sectionTitle}>
                    How to start?
                </h2>

                <div className={styles.gridContainer}>
                    {stagesData.map((item) => {
                        const isActive = activeStepId === item.id;

                        return (
                            <div 
                                key={item.id} 
                                className={`${styles.card} ${isActive ? styles.disabled : ''}`}
                            >
                                {/* Порядок в HTML: Header -> Image -> Desc -> Button */}
                                {/* Grid-areas в CSS переставят их местами на мобильном */}
                                
                                <div className={styles.cardHeader}>
                                    <span className={styles.stepNum}>{item.stepNumber}</span>
                                    <span className={styles.stepTitle}>{item.stepTitle}</span>
                                </div>

                                <div className={styles.imageWrapper}>
                                    <Image 
                                        src={item.imageSrc} 
                                        alt={item.stepTitle}
                                        width={255} 
                                        height={240}
                                        className={styles.icon3d}
                                        // style={{ width: 'auto', height: 'auto' }} // Можно добавить, если картинки плющит
                                    />
                                </div>

                                <p className={styles.description}>
                                    {item.description}
                                </p>
                                
                                <Link 
                                    href={item.linkHref} 
                                    className={styles.lobbyButton}
                                    onClick={() => handleStepClick(item.id)}
                                    aria-disabled={isActive}
                                >
                                    {/* На скриншоте везде написано Lobby, но я оставил ваш текст */}
                                    {isActive ? 'Active' : item.buttondescription}
                                </Link>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    )
}

export default Stages;