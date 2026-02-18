'use client';

import React, { useState, useCallback } from 'react';
import Image from 'next/image';
import { Carousel } from '@mantine/carousel';
import '@mantine/carousel/styles.css'; 
import News from "@/components/News/News"; // Убедись, что путь верный
import styles from './CarouselNews.module.scss';
import { newsData } from '@/data/newsData'; // Импорт общих данных

interface EmblaInstance {
  scrollPrev: () => void;
  scrollNext: () => void;
}

// Добавил проп currentId (необязательный), чтобы знать, кого скрывать
interface CarouselNewsProps {
  currentId?: number;
}

export default function CarouselNews({ currentId }: CarouselNewsProps) {

  const [embla, setEmbla] = useState<EmblaInstance | null>(null);

  // Фильтруем: берем все новости, кроме той, чей ID = currentId
  const displayList = currentId 
    ? newsData.filter(item => item.id !== currentId) 
    : newsData;

  const handleScrollPrev = useCallback(() => {
    if (embla) embla.scrollPrev();
  }, [embla]);

  const handleScrollNext = useCallback(() => {
    if (embla) embla.scrollNext();
  }, [embla]);

  return (
    <section className={styles.section}>
        <div className={styles.container}>
          
          <div className={styles.headerWrapper}>
            <h2 className={styles.sectionTitle}>
              More News
            </h2>

            <div className={styles.controlsGroup}>
              <button 
                onClick={handleScrollPrev} 
                className={styles.navButton} 
                aria-label="Previous slide"
              >
                {/* Если нет картинки, используем текст, чтобы не ломалось */}
                <span style={{color:'white'}}>&lt;</span>
              </button>
              
              <button 
                onClick={handleScrollNext} 
                className={styles.navButton} 
                aria-label="Next slide"
              >
                 <span style={{color:'white'}}>&gt;</span>
              </button>
            </div>
          </div>
          
          <Carousel
            getEmblaApi={(instance) => setEmbla(instance as unknown as EmblaInstance)}
            withIndicators={false}
            withControls={false}
            slideGap={{ base: '10px', sm: '16px', lg: '24px' }}
            slideSize={{ 
              base: '100%',        
              sm: '50%',          
              md: '33.333333%',   
            }} 
            classNames={{
              root: styles.carouselRoot,
            }}
          >
            {displayList.map((newsItem) => (
              <Carousel.Slide key={newsItem.id}>
                {/* showReadMore={false} так как в блоке More News кнопка обычно не нужна */}
                <News item={newsItem} showReadMore={false} />
              </Carousel.Slide>
            ))}
          </Carousel>

        </div>  
    </section>
  );
}