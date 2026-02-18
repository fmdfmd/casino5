'use client';

import React from 'react';
import Image from 'next/image';
import styles from './EmptyState.module.scss';

interface EmptyStateProps {
    imageSrc: string;
    title: string;
    description: string;
    buttonText: string;
    onAction: () => void;
}

export default function EmptyState({ 
    imageSrc, 
    title, 
    description, 
    buttonText, 
    onAction 
}: EmptyStateProps) {
    return (
        <div className={styles.container}>
            <div className={styles.imageBox}>
                <Image 
                    src={imageSrc} 
                    alt={title} 
                    width={220} 
                    height={180} 
                />
            </div>
            
            <h4 className={styles.titleText}>{title}</h4>
            
            <button className={styles.balanceup} onClick={onAction}>
                {buttonText}
            </button>
            
            <p className={styles.description}>{description}</p>
        </div>
    );
}