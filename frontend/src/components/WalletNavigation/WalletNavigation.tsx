'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import styles from './WalletNavigation.module.scss';

const navLinks = [
    { name: 'My account', href: '/account' },
    { name: 'Withdraw', href: '/account/withdraw' },
    { name: 'Transactions history', href: '/account/history' },
];

export default function WalletNavigation() {
    const pathname = usePathname();

    return (
        <nav className={styles.navContainer}>
            {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                    <Link 
                        key={link.href} 
                        href={link.href} 
                        className={clsx(styles.navLink, isActive && styles.active)}
                    >
                        {link.name}
                    </Link>
                );
            })}
        </nav>
    );
}