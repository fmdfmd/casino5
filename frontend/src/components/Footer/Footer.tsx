'use client';

import Link from 'next/link';
import Image from 'next/image';
import clsx from 'clsx';
import styles from './Footer.module.scss';
import LanguageSelector from '../LanguageSelector/LanguageSelector';

const CURRENCIES = [
     { id: 1, src: '/btc.svg', alt: 'btc', size: '84100.00$' },
     { id: 2, src: '/crupto2.svg', alt: 'eth', size: '1893.62$'},
     { id: 3, src: '/doge.svg', alt: 'doge', size: '94.45$' },
     { id: 4, src: '/litcone.svg', alt: 'ltc', size: '0.23$' },
]; 

const NAV_MAIN = [
    { label: 'Home', href: '/' },
    { label: 'Bonus', href: '' },
    { label: 'Live games', href: '' },
];

const NAV_SECONDARY = [
    { label: 'Slots', href: '' },
    { label: 'Live casino', href: '' },
    { label: 'Tournaments', href: '' },
    { label: 'Bonuses', href: '' },
    { label: 'Loyalty', href: '' },
    { label: 'News', href: '' },
    { label: 'Questions & Answers', href: '' },
    { label: 'Support', href: '' },
];

const SOCIALS = [
    { id: 1, href: '', src: '/google.svg', alt: 'google' },
    { id: 2, href: '', src: '/twitter.svg', alt: 'twitter' },
    { id: 3, href: '', src: '/fasebook.svg', alt: 'facebook' },
];

const Footer = () => {
    return (
        <footer className={styles.footer}>
            <div className={clsx(styles.footer__wrapper, styles.container)}>
                
                {/* ЛЕВАЯ ЧАСТЬ */}
                <div className={styles['footer__wrapper-left']}>
                    
                    {/* Лого + Копирайт (ЕДИНСТВЕННЫЙ) */}
                    <div className={styles['footer__wrapper-logoBlock']}>
                        <Link href='/' className={styles['footer__wrapper-inner']}>
                            <Image
                                className={styles['footer__wrapper-innerLogo']}
                                src="/footer__logo.svg"
                                alt='winvube_logo'
                                width={100}
                                height={108}
                                priority
                            />
                        </Link>
                    </div>

                    {/* Список валют */}
                    <div className={styles['footer__wrapper-innerСurrencyList']}>
                        {CURRENCIES.map((item, index) => (
                            <div key={index} className={styles['footer__wrapper-innerСurrencyItem']}>
                                <Image
                                   className={styles['footer__wrapper-innerСurrencyItemCrupto']}
                                   src={item.src}
                                    alt={item.alt}
                                    width={34}
                                    height={34}
                                    priority
                                />
                                <span className={styles['footer__wrapper-innerСurrencyItemName']}>{item.size}</span>
                            </div>
                        ))}
                    </div>

                    {/* Кнопка входа и Язык */}
                    <div className={styles['footer__wrapper-innerLoginandTranslat']}>
                        <button className={styles['footer__wrapper-innerLogin']}>
                            <Link className={styles['footer__wrapper-innerLoginText']} href="">Log in/</Link>
                            <Link className={styles['footer__wrapper-innerLoginText']} href="">Sign up</Link>
                        </button>
                        
                        <div className={styles['footer__wrapper-langContainer']}>
                            <LanguageSelector />
                        </div>
                    </div>
                </div>

                {/* ПРАВАЯ ЧАСТЬ */}
                <div className={styles['footer__wrapper-right']}>
                    
                    <div className={styles['footer__wrapper-linksContainer']}>
                        <div className={styles['footer__wrapper-rightPathnameList']}>
                            {NAV_MAIN.map((link, index) => (
                                <Link key={index} href={link.href} className={styles['footer__wrapper-rightPathnameItem']}>
                                    {link.label}
                                </Link>
                            ))}
                        </div>

                        <div className={styles['footer__wrapper-rightPathnameList']}>
                            {NAV_SECONDARY.map((link, index) => (
                                <Link key={index} href={link.href} className={styles['footer__wrapper-rightPathnameItem']}>
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className={styles['footer__wrapper-rightPathnameListSocials']}>
                        {SOCIALS.map((social) => (
                            <Link key={social.id} href={social.href}>
                                <Image
                                    className={styles['footer__wrapper-socialIcon']}
                                    src={social.src}
                                    alt={social.alt}
                                    width={50} 
                                    height={50}
                                    priority
                                />
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;