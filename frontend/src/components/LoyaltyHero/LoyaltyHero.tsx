'use client';

import React from 'react';
import Image, { StaticImageData } from 'next/image';
import styles from './LoyaltyHero.module.scss';

interface LoyaltyHeroProps {
  currentPoints: number;
  maxPoints: number;
  userName: string;
  nextLevelName: string;
  imageSrc: string | StaticImageData;
}

const LoyaltyHero: React.FC<LoyaltyHeroProps> = ({ 
  currentPoints, 
  maxPoints, 
  userName, 
  nextLevelName,
  imageSrc
}) => {
  // Вычисляем процент заполнения (максимум 100%)
  const progressPercent = Math.min((currentPoints / maxPoints) * 100, 100);

  return (
    <div className={styles.heroWrapper}>
      <div className={styles.crownContainer}>
        <Image 
          src={imageSrc} 
          alt="Loyalty Crown"
          width={280}
          height={250}
          priority
          className={styles.crownImage}
        />
      </div>

      <h1 className={styles.title}>LOYALTY PROGRAM</h1>
      <p className={styles.subtitle}>
        Play, increase your status, get more privileges and bonuses!
      </p>

      <div className={styles.progressBlock}>
        <div className={styles.statsRow}>
          <span className={styles.points}>
            ${currentPoints}<span className={styles.maxPoints}>/${maxPoints}</span>
          </span>
        </div>

        <div className={styles.progressBarBg}>
          <div 
            className={styles.progressBarFill} 
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>

        <div className={styles.actionRow}>
          <span className={styles.userText}>
            {userName}, Reach {nextLevelName} to go up!
          </span>
          <button className={styles.actionButton}>
            Log in/Sign up
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoyaltyHero;