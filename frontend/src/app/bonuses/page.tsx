'use client';

import React from 'react';
import styles from './page.module.scss';

// Layout Components
import HeaderUpGetbonus from '@/components/HeaderUp/HeaderUpGetbonus';
import Header from '@/components/Header/Header';
import SlideBar from '@/components/SlideBar/SlideBar';
import Footer from '@/components/Footer/Footer';
import Chat from '@/widgets/chat/ui';

// Feature Components
import { PromoCard } from '@/components/PromoCard/PromoCard'; 
import PromoWidget from '@/components/PromoWidget/PromoWidget'; 
import BonusCard, { BonusDetail } from '@/components/BonusCard/BonusCard'; // Убедитесь, что BonusDetail экспортируется

export default function Home() {
  
  // 1. Создаем данные для задней стороны (детали бонуса)
  // Убедитесь, что иконки bulb.svg, money.svg, target.svg лежат в папке public
  const commonBonusDetails: BonusDetail[] = [
    {
      id: 1,
      iconSrc: "/bulb.svg", 
      text: "Get this bonus if you have",
      highlightedText: "between $100 and $10,000 on your balance"
    },
    {
      id: 2,
      iconSrc: "/money.svg",
      text: "Double the amount on",
      highlightedText: "your account!"
    },
    {
      id: 3,
      iconSrc: "/target.svg",
      text: "Play the bonus with a",
      highlightedText: "wager of 35x."
    }
  ];

  // Данные для карточек
  const bonuses = [
    {
      id: 1,
      imageSrc: "/freespin.svg", 
      bonusValue: "70",
      description: "freespins",
      timeText: "14 hours",
      providerText: "provider 35x",
      borderColor: "#FFA48D", 
      timeColor: "#ff0000", 
      cardBackground: "#FF9A8B",   
      buttonBackground: "#3E30E9",
      // Добавляем детали
      details: commonBonusDetails
    },
    {
      id: 2,
      imageSrc: "/chest.svg",
      bonusValue: "+50%",
      description: "instantly to the account up to $500",
      timeText: "14 days",
      providerText: "provider 35x",
      borderColor: "#8B3DFF",
      timeColor: "#00FF22",
      cardBackground: "linear-gradient(180deg, #6102D4 0%, #4F02CB 100%)",
      buttonBackground: "linear-gradient(90deg, #D900C4 0%, #9B01FC 100%)",
      details: commonBonusDetails
    },
    {
      id: 3,
      imageSrc: "/chest.svg",
      bonusValue: "+75%",
      description: "instantly to the account up to $750",
      timeText: "3 days",
      providerText: "provider 35x",
      borderColor: "#8B3DFF",
      timeColor: "#00FF22",
      cardBackground: "linear-gradient(180deg, #6102D4 0%, #4F02CB 100%)",
      buttonBackground: "linear-gradient(90deg, #D900C4 0%, #9B01FC 100%)",
      details: commonBonusDetails
    },
    {
      id: 4,
      imageSrc: "/chest.svg",
      bonusValue: "+100%",
      description: "instantly to the account up to $1000",
      timeText: "14 days",
      providerText: "provider 35x",
      borderColor: "#8B3DFF",
      timeColor: "#00FF22",
      cardBackground: "linear-gradient(180deg, #6102D4 0%, #4F02CB 100%)",
      buttonBackground: "linear-gradient(90deg, #D900C4 0%, #9B01FC 100%)",
      details: commonBonusDetails
    },
  ];

  return (
    <>
      <HeaderUpGetbonus />
      <Header />

      <div className={styles.wrapper}>
        <SlideBar />

        <main className={styles.mainContent}>
          
          {/* Верхняя секция */}
          <div className={styles.topSection}>
            <div className={styles.promoWrapper}>
               <PromoCard onSubmit={(code) => console.log(code)} />
            </div>
            
            <div className={styles.widgetWrapper}>
               <PromoWidget
                  timer="05:06:35"
                  rewardImageSrc="/money-bag.svg" 
                  onSecondaryAction={() => console.log('Login')}
                  onPrimaryAction={() => console.log('Collect')}
               />
            </div>
          </div>

          {/* Секция бонусов */}
          <div className={styles.bonusesSection}>
            <h2 className={styles.sectionTitle}>🎁 My bonuses</h2>
            
            <div className={styles.bonusesGrid}>
              {bonuses.map((bonus) => (
                <BonusCard 
                  key={bonus.id}
                  // Данные лицевой стороны
                  imageSrc={bonus.imageSrc}
                  trashIconSrc="/trash.svg"
                  infoIconSrc="/info.svg"
                  clockIconSrc="/clock.svg"

                  bonusValue={bonus.bonusValue}
                  description={bonus.description}
                  timeText={bonus.timeText}
                  providerText={bonus.providerText}
                  buttonText="Log in/Sign up"
                  
                  // Стилизация
                  borderColor={bonus.borderColor} 
                  timeColor={bonus.timeColor}
                  buttonBackground={bonus.buttonBackground}
                  cardBackground={bonus.cardBackground}

                  // 2. Новые пропсы для задней стороны
                  details={bonus.details} 
                  backTitle="Bonus details" 
                  
                  // Обработчики
                  onButtonClick={() => console.log('Bonus click', bonus.id)}
                  onTrashClick={() => console.log('Trash', bonus.id)}
                  // onInfoClick теперь переворачивает карту внутри компонента
                />
              ))}
            </div>
          </div>

        </main>
      </div>

      <Chat />
      <Footer />
    </>
  );
}