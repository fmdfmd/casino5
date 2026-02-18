'use client';

import React, { useState, useCallback } from 'react';
import { Carousel } from '@mantine/carousel';
import '@mantine/carousel/styles.css';
import styles from './LoyaltyCarousel.module.scss';
import StatusCard from '../StatusCard/StatusCard';

interface EmblaInstance {
  scrollPrev: () => void;
  scrollNext: () => void;
}

export default function LoyaltyCarousel({ levels }: { levels: any[] }) {
  const [embla, setEmbla] = useState<EmblaInstance | null>(null);

  const handlePrev = useCallback(() => embla?.scrollPrev(), [embla]);
  const handleNext = useCallback(() => embla?.scrollNext(), [embla]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.controls}>
          <button onClick={handlePrev} className={styles.btn}>←</button>
          <button onClick={handleNext} className={styles.btn}>→</button>
        </div>
      </div>

      <Carousel
        getEmblaApi={(instance) => setEmbla(instance as any)}
        withIndicators={false}
        withControls={false}
        slideGap="15px"
        slideSize="85%" // Видно кусочек следующей карточки
        classNames={{
          root: styles.carouselRoot,
          slide: styles.carouselSlide,
        }}
      >
        {levels.map((level, idx) => (
          <Carousel.Slide key={idx}>
            <StatusCard {...level} />
          </Carousel.Slide>
        ))}
      </Carousel>
    </div>
  );
}