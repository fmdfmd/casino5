

'use client';

import HeaderUpGetbonus from '@/components/HeaderUp/HeaderUpGetbonus';
import Header from '@/components/Header/Header';
import Chat from '@/widgets/chat/ui';
import Footer from '@/components/Footer/Footer';
import SlideBar from '@/components/SlideBar/SlideBar'; 
import Accordion, { AccordionItemData } from '@/components/Accordion/Accordion';

import styles from './FAQPage.module.scss'; 



const faqData: AccordionItemData[] = [
  {
    id: 1,
    question: 'HOW TO COMPLETE THE ACCOUNT VERIFICATION PROCESS?',
    answer:
      'For security purposes and to prevent fraud, identity verification is required. ' +
      'This typically involves verifying your email, phone number, and uploading identification documents (such as a passport or ID). ' +
      'The procedure is performed in the "Verification" section of your personal account. ' +
      'Please follow the instructions carefully to avoid delays in withdrawing funds.',
    // iconSrc: '/assets/icons/document.svg', 
    // iconAlt: 'Document icon'
  },
  {
    id: 2,
    question: 'BONUS AND FREESPIN WAGERING (PLAYTHROUGH) RULES',
    answer:
      'All bonuses and winnings from free spins are subject to mandatory wagering (Wager). ' +
      'This is necessary to protect against bonus abuse. ' +
      '<ul>' +
      '<li>Winnings are credited to the bonus account and transferred to the real account only after the wagering requirements are met.</li>' +
      '<li>Wagering automatically occurs while playing slots or other games with real money.</li>' +
      '<li>Please check the specific bonus terms in the "Bonuses" section, as the Wager amount may vary.</li>' +
      '</ul>',
    // iconSrc: '/assets/icons/bonus.svg', 
    // iconAlt: 'Bonus icon'
  },
  {
    id: 3,
    question: 'PROCESSING TIMES FOR WITHDRAWALS',
    answer:
      'We strive to process all withdrawal requests as quickly as possible. ' +
      'Processing usually takes from **5 minutes to 3 hours** after the request is submitted. ' +
      'However, due to payment system and bank load, ' +
      'in rare cases, withdrawal may take up to **24 hours** or more. ' +
      'Please ensure your account is fully verified and all bonuses are wagered for a successful withdrawal.',
    // iconSrc: '/assets/icons/wallet.svg', 
    // iconAlt: 'Wallet icon'
  },
  {
    id: 4,
    question: 'SECURITY AND RESPONSIBLE GAMING GUIDELINES',
    answer:
      'We promote responsible gaming. Do not violate the rules, do not attempt to cheat, and do not create multiple accounts. ' +
      'Our security system constantly monitors activity, and in case of violations, the account may be blocked. ' +
      'Play responsibly and enjoy the process!',
    // iconSrc: '/assets/icons/shield.svg', 
    // iconAlt: 'Shield icon'
  },
];


export default function FAQPage() {
    return (
        <>
            <HeaderUpGetbonus />
            <Header /> 

            {/* Simulating the main page layout (SlideBar + Content) */}
            <div className={styles.faqWrapper}>
                
                <SlideBar /> 
                
                <main className={styles.faqContent}>
                    
                    <h1 className={styles.pageTitle}>Questions & Answers</h1>

                    <Accordion items={faqData} />
                
                </main>
             </div>

             <Chat />
             <Footer />
        </>
    );
}