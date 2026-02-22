'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './SystemReboot.module.scss';

// Импорт компонентов макета
import HeaderUpGetbonus from '@/components/HeaderUp/HeaderUpGetbonus';
import Header from '@/components/Header/Header';
import SlideBar from '@/components/SlideBar/SlideBar';
import Footer from '@/components/Footer/Footer';
import Chat from '@/widgets/chat/ui';

export default function SystemRebootPage() {
	// Логика таймера (начинаем с 09:31)
	const [timeLeft, setTimeLeft] = useState(571);

	useEffect(() => {
		const timer = setInterval(() => {
			setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
		}, 1000);
		return () => clearInterval(timer);
	}, []);

	// Форматирование времени MM:SS
	const formatTime = (seconds: number) => {
		const m = Math.floor(seconds / 60)
			.toString()
			.padStart(2, '0');
		const s = (seconds % 60).toString().padStart(2, '0');
		return `${m}:${s}`;
	};

	return (
		<>
			{/* <HeaderUpGetbonus /> */}
			<Header />

			<div className={styles.wrapper}>
				<SlideBar />

				<main className={styles.mainContent}>
					<div className={styles.container}>
						{/* Изображение космонавта */}
						<div className={styles.imageWrapper}>
							<Image
								src='/reboot-astro.svg'
								alt='System Maintenance'
								width={600}
								height={600}
								className={styles.heroImage}
								priority
							/>
						</div>

						<h1 className={styles.title}>System reboot in progress...</h1>

						<p className={styles.description}>
							We’re upgrading your experience. Sit tight, we’ll be back shortly
							with new cosmic power ⚙️
						</p>

						<div className={styles.timerBlock}>
							{/* 
                                Вариант 1: Эмодзи-стикер (отображается цветным везде) 
                            */}
							<span style={{ fontSize: '28px', lineHeight: 1 }}>⏰</span>

							{/* 
                                Вариант 2: Если у вас есть свой файл картинки (раскомментируйте и удалите span выше)
                                <Image src="/alarm-icon.png" alt="Timer" width={28} height={28} />
                            */}

							<span>Estimated time left: {formatTime(timeLeft)}</span>
						</div>
					</div>
				</main>
			</div>

			<Chat />
			<Footer />
		</>
	);
}
