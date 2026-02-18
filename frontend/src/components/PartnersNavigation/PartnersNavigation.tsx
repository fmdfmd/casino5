'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './PartnersNavigation.module.scss';

const navLinks = [
    { name: 'Review', href: '/partners' },
    { name: 'Campaign', href: '/partners/campaign' },
    { name: 'Referrals', href: '/partners/referrals' },
    { name: 'FAQ', href: '/partners/faq' },
];

export default function PartnersNavigation() {
    const pathname = usePathname();

    return (
        <div className={styles.navContainer}>
            <nav className={styles.topNav}>
                {navLinks.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                        <Link 
                            key={link.href} 
                            href={link.href} 
                            className={isActive ? styles.active : ''}
                        >
                            <button className={isActive ? styles.active : ''}>
                                {link.name}
                            </button>
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}