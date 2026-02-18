'use client';

import React, { useState } from 'react';
import HeaderUpGetbonus from '@/components/HeaderUp/HeaderUpGetbonus';
import Header from '@/components/Header/Header';
import SlideBar from '@/components/SlideBar/SlideBar';
import Footer from '@/components/Footer/Footer';
import Chat from '@/widgets/chat/ui';
import PartnersNavigation from '@/components/PartnersNavigation/PartnersNavigation';

import styles from './page.module.scss';

export default function CampaignPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [expandedCard, setExpandedCard] = useState<number | null>(1);

    const campaigns = [
        { id: 1, name: 'Viktor Z.', rate: '0,10', commission: '0.00000000', transitions: 0, referrals: 0, deposits: 0 },
        { id: 2, name: 'Twitch_Promo_2025', rate: '0,15', commission: '0.00001240', transitions: 142, referrals: 12, deposits: 4 },
    ];

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        alert('Link copied!');
    };

    return (
        <>
            <HeaderUpGetbonus />
            <Header />
            <div className={styles.wrapper}>
                <SlideBar />
                
                <main className={styles.mainContent}>
                    <div className={styles.navContainer}>
                        <PartnersNavigation />
                    </div>

                    <section className={styles.dashboard}>
                        <div className={styles.headerRow}>
                            <h1 className={styles.pageTitle}>Partnership Program</h1>
                            <button className={styles.createBtn} onClick={() => setIsModalOpen(true)}>
                                <span>+</span> Create new campaign
                            </button>
                        </div>

                        {/* СТАТИСТИКА */}
                        <div className={styles.statsGrid}>
                            <div className={styles.statBox}>
                                <label>Transitions</label>
                                <strong>1,402</strong>
                            </div>
                            <div className={styles.statBox}>
                                <label>Referrals</label>
                                <strong>128</strong>
                            </div>
                            <div className={`${styles.statBox} ${styles.balanceBox}`}>
                                <label>Available</label>
                                <div className={styles.amount}>
                                    <strong>0.00004512</strong>
                                    <span className={styles.coin}>BTC</span>
                                </div>
                            </div>
                        </div>

                        {/* ТАБЛИЦА КАМПАНИЙ */}
                        <div className={styles.campaignTable}>
                            <div className={styles.tableHeader}>
                                <span>Campaign Name</span>
                                <span className={styles.hideMobile}>Rate</span>
                                <span className={styles.textRight}>Commission</span>
                            </div>

                            {campaigns.map((camp) => (
                                <div key={camp.id} className={`${styles.glassCard} ${expandedCard === camp.id ? styles.active : ''}`}>
                                    <div className={styles.cardHeader} onClick={() => setExpandedCard(expandedCard === camp.id ? null : camp.id)}>
                                        <div className={styles.nameCol}>
                                            <div className={styles.avatar}>
                                                <span>{camp.name[0]}</span>
                                            </div>
                                            <span className={styles.nameText}>{camp.name}</span>
                                        </div>
                                        
                                        <div className={`${styles.rateCol} ${styles.hideMobile}`}>
                                            {camp.rate}
                                        </div>

                                        <div className={styles.commCol}>
                                            <div className={styles.priceWrapper}>
                                                <strong>{camp.commission}</strong>
                                                <span className={styles.coinIcon}>🪙</span>
                                            </div>
                                            <span className={`${styles.arrow} ${expandedCard === camp.id ? styles.up : ''}`}>
                                                <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                </svg>
                                            </span>
                                        </div>
                                    </div>

                                    {expandedCard === camp.id && (
                                        <div className={styles.detailsContent}>
                                            <div className={styles.detailsGrid}>
                                                <div className={styles.detItem}><p>Transitions</p><span>{camp.transitions}</span></div>
                                                <div className={styles.detItem}><p>Referrals</p><span>{camp.referrals}</span></div>
                                                <div className={styles.detItem}><p>Deposits</p><span>{camp.deposits}</span></div>
                                            </div>
                                            <div className={styles.linkSection}>
                                                <label>Referral Link</label>
                                                <div className={styles.linkRow}>
                                                    <input readOnly value={`site.com/?c=${camp.name.toLowerCase()}`} />
                                                    <button className={styles.copyBtn} onClick={() => copyToClipboard(`site.com/?c=${camp.name.toLowerCase()}`)}>
                                                        Copy Link
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                </main>
            </div>

            {/* МОДАЛЬНОЕ ОКНО */}
            {isModalOpen && (
                <div className={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
                    <div className={styles.modalBox} onClick={e => e.stopPropagation()}>
                        
                        <div className={styles.modalHeader}>
                            <div className={styles.headerTitle}>
                                <span className={styles.headerIcon}>🔑</span>
                                <span>Create Campaign</span>
                            </div>
                            <button className={styles.closeBtn} onClick={() => setIsModalOpen(false)}>✕</button>
                        </div>

                        <div className={styles.modalBody}>
                            <p className={styles.questionText}>Do you want to create a new tracking link?</p>
                            
                            <div className={styles.modalInputGroup}>
                                <input type="text" placeholder="Enter campaign name..." />
                            </div>

                            <div className={styles.modalActions}>
                                <button className={styles.stayBtn} onClick={() => setIsModalOpen(false)}>
                                    Cancel
                                </button>
                                <button className={styles.getOutBtn}>
                                    Create
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            )}

            <Chat />
            <Footer />
        </>
    );
}