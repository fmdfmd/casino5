'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import styles from './NotificationsDropdown.module.scss';


const NOTIFICATIONS = [
    {
        id: 1,
        icon: '/bell-yellow.svg', 
        text: 'Deposit successful: 0.5 BTC added to your balance',
        time: 'Just now',
    },
    {
        id: 2,
        icon: '/bulb.svg', // Иконка лампочки
        text: "Don't forget to verify your account to access all features.",
        time: '10 min ago',
    },
    {
        id: 3,
        icon: '/party.svg', // Иконка хлопушки
        text: 'You won 100 free spins in the Mega Wheel promo!',
        time: '5 min ago',
    },
    {
        id: 4,
        icon: '/party.svg',
        text: 'Bonus activated! 50 free spins.',
        time: '5 min ago',
    },
    {
        id: 5,
        icon: '/party.svg',
        text: 'Tournament started! Carnival cup has started',
        time: '', // Если времени нет, поле скроется (по логике ниже)
    },
];

const NotificationsDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleOpen = () => {
        setIsOpen((prev) => !prev);
    };

    // Функция для закрытия конкретного уведомления (пока просто для UI)
    const removeNotification = (e: React.MouseEvent, id: number) => {
        e.stopPropagation(); // Чтобы меню не закрылось при клике на крестик
        console.log('Remove notification', id);
    };

    return (
        <div className={styles.container}>
            {/* Кнопка колокольчика */}
            <button 
                className={styles.bellButton} 
                type="button" 
                onClick={toggleOpen}
            >
                <Image
                    src={isOpen ? '/bell-active.svg' : '/bell.svg'} 
                    alt="Notifications"
                    width={32} // Размер согласно вашим требованиям к адаптиву
                    height={32}
                    priority
                />
            </button>

            {/* Выпадающее меню */}
            {isOpen && (
                <div className={styles.dropdown}>
                    {/* Шапка меню */}
                    <div className={styles.dropdownHeader}>
                        <div className={styles.dropdownTitle}>
                            <Image 
                                src="/bell.svg" 
                                alt="Bell" 
                                width={16} 
                                height={16} 
                            />
                            <span>Notifications</span>
                        </div>
                        <button 
                            className={styles.closeMainButton} 
                            onClick={() => setIsOpen(false)}
                            type="button"
                        >
                            <Image 
                                src="/close.svg" // Иконка крестика
                                alt="Close" 
                                width={28} 
                                height={28} 
                            />
                        </button>
                    </div>

                    {/* Список уведомлений */}
                    <div className={styles.dropdownList}>
                        {NOTIFICATIONS.map((item) => (
                            <div key={item.id} className={styles.notificationItem}>
                                {/* Иконка уведомления */}
                                <div className={styles.iconWrapper}>
                                    <Image 
                                        src={item.icon} 
                                        alt="Icon" 
                                        width={24} 
                                        height={24} 
                                    />
                                </div>

                                {/* Текст и время */}
                                <div className={styles.contentWrapper}>
                                    <p className={styles.text}>{item.text}</p>
                                    {item.time && <span className={styles.time}>{item.time}</span>}
                                </div>

                                {/* Кнопка закрыть (маленький крестик) */}
                                <button 
                                    className={styles.closeItemButton}
                                    onClick={(e) => removeNotification(e, item.id)}
                                    type="button"
                                >
                                    <Image 
                                        src="/close.svg" 
                                        alt="Remove" 
                                        width={20} 
                                        height={20} 
                                    />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationsDropdown;