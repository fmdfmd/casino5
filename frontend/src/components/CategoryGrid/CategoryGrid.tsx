"use client";
import React, { useState } from 'react';
import PlayCard from '../PlayCard/PlayCard';
import styles from './CategoryGrid.module.scss';
import { ChevronDown, Layers } from 'lucide-react';

interface GameItem {
  id: number;
  title: string;
  imageSrc: string;
  slug: string;
}

interface CategoryGridProps {
  title: string;
  games: GameItem[];
  initialCount?: number;
}

const getIcon = (title: string) => {
  const t = title.toLowerCase();
  if (t.includes('popular')) return "🔥";
  if (t.includes('new')) return "✨";
  if (t.includes('slots')) return "🎰";
  if (t.includes('bonus') || t.includes('buy')) return "💰";
  if (t.includes('megaways')) return "⚡";
  if (t.includes('live') || t.includes('show')) return "🎥";
  if (t.includes('roulette')) return "🎡";
  if (t.includes('blackjack')) return "🃏";
  return "🎮";
};

export default function CategoryGrid({ title, games, initialCount = 12 }: CategoryGridProps) {
  const [visibleCount, setVisibleCount] = useState(initialCount);
  
  const totalGames = games.length;
  const isAllShown = visibleCount >= totalGames;
  
  // Рассчитываем, сколько покажем в следующий раз (по 12 или остаток)
  const showMore = () => {
    setVisibleCount((prev) => Math.min(prev + 12, totalGames));
  };

  if (totalGames === 0) return null;

  return (
    <div className={styles.container}>
      <section className={styles.categorySection}>
        <div className={styles.header}>
          <div className={styles.titleWrapper}>
            <span className={styles.emojiIcon}>{getIcon(title)}</span>
            <h2 className={styles.title}>{title}</h2>
          </div>
          <div className={styles.countBadge}>{totalGames} Games</div>
        </div>
        
        <div className={styles.gameGrid}>
          {games.slice(0, visibleCount).map((game) => (
            <div key={game.id} className={styles.cardHover}>
              <PlayCard 
                item={{
                  id: game.id,
                  title: game.title,
                  imageSrc: game.imageSrc,
                  linkHref: `/game/${game.slug}` 
                }} 
                onInfoClick={(id) => console.log(id)} 
              />
            </div>
          ))}
        </div>

        {!isAllShown && (
          <div className={styles.footerAction}>
            <div className={styles.progressInfo}>
                Showing <span>{visibleCount}</span> of <span>{totalGames}</span> games
                <div className={styles.progressBar}>
                    <div 
                        className={styles.progressFill} 
                        style={{ width: `${(visibleCount / totalGames) * 100}%` }}
                    ></div>
                </div>
            </div>
            
            <button className={styles.showMoreBtn} onClick={showMore}>
              <span>Show More</span>
              <ChevronDown size={18} />
            </button>
          </div>
        )}
      </section>
    </div>
  );
}