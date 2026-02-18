'use client';
import React from 'react';
import Image from 'next/image'; // Импортируем Image
import clsx from 'clsx';
import styles from './Tables.module.scss';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
    const renderPageNumbers = () => {
        const pages = [];
        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            pages.push(1, 2, 3, '...', totalPages);
        }

        return pages.map((page, index) => {
            if (page === '...') {
                return <span key={`dots-${index}`} className={styles.paginationDots}>...</span>;
            }
            return (
                <button
                    key={page}
                    onClick={() => onPageChange(page as number)}
                    className={clsx(styles.pageBtn, currentPage === page && styles.pageActive)}
                >
                    {page}
                </button>
            );
        });
    };

    return (
        <div className={styles.paginationContainer}>
            {/* Кнопка НАЗАД */}
            <button 
                className={styles.arrowBtn} 
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
            >
                <Image 
                    src="/arrow-left.svg" // Путь к вашей картинке в папке public
                    alt="Previous" 
                    width={15} 
                    height={15}
                    className={styles.arrowIcon}
                />
            </button>

            <div className={styles.pagesWrapper}>
                {renderPageNumbers()}
            </div>

            {/* Кнопка ВПЕРЕД */}
            <button 
                className={styles.arrowBtn} 
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
            >
                <Image 
                    src="/arrow-right.svg" // Путь к вашей картинке в папке public
                    alt="Next" 
                    width={15} 
                    height={15}
                    className={styles.arrowIcon}
                />
            </button>
        </div>
    );
};

export default Pagination;