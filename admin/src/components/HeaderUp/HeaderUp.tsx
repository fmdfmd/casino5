'use client';
import React, { useState, useEffect } from 'react';
import { Text, Box, Breadcrumbs, Anchor, Stack, Burger, Flex, Title, Divider, Avatar, Popover, ActionIcon, Indicator } from '@mantine/core';
import styles from './HeaderUp.module.scss';
import { usePathname } from 'next/navigation';
import { House, Clock, Bell } from '@phosphor-icons/react';
import dayjs from 'dayjs';
import Link from 'next/link';
import NotificationsList from '../Notifications/Notifications'; // Импортируем твой компонент

interface HeaderUpProps {
    onBurgerClick: () => void;
    mobileOpened: boolean;
}

const HeaderUp: React.FC<HeaderUpProps> = ({ onBurgerClick, mobileOpened }) => {
    const pathname = usePathname();
    const [currentTime, setCurrentTime] = useState(dayjs());
    const [notifOpened, setNotifOpened] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(dayjs()), 1000);
        return () => clearInterval(timer);
    }, []);
    
    const currentName = pathname.split('/').pop() || 'Dashboard';
    const formattedTitle = currentName === '' ? 'Dashboard' : currentName
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

	return (
		<Box component="header" className={styles.header}>
            <Flex align="center" justify="space-between" h="100%" w="100%">
                
                {/* ЛЕВАЯ ЧАСТЬ */}
                <Flex align="center" gap={{ base: 'md', sm: 'xl' }}>
                    <Burger 
                        opened={mobileOpened} 
                        onClick={onBurgerClick} 
                        hiddenFrom="md" 
                        size="sm" 
                        color="white" 
                    />
                    
                    <Stack gap={4}>
                        <Box visibleFrom="sm">
                            <Breadcrumbs separator="/" className={styles.breadcrumbs}>
                                <Anchor component={Link} href="/" className={styles.breadcrumbLink}>
                                    <House size={14} weight="fill" style={{ marginBottom: -2, marginRight: 4 }} />
                                    Home
                                </Anchor>
                                <Text className={styles.currentPath}>{formattedTitle}</Text>
                            </Breadcrumbs>
                        </Box>
                        <Title order={1} className={styles.title}>{formattedTitle}</Title>
                    </Stack>
                </Flex>
                
                {/* ПРАВАЯ ЧАСТЬ */}
                <Flex align="center" gap={{ base: 'xs', sm: 'md' }}>
                    
                    {/* УВЕДОМЛЕНИЯ: ОТОБРАЖАЮТСЯ ТОЛЬКО НА МОБИЛЕ (hiddenFrom="md") */}
                    <Box hiddenFrom="md">
                        <Popover 
                            opened={notifOpened} 
                            onChange={setNotifOpened} 
                            position="bottom-end" 
                            offset={10}
                            withArrow 
                            shadow="xl"
                            styles={{ dropdown: { padding: 0, border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden', backgroundColor: '#1a2544' }}}
                        >
                            <Popover.Target>
                                <Indicator color="red" offset={2} size={8} processing withBorder>
                                    <ActionIcon 
                                        variant="subtle" 
                                        color="gray.0" 
                                        size="lg" 
                                        onClick={() => setNotifOpened((o) => !o)}
                                    >
                                        <Bell size={24} weight="duotone" />
                                    </ActionIcon>
                                </Indicator>
                            </Popover.Target>
                            <Popover.Dropdown>
                                <NotificationsList />
                            </Popover.Dropdown>
                        </Popover>
                    </Box>

                    {/* Время */}
                    <Box className={styles.dateTime}>
                        <Flex align="center" gap={{ base: 6, sm: 12 }}>
                            <Clock size={20} color="#4dabf7" weight="duotone" className={styles.clockIcon} />
                            <Stack gap={0}>
                                <Text fz={{ base: 'xs', sm: 'sm' }} c="white" fw={800} ff="monospace">
                                    {currentTime.format('HH:mm:ss')}
                                </Text>
                                <Text fz={10} c="dimmed" fw={600} visibleFrom="md">
                                    {currentTime.format('DD MMMM YYYY')}
                                </Text>
                            </Stack>
                        </Flex>
                    </Box>

                    {/* Аватар: ТОЛЬКО НА МОБИЛЕ */}
                    <Box hiddenFrom="md">
                        <Anchor component={Link} href="/profile" style={{ display: 'flex' }}>
                            <Avatar size="sm" radius="md" src="/assets/images/admin-panel.jpg" className={styles.avatar} />
                        </Anchor>
                    </Box>
                </Flex>
                
            </Flex>
		</Box>
	);
};

export default HeaderUp;