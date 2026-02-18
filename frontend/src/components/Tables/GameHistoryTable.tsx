'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import clsx from 'clsx';
import styles from './Tables.module.scss';
import Pagination from './Pagination';
import BetDetailModal from '@/components/BetDetailModal/BetDetailModal';

export interface GameItem {
    id: string | number;
    game: string;
    time: string;
    betAmount: number;
    currencyIcon: string;
    coefficient: string;
    payout: number;
    status: 'win' | 'loss';
}

const GameHistoryTable: React.FC<{ data: GameItem[] }> = ({ data }) => {
    const [page, setPage] = useState(1);
    const totalPages = 29;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedBet, setSelectedBet] = useState<any>(null);

    const handleRowClick = (item: GameItem) => {
        setSelectedBet({
            gameName: item.game,
            id: `370 521 ${item.id}`, // Фейковый формат ID
            date: `17.06.2025 в ${item.time}`,
            betAmount: `$${item.betAmount.toLocaleString()}`,
            odds: item.coefficient,
            payout: `$${item.payout.toLocaleString()}`
        });
        setIsModalOpen(true);
    };

    return (
        <div className={styles.container}>
            <div className={styles.table}>
                <div className={styles.headerRow}>
                    <div className={clsx(styles.cell, styles.hideSE)}>Time</div>
                    <div className={styles.cell}>Game</div>
                    <div className={clsx(styles.cell, styles.hideMobile)}>Bet Amount</div>
                    <div className={clsx(styles.cell, styles.hideTablet)}>Coefficient</div>
                    <div className={styles.cell}>Payout</div>
                    <div className={clsx(styles.cell, styles.alignRight)}>Status</div>
                </div>
                <div className={styles.body}>
                    {data.map((item) => (
                        <div key={item.id} className={styles.row} onClick={() => handleRowClick(item)}>
                            <div className={clsx(styles.cell, styles.hideSE)}><span className={styles.dimText}>{item.time}</span></div>
                            <div className={styles.cell}><span className={styles.mainText}>{item.game}</span></div>
                            <div className={clsx(styles.cell, styles.hideMobile)}>
                                <div className={styles.amountWrapper}>
                                    <span className={styles.dimText}>{item.betAmount}</span>
                                    <Image src={item.currencyIcon} width={16} height={16} alt="c" />
                                </div>
                            </div>
                            <div className={clsx(styles.cell, styles.hideTablet)}>
                                <span className={styles.badgeHighlight}>{item.coefficient}</span>
                            </div>
                            <div className={styles.cell}>
                                <div className={clsx(styles.amountWrapper, item.status === 'win' ? styles.win : styles.loss)}>
                                    <span>{item.status === 'win' ? '+' : '-'}{Math.abs(item.payout)}</span>
                                    <Image src={item.currencyIcon} width={16} height={16} alt="c" />
                                </div>
                            </div>
                            <div className={clsx(styles.cell, styles.alignRight)}>
                                <div className={clsx(styles.statusBadge, item.status === 'win' ? styles.badgeWin : styles.badgeLoss)}>
                                    {item.status === 'win' ? 'Completed' : 'Loss'}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <Pagination currentPage={page} totalPages={totalPages} onPageChange={(p) => setPage(p)} />

            <BetDetailModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                data={selectedBet} 
            />
        </div>
    );
};

export default GameHistoryTable;