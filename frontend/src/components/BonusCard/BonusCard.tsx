import React, { CSSProperties, useState } from 'react';
import Image, { StaticImageData } from 'next/image';
import styles from './BonusCard.module.scss';

// Тип для одного пункта на обратной стороне
export interface BonusDetail {
  id: string | number;
  iconSrc: string | StaticImageData;
  text: string;        
  highlightedText?: string; 
}

interface BonusCardProps {
  // --- КОНТЕНТ ЛИЦЕВОЙ СТОРОНЫ ---
  imageSrc: string | StaticImageData;
  bonusValue: string;
  description: string;
  timeText: string;
  providerText: string;
  buttonText: string;
  
  // --- ИКОНКИ ЛИЦЕВОЙ СТОРОНЫ ---
  trashIconSrc?: string | StaticImageData;
  infoIconSrc?: string | StaticImageData;
  clockIconSrc?: string | StaticImageData;

  // --- КОНТЕНТ ЗАДНЕЙ СТОРОНЫ (ДИНАМИЧЕСКИЙ) ---
  backTitle?: string;       // Заголовок (по дефолту "Bonus details")
  details?: BonusDetail[];  // Массив пунктов
  
  // --- СТИЛИ ---
  cardBackground?: string;
  buttonBackground?: string;
  timeColor?: string;
  borderColor?: string;
  
  // --- СОБЫТИЯ ---
  onButtonClick?: () => void;
  onTrashClick?: () => void;
}

const BonusCard: React.FC<BonusCardProps> = ({
  imageSrc,
  bonusValue,
  description,
  timeText,
  providerText,
  buttonText,
  
  trashIconSrc = '/trash.svg',
  infoIconSrc = '/info.svg',
  clockIconSrc = '/clock.svg',

  // Дефолтные значения для задней стороны
  backTitle = "Bonus details",
  details = [], 
  
  cardBackground,
  buttonBackground,
  timeColor,
  borderColor,
  onButtonClick,
  onTrashClick,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const customStyles = {
    '--card-bg': cardBackground,
    '--button-bg': buttonBackground,
    '--time-color': timeColor,
    '--card-border-color': borderColor,
  } as CSSProperties;

  return (
    <div className={styles.cardScene} style={customStyles}>
      <div className={`${styles.cardInner} ${isFlipped ? styles.flipped : ''}`}>
        
        {/* === ЛИЦЕВАЯ СТОРОНА === */}
        <div className={styles.cardFront}>
          <div className={styles.imageWrapper}>
            <Image 
              src={imageSrc} 
              alt="Bonus Chest" 
              fill
              sizes="(max-width: 600px) 100vw, 300px"
              style={{ objectFit: 'contain' }}
              priority 
            />
          </div>

          <div className={styles.mainInfo}>
            <button className={styles.iconButton} onClick={onTrashClick} type="button">
              <Image src={trashIconSrc} alt="Delete" width={24} height={24} />
            </button>
            
            <div className={styles.bonusValue}>{bonusValue}</div>
            
            <button className={styles.iconButton} onClick={handleFlip} type="button">
              <Image src={infoIconSrc} alt="Info" width={24} height={24} />
            </button>
          </div>

          <p className={styles.description}>{description}</p>

          <div className={styles.timer}>
            <Image src={clockIconSrc} alt="Time" width={16} height={16} />
            <span>{timeText}</span>
          </div>

          <div className={styles.provider}>{providerText}</div>

          <button className={styles.button} onClick={onButtonClick}>
            {buttonText}
          </button>
        </div>

        {/* === ЗАДНЯЯ СТОРОНА === */}
        <div className={styles.cardBack} onClick={handleFlip}>
          <h3 className={styles.backTitle}>{backTitle}</h3>
          
          <div className={styles.detailsList}>
            {details.length > 0 ? (
              details.map((item) => (
                <div key={item.id} className={styles.detailItem}>
                  <div className={styles.detailIcon}>
                    <Image src={item.iconSrc} alt="icon" width={32} height={32} />
                  </div>
                  <p className={styles.detailText}>
                    {item.text}{' '}
                    {/* Если есть highlight, рендерим его с подчеркиванием */}
                    {item.highlightedText && (
                      <span className={styles.underline}>{item.highlightedText}</span>
                    )}
                  </p>
                </div>
              ))
            ) : (
              <p style={{textAlign: 'center', width: '100%'}}>No details info</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default BonusCard;