'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import clsx from 'clsx'; 
import styles from './RecentWinnings.module.scss';

export interface BetItem {
    id: string | number;
    gameName: string;
    user: string;
    time: string;
    betAmount: number;
    betCurrencyIcon: string; 
    coefficient: string;     
    payout: number;
    payoutCurrencyIcon: string;
    status: 'win' | 'loss' | 'pending';
}

interface RecentWinningsProps {
    title?: string;
    data?: BetItem[]; 
}

const MOCK_DATA: BetItem[] = Array(8).fill(null).map((_, i) => ({
    id: i,
    gameName: 'Roulette',
    user: 'Hidden',
    time: '9:10 AM',
    betAmount: i % 2 === 0 ? 5.7685400 : 15000,
    betCurrencyIcon: i % 2 === 0 ? '/btc.svg' : '/eth.svg', 
    coefficient: '2,4x',
    payout: i % 3 === 0 ? -1.506570 : 5.7685400,
    payoutCurrencyIcon: i % 2 === 0 ? '/btc.svg' : '/eth.svg',
    status: i % 3 === 0 ? 'loss' : 'win', 
}));

const TABS = ['All bets', 'Ongoing', 'Completed'];

const RecentWinnings: React.FC<RecentWinningsProps> = ({ 
    title = 'Check out Recent Winnings', 
    data = MOCK_DATA 
}) => {
    const [activeTab, setActiveTab] = useState('All bets');

    return (
        <section className={styles.container}>
            {/* Заголовок */}
            <h2 className={styles.title}>{title}</h2>

            {/* Табы */}
            <div className={styles.tabs}>
                {TABS.map((tab) => (
                    <button
                        key={tab}
                        className={clsx(styles.tabButton, {
                            [styles.active]: activeTab === tab
                        })}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Таблица */}
            <div className={styles.table}>
                {/* Шапка таблицы */}
                <div className={styles.headerRow}>
                    {/* Game - виден всегда */}
                    <div className={styles.cell}>Game</div>
                    
                    {/* User - скрыт на мобильном */}
                    <div className={clsx(styles.cell, styles.colUser)}>User</div>
                    
                    {/* Time - скрыт на планшете и мобильном */}
                    <div className={clsx(styles.cell, styles.colTime)}>Time</div>
                    
                    {/* Bet Amount - скрыт на мобильном */}
                    <div className={clsx(styles.cell, styles.colBet, styles.alignRight)}>Bet amount</div>
                    
                    {/* Coefficient - скрыт на мобильном */}
                    <div className={clsx(styles.cell, styles.colCoeff, styles.alignRight)}>Coefficient</div>
                    
                    {/* Payout - виден всегда */}
                    <div className={clsx(styles.cell, styles.alignRight)}>Payout</div>
                </div>

                {/* Тело таблицы */}
                <div className={styles.body}>
                    {data.map((item) => (
                        <div key={item.id} className={styles.row}>
                            
                            {/* Game */}
                            <div className={styles.cell}>
                                <span className={styles.gameName}>{item.gameName}</span>
                            </div>

                            {/* User */}
                            <div className={clsx(styles.cell, styles.colUser)}>
                                <span className={styles.hiddenUser}>{item.user}</span>
                            </div>

                            {/* Time */}
                            <div className={clsx(styles.cell, styles.colTime)}>
                                <span className={styles.time}>{item.time}</span>
                            </div>

                            {/* Bet Amount */}
                            <div className={clsx(styles.cell, styles.colBet, styles.alignRight)}>
                                <div className={styles.amountWrapper}>
                                    <span className={styles.amountValue}>
                                        {item.betAmount.toLocaleString()}
                                    </span>
                                    
                                    <div className={styles.currencyIcon}>
                                        <Image 
                                            src={item.betCurrencyIcon} 
                                            alt="currency" 
                                            width={18} 
                                            height={18} 
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Coefficient */}
                            <div className={clsx(styles.cell, styles.colCoeff, styles.alignRight)}>
                                <span className={styles.coefficient}>{item.coefficient}</span>
                            </div>

                            {/* Payout */}
                            <div className={clsx(styles.cell, styles.alignRight)}>
                                <div className={clsx(styles.amountWrapper, {
                                    [styles.win]: item.status === 'win',
                                    [styles.loss]: item.status === 'loss',
                                })}>
                                    <span className={styles.amountValue}>
                                        {item.payout > 0 && item.status === 'win' ? '+' : ''}
                                        {item.payout.toLocaleString()}
                                    </span>
                                    
                                    <div className={styles.currencyIcon}>
                                       <Image 
                                            src={item.payoutCurrencyIcon} 
                                            alt="currency" 
                                            width={18} 
                                            height={18} 
                                        />
                                    </div>
                                </div>
                            </div>

                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default RecentWinnings;