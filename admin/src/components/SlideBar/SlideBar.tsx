'use client';
import { useState } from 'react';
import { Box, Stack, Title, Image, Divider, Text, Flex, Popover } from '@mantine/core';
import styles from './SlideBar.module.scss';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import NotificationsList from '../Notifications/Notifications';

// Стильные иконки Phosphor
import { 
    SquaresFour, 
    Users, 
    GameController, 
    ArrowsLeftRight, 
    Gift, 
    ShieldCheck, 
    Handshake, 
    Coins, 
    ChatCenteredDots, 
    ChartBar, 
    IdentificationBadge, 
    Newspaper, 
    LockKey,
    Bell,
    SignOut,
    List,
    X
} from '@phosphor-icons/react';

const menuItems = [
	{ icon: SquaresFour, name: 'Dashboard', href: '/' },
	{ icon: Users, name: 'Players', href: '/players' },
	{ icon: GameController, name: 'Games', href: '/games' },
	{ icon: ArrowsLeftRight, name: 'Transactions', href: '/transactions' },
	{ icon: Gift, name: 'Bonus', href: '/bonus' },
	{ icon: ShieldCheck, name: 'Risk Management', href: '/risk-management' },
	{ icon: Handshake, name: 'Affiliate Program', href: '/affiliate-program' },
	{ icon: Coins, name: 'Jackpots', href: '/jackpots' },
	{ icon: ChatCenteredDots, name: 'Chat&Support', href: '/chat-support' },
	{ icon: ChartBar, name: 'Analytics', href: '/analytics' },
	{ icon: IdentificationBadge, name: 'Role Management', href: '/role-management' },
	{ icon: Newspaper, name: 'News', href: '/news' },
	{ icon: LockKey, name: 'Safety', href: '/safety' },
];

interface SlideBarProps {
    mobileOpened: boolean;
    isCollapsed: boolean;
    toggleCollapse: () => void;
}

export default function SlideBar({ mobileOpened, isCollapsed, toggleCollapse }: SlideBarProps) {
	const pathname = usePathname();
    const [notifOpened, setNotifOpened] = useState(false);
    const iconSize = 22;

	return (
		<aside className={clsx(
            styles.sidebar, 
            mobileOpened && styles.mobileOpened, 
            isCollapsed && styles.collapsed
        )}>
			<Box p="25px 20px" className={styles.topSection}>
				<Flex justify="space-between" align="center">
					<Title className={styles.logo}>WinVibe<span>★</span></Title>
					<button onClick={toggleCollapse} className={styles.burger}>
                        {mobileOpened ? (
                            <X size={24} weight="bold" />
                        ) : (
                            <List size={24} weight="bold" />
                        )}
					</button>
				</Flex>

				<div className={styles.adminTextContainer}>
					<Flex mt="40px" gap="15px" align="center" wrap="nowrap">
                        <Link href="/profile" className={styles.profileLink}>
                            <Flex gap="15px" align="center" wrap="nowrap">
                                <Image 
                                    w={45} 
                                    h={45} 
                                    src="/assets/images/admin-panel.jpg" 
                                    radius="50%" 
                                    fallbackSrc="https://placehold.co/45x45?text=A" 
                                />
                                <Stack gap={0} flex={1} className={styles.adminInfo}>
                                    <Text fz="16px" fw={600} c="#fff" className={styles.linkText}>Admin Name</Text>
                                    <Text fz="12px" c="#fff" opacity={0.6} className={styles.linkText}>admin@winvibe.com</Text>
                                </Stack>
                            </Flex>
                        </Link>

                        {/* КОЛОКОЛЬЧИК: Виден ТОЛЬКО на десктопе (visibleFrom="md") */}
                        <Box visibleFrom="md">
                            <Popover 
                                opened={notifOpened} 
                                onChange={setNotifOpened} 
                                position="right-start" 
                                offset={25}
                                withArrow 
                                shadow="xl"
                                styles={{ 
                                    dropdown: { 
                                        padding: 0, 
                                        border: '1px solid rgba(255,255,255,0.1)', 
                                        overflow: 'hidden',
                                        backgroundColor: '#1a2544'
                                    } 
                                }}
                            >
                                <Popover.Target>
                                    <button className={styles.notifBtn} onClick={() => setNotifOpened((o) => !o)}>
                                        <Bell size={20} weight="duotone" />
                                    </button>
                                </Popover.Target>
                                <Popover.Dropdown>
                                    <NotificationsList />
                                </Popover.Dropdown>
                            </Popover>
                        </Box>
					</Flex>
					<Divider mt="25px" className={styles.divider} color="rgba(255,255,255,0.1)" />
				</div>
			</Box>

			<div className={styles.scrollArea}>
                <Stack mt="10px" gap="6px" p="10px">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        
                        return (
                            <Link 
                                key={item.href} 
                                href={item.href} 
                                className={clsx(styles.link, isActive && styles.activeLink)}
                            >
                                <Icon 
                                    size={iconSize} 
                                    weight={isActive ? "fill" : "duotone"} 
                                />
                                <Text className={styles.linkText}>{item.name}</Text>
                            </Link>
                        );
                    })}
                </Stack>
            </div>

            <Box mt="auto" p="10px" className={styles.bottomSection}>
                <div className={styles.logoutBtn} style={{cursor: 'pointer'}}>
                    <span className={styles.linkText}><Text fw={700}>Log out</Text></span>
                    <SignOut size={22} weight="bold" />
                </div>
            </Box>
		</aside>
	);
}