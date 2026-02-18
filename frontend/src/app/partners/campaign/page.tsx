'use client';

import HeaderUpGetbonus from '@/components/HeaderUp/HeaderUpGetbonus';
import Header from '@/components/Header/Header';
import SlideBar from '@/components/SlideBar/SlideBar';
import Footer from '@/components/Footer/Footer';
import Chat from '@/widgets/chat/ui';
import PartnersNavigation from '@/components/PartnersNavigation/PartnersNavigation'; 
import styles from './page.module.scss';

export default function CampaignPage() {
    return (
        <>
            <HeaderUpGetbonus />
            <Header />
            <div className={styles.wrapper}>
                <SlideBar />
                <main className={styles.mainContent}>
                    
                    {/* Навигация прижата влево */}
                    <div className={styles.navContainer}>
                        <PartnersNavigation />
                    </div>

                    <section className={styles.formContainer}>
                        <h1 className={styles.title}>Become our partner</h1>
                        <p className={styles.subtitle}>
                            Are you interested in becoming a Stake affiliate? Fill out the form below so we can see if you can be a strong partner.
                        </p>

                        <form className={styles.partnerForm}>
                            <div className={styles.formField}>
                                <label>E-mail <span>*</span></label>
                                <input type="email" placeholder="E-mail" />
                            </div>

                            <div className={styles.gridRow}>
                                <div className={styles.formField}>
                                    <label>Name <span>*</span></label>
                                    <input type="text" placeholder="Name" />
                                </div>
                                <div className={styles.formField}>
                                    <label>Last name <span>*</span></label>
                                    <input type="text" placeholder="Last name" />
                                </div>
                            </div>

                            <div className={styles.gridRow}>
                                <div className={styles.formField}>
                                    <label>Traffic source <span>*</span></label>
                                    <select defaultValue="">
                                        <option value="" disabled>Select traffic source</option>
                                        <option value="social">Social Media</option>
                                        <option value="site">Website</option>
                                    </select>
                                </div>
                                <div className={styles.formField}>
                                    <label>Traffic Source URL / Channel Name <span>*</span></label>
                                    <input type="text" placeholder="URL" />
                                </div>
                            </div>

                            <button type="button" className={styles.addSource}>
                                <span>+</span> Add another source
                            </button>

                            <div className={styles.formField}>
                                <label>Target regions <span>*</span></label>
                                <input type="text" />
                            </div>

                            <div className={styles.formField}>
                                <label>Tell us why you would make a great partner <span>*</span></label>
                                <textarea placeholder="Tell us why you believe..."></textarea>
                            </div>

                            {/* Кнопка теперь тоже слева */}
                            <button type="submit" className={styles.submitBtn}>Send</button>
                        </form>
                    </section>
                </main>
            </div>
            <Chat />
            <Footer />
        </>
    );
}