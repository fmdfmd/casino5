import React from 'react';
import Image, { StaticImageData } from 'next/image';
import styles from './StatusCard.module.scss';

export interface BenefitItemProps {
  label: string;
  value?: string | number;
  isAvailable: boolean;
}


interface StatusCardProps {
  title: string;
  iconSrc: string | StaticImageData; 
  bgSrc: string | StaticImageData;    
  currentMoney: number;
  targetMoney: number;
  maxProgress: number;
  benefits: BenefitItemProps[];
}

const StatusCard: React.FC<StatusCardProps> = ({
  title,
  iconSrc,
  bgSrc,
  currentMoney,
  targetMoney,
  maxProgress,
  benefits,
}) => {
  
  // Вычисляем процент заполнения полоски
  const progressPercent = Math.min((currentMoney / maxProgress) * 100, 100);

  return (
    <div className={styles.card}>
      {/* 1. Слой фона */}
      <div className={styles.bgLayer}>
        <Image 
          src={bgSrc} 
          alt="Card background" 
          fill 
          style={{ objectFit: 'cover' }}
          quality={80}
        />
        {/* Затемнение, чтобы текст читался */}
        <div className={styles.overlay} />
      </div>

      {/* 2. Контент */}
      <div className={styles.contentRelative}> 
        <div className={styles.iconWrapper}>
          <Image 
            src={iconSrc} 
            alt="Status Icon" 
            width={120} 
            height={120} 
            priority
          />
        </div>

        <h2 className={styles.title}>{title}</h2>

        {/* Секция прогресса */}
        <div className={styles.progressSection}>
          <div className={styles.progressHeader}>
            <span>Sign up to receive</span>
            <div className={styles.currentValues}>
              <span style={{ color: '#0C8CE9' }}>${currentMoney}</span> / ${targetMoney}
            </div>
          </div>

          <div className={styles.progressBarContainer}>
            <div 
              className={styles.progressBarFill} 
              style={{ width: `${progressPercent}%` }} 
            />
          </div>

          <div className={styles.scaleLabels}>
            <span>$0</span>
            <span>${maxProgress}</span>
          </div>
        </div>

        {/* Список преимуществ */}
        <ul className={styles.benefitsList}>
          {benefits.map((item, index) => (
            <li 
              key={index} 
              // Применяем класс 'available' если бонус активен
              className={`${styles.benefitItem} ${item.isAvailable ? styles.available : ''}`}
            >
              <span className={styles.benefitLabel}>{item.label}</span>
              
              {item.isAvailable ? (
                <span className={`${styles.benefitValue} ${styles.active}`}>
                  {item.value}
                </span>
              ) : (
                <span className={`${styles.benefitValue} ${styles.inactive}`}>
                  ✕
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default StatusCard;