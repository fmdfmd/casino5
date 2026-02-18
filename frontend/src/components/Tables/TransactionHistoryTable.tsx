'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import clsx from 'clsx';
import styles from './Tables.module.scss';
import Pagination from './Pagination';

export interface TransactionItem {
    id: string | number;
    date: string;
    type: string;
    currencyCode: string;
    currencyIcon: string;
    amount: number;
    fee: number;
    status: 'Completed' | 'Pending';
}

const TransactionHistoryTable: React.FC<{ data: TransactionItem[] }> = ({ data }) => {
    const [page, setPage] = useState(1);
    const totalPages = 29;

    return (
        <div className={styles.container}>
            <div className={styles.table}>
                <div className={styles.headerRow}>
                    <div className={styles.cell}>Data</div>
                    <div className={clsx(styles.cell, styles.hideSE)}>Type</div>
                    <div className={clsx(styles.cell, styles.hideMobile)}>Currency</div>
                    <div className={clsx(styles.cell, styles.hideTablet)}>Fee</div>
                    <div className={styles.cell}>Amount</div>
                    <div className={clsx(styles.cell, styles.alignRight)}>Status</div>
                </div>
                <div className={styles.body}>
                    {data.map((item) => (
                        <div key={item.id} className={styles.row}>
                            <div className={styles.cell}><span className={styles.dimText}>{item.date}</span></div>
                            <div className={clsx(styles.cell, styles.hideSE)}><span className={styles.mainText}>{item.type}</span></div>
                            <div className={clsx(styles.cell, styles.hideMobile)}>
                                <div className={styles.amountWrapper}>
                                    <span className={styles.dimText}>{item.currencyCode}</span>
                                    <Image src={item.currencyIcon} width={16} height={16} alt="c" />
                                </div>
                            </div>
                            <div className={clsx(styles.cell, styles.hideTablet)}>
                                <div className={styles.amountWrapper}>
                                    <span className={styles.feeText}>{item.fee}</span>
                                    <Image src={item.currencyIcon} width={14} height={14} alt="c" style={{opacity: 0.7}} />
                                </div>
                            </div>
                            <div className={styles.cell}>
                                <div className={styles.amountWrapper}>
                                    <span className={styles.mainText}>{item.amount}</span>
                                    <Image src={item.currencyIcon} width={16} height={16} alt="c" />
                                </div>
                            </div>
                            <div className={clsx(styles.cell, styles.alignRight)}>
                                <span className={item.status === 'Completed' ? styles.statusCompleted : styles.statusPending}>
                                    {item.status}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={(p) => setPage(p)} />
        </div>
    );
};

export default TransactionHistoryTable;