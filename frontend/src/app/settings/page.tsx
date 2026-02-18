'use client';

import React, { useState } from 'react';
import styles from './page.module.scss';

import HeaderUpGetbonus from '@/components/HeaderUp/HeaderUpGetbonus';
import Header from '@/components/Header/Header';
import SlideBar from '@/components/SlideBar/SlideBar';
import Footer from '@/components/Footer/Footer';
import Chat from '@/widgets/chat/ui';
import InfoModal from '@/components/InfoModal/InfoModal';

// --- Компонент Toggle ---
interface ToggleProps {
  title: string;
  desc?: string;
  isChecked: boolean;
  onChange: () => void;
  onInfoClick: () => void;
}

const ToggleItem = ({ title, desc, isChecked, onChange, onInfoClick }: ToggleProps) => (
  <div className={styles.toggleRow}>
    <div className={styles.toggleLeft}>
      <div className={styles.titleWithIcon}>
        <h3 onClick={onChange}>{title}</h3>
        <button 
          className={styles.questionBadge} 
          onClick={(e) => {
            e.stopPropagation();
            onInfoClick();
          }}
        >
          ?
        </button>
      </div>
      {desc && <span onClick={onChange}>{desc}</span>}
    </div>
    <div 
      className={`${styles.switch} ${isChecked ? styles.active : ''}`} 
      onClick={onChange}
    >
      <div className={styles.slider}></div>
    </div>
  </div>
);

// --- Компонент Radio ---
interface RadioProps {
  label: string;
  value: string;
  selectedValue: string;
  onSelect: (val: string) => void;
}

const RadioItem = ({ label, value, selectedValue, onSelect }: RadioProps) => {
  const isActive = value === selectedValue;
  return (
    <div className={`${styles.radioRow} ${isActive ? styles.activeRow : ''}`} onClick={() => onSelect(value)}>
      <label>{label}</label>
      <div className={`${styles.radioCircle} ${isActive ? styles.active : ''}`}>
        {isActive && <div className={styles.radioDot}></div>}
      </div>
    </div>
  );
};

export default function PreferencePage() {
  const [settings, setSettings] = useState({
    stealthMode: false,
    hideStatistics: true,
    hideTournament: true,
    giveUpRains: false,
    emailOffers: true,
    fiatFormat: 'comma-dot' 
  });

  // Состояние для динамической модалки
  const [modal, setModal] = useState({
    isOpen: false,
    title: '',
    content: ''
  });

  const openInfo = (title: string, content: string) => {
    setModal({ isOpen: true, title, content });
  };

  const handleToggle = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleFormat = (val: string) => {
    setSettings(prev => ({ ...prev, fiatFormat: val }));
  };

  return (
    <>
      <HeaderUpGetbonus />
      <Header />

      <div className={styles.wrapper}>
        <SlideBar />

        <main className={styles.mainContent}>
          <div className={styles.pageHeader}>
             <h1>Preferences</h1>
          </div>

          <div className={styles.contentGrid}>
            
            {/* 1. Privacy */}
            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <h2>Privacy</h2>
                <p>Anonymity settings for your account.</p>
              </div>
              <div className={styles.cardBody}>
                <ToggleItem 
                  title="Activate stealth mode" 
                  isChecked={settings.stealthMode}
                  onChange={() => handleToggle('stealthMode')}
                  onInfoClick={() => openInfo("Stealth Mode", "Your username will not be displayed in the public betting log and in the bet preview.")}
                />
                <ToggleItem 
                  title="Hide all statistics" 
                  isChecked={settings.hideStatistics}
                  onChange={() => handleToggle('hideStatistics')}
                  onInfoClick={() => openInfo("Statistics", "Only you will be able to see your profit, loss, and total game turnover statistics.")}
                />
                <ToggleItem 
                  title="Hide all tournament statistics" 
                  isChecked={settings.hideTournament}
                  onChange={() => handleToggle('hideTournament')}
                  onInfoClick={() => openInfo("Tournaments", "Other users will not be able to see your current score or rank in any active tournaments.")}
                />
              </div>
            </section>

            {/* 2. Community */}
            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <h2>Community</h2>
                <p>Manage chat and community features.</p>
              </div>
              <div className={styles.cardBody}>
                <ToggleItem 
                  title="Give up the rains" 
                  isChecked={settings.giveUpRains}
                  onChange={() => handleToggle('giveUpRains')}
                  onInfoClick={() => openInfo("Chat Rains", "By enabling this, you will be excluded from receiving random cryptocurrency drops (Rains) in the public chat.")}
                />
              </div>
            </section>

            {/* 3. Marketing */}
            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <h2>Marketing</h2>
              </div>
              <div className={styles.cardBody}>
                <ToggleItem 
                  title="Our offers by email" 
                  isChecked={settings.emailOffers}
                  onChange={() => handleToggle('emailOffers')}
                  onInfoClick={() => openInfo("Email Marketing", "Stay updated with personal bonus offers, weekly newsletters, and exclusive event invites.")}
                />
              </div>
            </section>

            {/* 4. Format */}
            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <h2>Format of fiat number</h2>
              </div>
              <div className={styles.cardBody}>
                <RadioItem 
                  label="123,456.78" 
                  value="comma-dot" 
                  selectedValue={settings.fiatFormat} 
                  onSelect={handleFormat} 
                />
                <RadioItem 
                  label="١٢٣٬٤٥٦٫٧٨" 
                  value="arabic" 
                  selectedValue={settings.fiatFormat} 
                  onSelect={handleFormat} 
                />
                <RadioItem 
                  label="123.456,78" 
                  value="dot-comma" 
                  selectedValue={settings.fiatFormat} 
                  onSelect={handleFormat} 
                />
              </div>
            </section>
          </div>
        </main>
      </div>

      <InfoModal 
        isOpen={modal.isOpen} 
        onClose={() => setModal({ ...modal, isOpen: false })} 
        title={modal.title}
      >
        <p>{modal.content}</p>
      </InfoModal>

      <Chat />
      <Footer />
    </>
  );
}