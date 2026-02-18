'use client';
import { useState } from 'react';
import { Stack, Text, Group, Box, Badge, ScrollArea, Divider, UnstyledButton, ActionIcon, Transition } from '@mantine/core';
import { Circle, Info, WarningCircle, CheckCircle, X, Trash } from '@phosphor-icons/react';
import styles from './Notifications.module.scss';

const initialNotifications = [
    { id: 1, type: 'info', title: 'New Game: Starburst XXXtreme', desc: 'A new high-volatile slot has been added to the library.', time: '5m ago', read: false },
    { id: 2, type: 'warning', title: 'Security Alert: Failed login', desc: 'Multiple failed login attempts detected from IP 192.168.1.1.', time: '1h ago', read: false },
    { id: 3, type: 'success', title: 'Transaction #9402 Approved', desc: 'Withdrawal request for $500.00 has been successfully processed.', time: 'Yesterday', read: true },
    { id: 4, type: 'info', title: 'Weekly GGR Report Ready', desc: 'The analytics report for the previous week is now available for download.', time: '2 days ago', read: true },
];

export default function NotificationsList() {
    const [notifications, setNotifications] = useState(initialNotifications);

    const deleteNotif = (id: number) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    };

    const clearAll = () => {
        setNotifications([]);
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <Box className={styles.container}>
            <Group justify="space-between" p="md" pb="sm">
                <Stack gap={0}>
                    <Text fw={800} fz="sm" c="white" tt="uppercase" lts="1px">Notifications</Text>
                    {notifications.length > 0 && (
                        <Text fz="10px" c="dimmed" fw={600}>You have {unreadCount} unread messages</Text>
                    )}
                </Stack>
                <Group gap="xs">
                    {notifications.length > 0 && (
                        <ActionIcon variant="subtle" color="gray" size="sm" onClick={clearAll} title="Clear all">
                            <Trash size={16} />
                        </ActionIcon>
                    )}
                    <Badge variant="filled" color="blue" size="sm" radius="sm">
                        {notifications.length}
                    </Badge>
                </Group>
            </Group>

            <Divider color="rgba(255,255,255,0.05)" />

            <ScrollArea.Autosize mah={400} type="scroll" scrollbarSize={4}>
                <Stack gap={0}>
                    {notifications.length > 0 ? (
                        notifications.map((notif) => (
                            <Box key={notif.id} className={styles.itemWrapper}>
                                <UnstyledButton className={styles.item} data-read={notif.read}>
                                    <Group gap="sm" wrap="nowrap" align="flex-start">
                                        <Box className={styles.iconBox} data-type={notif.type}>
                                            {notif.type === 'info' && <Info size={18} weight="duotone" />}
                                            {notif.type === 'warning' && <WarningCircle size={18} weight="duotone" />}
                                            {notif.type === 'success' && <CheckCircle size={18} weight="duotone" />}
                                        </Box>
                                        
                                        <Stack gap={2} flex={1}>
                                            <Text fz="13px" fw={700} c="white" lineClamp={1}>{notif.title}</Text>
                                            <Text fz="11px" c="dimmed" lineClamp={2} fw={500} style={{ lineHeight: 1.4 }}>
                                                {notif.desc}
                                            </Text>
                                            <Text fz="10px" c="dimmed" fw={600} mt={4}>{notif.time}</Text>
                                        </Stack>

                                        <Stack align="center" gap="xs">
                                            {!notif.read && <Circle size={8} weight="fill" color="#0E8BEA" />}
                                            <ActionIcon 
                                                variant="subtle" 
                                                color="gray" 
                                                size="sm" 
                                                className={styles.deleteBtn}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    deleteNotif(notif.id);
                                                }}
                                            >
                                                <X size={14} weight="bold" />
                                            </ActionIcon>
                                        </Stack>
                                    </Group>
                                </UnstyledButton>
                            </Box>
                        ))
                    ) : (
                        <Stack align="center" py="xl" gap="xs">
                            <Text fz="xs" c="dimmed" fw={700} tt="uppercase">No new notifications</Text>
                        </Stack>
                    )}
                </Stack>
            </ScrollArea.Autosize>

            <Divider color="rgba(255,255,255,0.05)" />
            
            <UnstyledButton className={styles.viewAll}>
                <Text fz="xs" fw={800} ta="center" py="md" c="blue.4" tt="uppercase">View all activity</Text>
            </UnstyledButton>
        </Box>
    );
}