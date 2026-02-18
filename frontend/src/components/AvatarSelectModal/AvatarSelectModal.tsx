"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import styles from './AvatarSelectModal.module.scss';

interface AvatarSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (avatarUrl: string) => void;
}

// Массив путей к аватарам (замени на свои пути)
const AVATAR_LIST = [
  '/av1.svg', '/av2.svg', '/av3.svg',
  '/av4.svg', '/av5.svg', '/av6.svg',
  '/av7.svg', '/av8.svg', '/av9.svg',
  '/av10.svg', '/av11.svg', '/av12.svg',
];

export default function AvatarSelectModal({ isOpen, onClose, onSave }: AvatarSelectModalProps) {
  const [selected, setSelected] = useState<string>(AVATAR_LIST[4]); // По умолчанию выбран 5-й

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        
        {/* Кнопка закрытия */}
        <button className={styles.closeBtn} onClick={onClose}>
          <Image src="/close.svg" alt="Close" width={24} height={24} />
        </button>

        <h2 className={styles.title}>Select an avatar from the collection</h2>

        {/* Сетка аватаров */}
        <div className={styles.avatarGrid}>
          {AVATAR_LIST.map((url, index) => (
            <div 
              key={index} 
              className={`${styles.avatarItem} ${selected === url ? styles.active : ''}`}
              onClick={() => setSelected(url)}
            >
              <div className={styles.imageWrapper}>
                <Image 
                  src={url} 
                  alt={`Avatar ${index + 1}`} 
                  fill
                  sizes="100px"
                  className={styles.img}
                />
              </div>
              
              {/* Галочка выбора */}
              {selected === url && (
                <div className={styles.checkBadge}>
                  <Image src="/check-blue.svg" alt="selected" width={12} height={12} />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Кнопка подтверждения */}
        <button 
          className={styles.saveBtn} 
          onClick={() => {
            onSave(selected);
            onClose();
          }}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}