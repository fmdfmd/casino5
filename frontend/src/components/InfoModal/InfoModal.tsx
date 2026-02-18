"use client";
import React, { ReactNode } from 'react';
import Image from 'next/image';
import styles from './InfoModal.module.scss';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export default function InfoModal({ isOpen, onClose, title = "Information", children }: InfoModalProps) {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Шапка */}
        <div className={styles.header}>
          <span className={styles.title}>{title}</span>
          <button className={styles.closeBtn} onClick={onClose}>
            <Image src="/close.svg" alt="Close" width={25} height={25} />
          </button>
        </div>

        {/* Разделитель */}
        <div className={styles.divider} />

        {/* Контент */}
        <div className={styles.content}>
          {children}
        </div>
      </div>
    </div>
  );
}