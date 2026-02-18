'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './PromoCard.module.scss';

// Пути к картинкам в папке public
const ASSETS = {
  coupon: '/coupon.svg',
  google: '/google.svg',
  twitter: '/twitter.svg',   
  facebook: '/fasebook.svg', 
};

interface PromoCardProps {
  onSubmit?: (code: string) => void;
  className?: string;
}

export const PromoCard: React.FC<PromoCardProps> = ({ onSubmit, className }) => {
  const [promoCode, setPromoCode] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(promoCode);
    }
  };

  return (
    <div className={`${styles.card} ${className || ''}`}>
      {/* Верхняя часть */}
      <div className={styles.header}>
        <div className={styles.titleBlock}>
          <Image 
            src={ASSETS.coupon} 
            alt="Coupon" 
            className={styles.icon}
            // Обязательно указываем размеры для картинок из public
            width={32} 
            height={32}
          />
          <h2>Have a promocode?</h2>
        </div>

        <div className={styles.socials}>
          {/* Google */}
          <Link href="/auth/google" className={styles.socialLink} aria-label="Login with Google">
            <Image 
              src={ASSETS.google} 
              alt="Google" 
              className={styles.socialIcon} 
              width={40} 
              height={40} 
            />
          </Link>
          
          {/* Twitter (X) */}
          <Link href="/auth/twitter" className={styles.socialLink} aria-label="Login with Twitter">
            <Image 
              src={ASSETS.twitter} 
              alt="Twitter" 
              className={styles.socialIcon} 
              width={40} 
              height={40} 
            />
          </Link>
          
          {/* Facebook */}
          <Link href="/auth/facebook" className={styles.socialLink} aria-label="Login with Facebook">
            <Image 
              src={ASSETS.facebook} 
              alt="Facebook" 
              className={styles.socialIcon} 
              width={40} 
              height={40} 
            />
          </Link>
        </div>
      </div>

      {/* Форма */}
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.inputGroup}>
          <input
            type="text"
            placeholder="Enter here"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
          />
        </div>
        <button type="submit" className={styles.submitButton}>
          Log in/Sign up
        </button>
      </form>
    </div>
  );
};