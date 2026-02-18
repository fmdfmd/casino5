"use client";
import React from 'react';
import Image from 'next/image';
import styles from './BetDetailModal.module.scss';

interface BetDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  data?: {
    gameName: string;
    id: string;
    date: string;
    betAmount: string;
    odds: string;
    payout: string;
  };
}

export default function BetDetailModal({ isOpen, onClose, data }: BetDetailModalProps) {
  if (!isOpen) return null;

  // Фейковые данные по умолчанию, если пропсы не переданы
  const bet = data || {
    gameName: "Roulette",
    id: "370 521 735 794",
    date: "17.06.2025 в 15:34",
    betAmount: "$1,464.88",
    odds: "1,95x",
    payout: "$2,856.53"
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        
        {/* Шапка */}
        <div className={styles.header}>
          <span className={styles.headerTitle}>Bet</span>
          <button className={styles.closeBtn} onClick={onClose}>
            <Image src="/close.svg" alt="Close" width={24} height={24} />
          </button>
        </div>

        <div className={styles.mainContent}>
          {/* Информация об игре */}
          <div className={styles.gameInfo}>
            <h2 className={styles.gameName}>{bet.gameName}</h2>
            <div className={styles.betId}>
              <span>ID {bet.id}</span>
              <button className={styles.copyBtn}>
                <Image src="/copy_modal.svg" alt="Copy" width={16} height={16} />
              </button>
            </div>
            <p className={styles.dateInfo}>Placed • Hidden • {bet.date}</p>
          </div>

          <div className={styles.divider}></div>

          {/* Сетка со статами */}
          <div className={styles.statsGrid}>
            <div className={styles.statItem}>
              <span className={styles.label}>Bet</span>
              <strong className={styles.value}>{bet.betAmount}</strong>
            </div>
            <div className={styles.verticalDivider}></div>
            <div className={styles.statItem}>
              <span className={styles.label}>Odds</span>
              <strong className={styles.value}>{bet.odds}</strong>
            </div>
            <div className={styles.verticalDivider}></div>
            <div className={styles.statItem}>
              <span className={styles.label}>Payout</span>
              <strong className={`${styles.value} ${styles.green}`}>{bet.payout}</strong>
            </div>
          </div>

          {/* Главная кнопка */}
          <button className={styles.playBtn}>
            Play {bet.gameName}
          </button>

          {/* Футер с соцсетями */}
          <div className={styles.footer}>
            <span className={styles.shareLabel}>To Share:</span>
            <div className={styles.socialIcons}>
              <button className={styles.socialBtn}>
                <Image src="/tg_modal.svg" alt="Telegram" width={32} height={32} />
              </button>
              <button className={styles.socialBtn}>
                <Image src="/fb_modal.svg" alt="Facebook" width={32} height={32} />
              </button>
              <button className={styles.socialBtn}>
                <Image src="/inst_modal.svg" alt="Instagram" width={32} height={32} />
              </button>
              <button className={styles.socialBtn}>
                <Image src="/x_modal.svg" alt="X" width={32} height={32} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}