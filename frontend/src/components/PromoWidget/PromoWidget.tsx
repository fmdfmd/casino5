import React from 'react';
import Image, { StaticImageData } from 'next/image';
import styles from './PromoWidget.module.scss';

interface PromoWidgetProps {
  timer: string;
  // clockIconSrc удален, так как используем текст
  rewardImageSrc: string | StaticImageData;
  onSecondaryAction?: () => void;
  onPrimaryAction?: () => void;
}

const PromoWidget: React.FC<PromoWidgetProps> = ({
  timer,
  rewardImageSrc,
  onSecondaryAction,
  onPrimaryAction,
}) => {
  return (
    <div className={styles.container}>
      {/* Левая часть: Кнопки действий */}
      <div className={styles.actionArea}>
        <button className={styles.secondaryBtn} onClick={onSecondaryAction}>
          Log in/Sign up
        </button>
        
        <button className={styles.secondaryBtn} onClick={onSecondaryAction}>
          Log in/Sign up
        </button>

        <button className={styles.primaryBtn} onClick={onPrimaryAction}>
          Collect bonus
        </button>
      </div>

      {/* Правая часть: Таймер и Визуал */}
      <div className={styles.displayArea}>
        <div className={styles.timerBlock}>
          {/* Убрали Image, добавили эмодзи в текст */}
          <span className={styles.timerValue}>⏰ {timer}</span>
        </div>

        <div className={styles.visualWrapper}>
          <Image 
            src={rewardImageSrc} 
            alt="Reward" 
            fill
            sizes="(max-width: 768px) 100vw, 200px"
            style={{ objectFit: 'contain' }}
            priority
          />
        </div>
      </div>
    </div>
  );
};

export default PromoWidget;