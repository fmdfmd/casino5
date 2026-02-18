'use client';

import { useState } from 'react';
import { 
    Stack, Paper, Text, Group, Button, 
    Box, Badge, Divider, Title, 
    Table, ScrollArea, Avatar, ActionIcon,
    TextInput, Tooltip, SimpleGrid, Modal, PasswordInput, 
    Flex
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { 
    ShieldCheck, 
    ShieldWarning,
    UserGear, 
    Lock, 
    SignOut, 
    MagnifyingGlass,
    ListBullets,
    SealCheck, 
    LockKey,
    Warning,
    Prohibit,
    CheckCircle,
    ArrowRight
} from '@phosphor-icons/react';
import styles from './Safety.module.scss';

interface AdminUser {
    id: number;
    name: string;
    role: 'Owner' | 'Admin' | 'Moderator';
    email: string;
    twoFA: boolean;
    lastLogin: string;
    ip: string;
    status: 'online' | 'offline';
    isBlocked: boolean;
}

export default function AdminSafetyPage() {
    const [opened, { open, close }] = useDisclosure(false);
    const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
    const [newPassword, setNewPassword] = useState('');

    const [adminUsers, setAdminUsers] = useState<AdminUser[]>([
        { id: 1, name: 'Alexander (Owner)', role: 'Owner', email: 'admin@winvibe.com', twoFA: true, lastLogin: 'Active now', ip: '185.12.44.1', status: 'online', isBlocked: false },
        { id: 2, name: 'Dmitry Analyst', role: 'Admin', email: 'dima@winvibe.com', twoFA: false, lastLogin: '2h ago', ip: '92.110.12.5', status: 'online', isBlocked: false },
        { id: 3, name: 'Sarah Support', role: 'Moderator', email: 'sarah@winvibe.com', twoFA: true, lastLogin: 'Yesterday', ip: '45.12.190.2', status: 'offline', isBlocked: true },
    ]);

    const toggleBlock = (id: number) => {
        setAdminUsers(prev => prev.map(user => 
            user.id === id ? { ...user, isBlocked: !user.isBlocked } : user
        ));
    };

    const openPasswordModal = (user: AdminUser) => {
        setSelectedUser(user);
        setNewPassword('');
        open();
    };

    return (
        <Box className={styles.pageWrapper} p={{ base: 'md', lg: 'xl' }}>
            
            {/* МОДАЛЬНОЕ ОКНО СМЕНЫ ПАРОЛЯ */}
            <Modal 
                opened={opened} 
                onClose={close} 
                title={<Text fw={900} fz="lg">Security Update</Text>}
                centered
                radius="lg"
                padding="xl"
                styles={{ 
                    content: { backgroundColor: '#1e293b', color: '#fff' }, 
                    header: { backgroundColor: '#1e293b', color: '#fff' },
                    close: { color: '#fff' }
                }}
            >
                <Stack gap="lg">
                    <Box>
                        <Text fz="sm" c="dimmed">Change password for administrator:</Text>
                        <Text fw={800} c="blue.4" fz="md">{selectedUser?.name}</Text>
                    </Box>
                    <PasswordInput 
                        label="Enter New Password" 
                        placeholder="••••••••" 
                        className={styles.customInput}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <Group grow mt="md">
                        <Button variant="subtle" color="gray" onClick={close} h={44}>Cancel</Button>
                        <Button color="blue" h={44} radius="md" onClick={close}>Update Password</Button>
                    </Group>
                </Stack>
            </Modal>

            <Stack gap="xl">
                {/* HEADER */}
                <Flex justify="space-between" align={{ base: 'flex-start', sm: 'center' }} direction={{ base: 'column', sm: 'row' }} gap="md">
                    <Box>
                        <Title order={1} c="white" fz={{ base: '26px', md: '32px' }} fw={900}>Safety & Access</Title>
                        <Text c="dimmed" fz="sm" fw={500}>System monitoring and administrative control panel</Text>
                    </Box>
                    <Button variant="filled" color="blue" radius="md" h={44} leftSection={<LockKey size={20}/>}>
                        Security Audit
                    </Button>
                </Flex>

                {/* STATS - RESPONSIVE GRID */}
                <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="lg">
                    <StatBox label="Admins" value={adminUsers.length} icon={<UserGear size={32} color="#3b82f6" weight="duotone" />} />
                    <StatBox label="Protected" value="2 / 3" icon={<ShieldCheck size={32} color="#10b981" weight="duotone" />} />
                    <StatBox label="Blocked" value={adminUsers.filter(u => u.isBlocked).length} icon={<ShieldWarning size={32} color="#ef4444" weight="duotone" />} />
                </SimpleGrid>

                {/* MAIN TABLE SECTION */}
                <Paper className={styles.card} p="xl">
                    <Group justify="space-between" mb="xl" wrap="wrap" gap="md">
                        <Title order={4} c="white" fz="lg">Administrator Management</Title>
                        <TextInput 
                            placeholder="Find by name or email..." 
                            className={styles.customInput}
                            leftSection={<MagnifyingGlass size={16} color="#3b82f6" />}
                            w={{ base: '100%', sm: 300 }}
                        />
                    </Group>

                    <ScrollArea scrollbars="x" type="hover">
                        <Table verticalSpacing="md" minWidth={900}>
                            <Table.Thead className={styles.tableHeader}>
                                <Table.Tr>
                                    <Table.Th>User Profile</Table.Th>
                                    <Table.Th>Role</Table.Th>
                                    <Table.Th>2FA Protection</Table.Th>
                                    <Table.Th>Last Login</Table.Th>
                                    <Table.Th textAlign="right">Actions</Table.Th>
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                                {adminUsers.map((user) => (
                                    <Table.Tr key={user.id} className={styles.userRow} data-blocked={user.isBlocked}>
                                        <Table.Td>
                                            <Group gap="md">
                                                <Box pos="relative">
                                                    <Avatar radius="md" color="blue" size="md" fw={700}>{user.name[0]}</Avatar>
                                                    {user.status === 'online' && <Box className={styles.statusOnline} pos="absolute" bottom={-3} right={-3} />}
                                                </Box>
                                                <Box>
                                                    <Text fw={800} fz="sm" c="white" className={styles.userName}>{user.name}</Text>
                                                    <Text fz="xs" c="dimmed" fw={500}>{user.email}</Text>
                                                </Box>
                                            </Group>
                                        </Table.Td>
                                        <Table.Td>
                                            <Badge variant="light" radius="sm" color={user.role === 'Owner' ? 'red' : 'blue'}>{user.role}</Badge>
                                        </Table.Td>
                                        <Table.Td>
                                            {user.twoFA ? (
                                                <Group gap={6} c="green.4"><SealCheck size={18} weight="fill"/><Text fz="xs" fw={800}>Secured</Text></Group>
                                            ) : (
                                                <Group gap={6} c="red.4"><Warning size={18} weight="bold" /><Text fz="xs" fw={800}>Vulnerable</Text></Group>
                                            )}
                                        </Table.Td>
                                        <Table.Td>
                                            <Stack gap={2}>
                                                <Text fz="xs" c="white" fw={700}>{user.lastLogin}</Text>
                                                <Text fz="xs" c="dimmed">{user.ip}</Text>
                                            </Stack>
                                        </Table.Td>
                                        <Table.Td>
                                            <Group gap="sm" justify="flex-end">
                                                <Tooltip label="Set New Password">
                                                    <ActionIcon variant="light" color="blue" size="lg" radius="md" onClick={() => openPasswordModal(user)}>
                                                        <Lock size={18}/>
                                                    </ActionIcon>
                                                </Tooltip>
                                                
                                                <Tooltip label={user.isBlocked ? "Unlock Access" : "Restrict Access"}>
                                                    <ActionIcon variant="light" color={user.isBlocked ? "green" : "red"} size="lg" radius="md" onClick={() => toggleBlock(user.id)}>
                                                        {user.isBlocked ? <CheckCircle size={18} weight="fill"/> : <Prohibit size={18}/>}
                                                    </ActionIcon>
                                                </Tooltip>

                                                <ActionIcon variant="subtle" color="gray" size="lg">
                                                    <SignOut size={18}/>
                                                </ActionIcon>
                                            </Group>
                                        </Table.Td>
                                    </Table.Tr>
                                ))}
                            </Table.Tbody>
                        </Table>
                    </ScrollArea>
                </Paper>

                {/* LOG SECTION */}
                <Box>
                    <Group mb="md" gap="xs">
                        <ListBullets size={22} color="#3b82f6" weight="bold" />
                        <Title order={4} c="white">Live Audit History</Title>
                    </Group>
                    <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
                        <AuditItem 
                            badge="Security" 
                            color="red" 
                            text="User Sarah Support was restricted by Alexander" 
                            time="12 min ago" 
                        />
                        <AuditItem 
                            badge="Action" 
                            color="blue" 
                            text="Dmitry Analyst updated affiliate commission" 
                            time="45 min ago" 
                        />
                    </SimpleGrid>
                </Box>
            </Stack>
        </Box>
    );
}

// Вспомогательные компоненты
function StatBox({ label, value, icon }: any) {
    return (
        <Paper className={styles.card} p="xl">
            <Group justify="space-between">
                <Box>
                    <Text fz="xs" c="dimmed" fw={800} tt="uppercase" lts="1px" mb={4}>{label}</Text>
                    <Title order={2} c="white" fz="28px">{value}</Title>
                </Box>
                <Box className={styles.statIconWrapper}>{icon}</Box>
            </Group>
        </Paper>
    );
}

function AuditItem({ badge, color, text, time }: any) {
    return (
        <Box className={styles.auditItem}>
            <Group justify="space-between" mb={8}>
                <Badge color={color} variant="filled" size="xs">{badge}</Badge>
                <Text c="dimmed" fz="11px" fw={700}>{time}</Text>
            </Group>
            <Text fz="sm" fw={600} c="white" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {text} <ArrowRight size={14} color="#3b82f6" />
            </Text>
        </Box>
    );
}