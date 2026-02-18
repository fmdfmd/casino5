'use client';
import { useState } from 'react';
import { 
    Stack, Paper, Text, Group, Button, 
    Grid, Box, Flex, TextInput, 
    Badge, Avatar, Divider, PasswordInput, 
    SimpleGrid, Title, Modal 
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { 
    ShieldCheck, 
    Lock, 
    Envelope, 
    Key, 
    SignOut,
    Check,
    IdentificationCard,
    WarningCircle
} from '@phosphor-icons/react';
import styles from './Profile.module.scss';

export default function ProfilePage() {
    // Состояние модального окна выхода
    const [logoutModalOpened, { open: openLogout, close: closeLogout }] = useDisclosure(false);

    // Состояние данных пользователя
    const [profile, setProfile] = useState({
        name: 'Alexander Admin',
        email: 'admin@winvibe.com',
        role: 'Main Admin',
        joined: '12.01.2024'
    });

    // Состояние формы пароля
    const [showPassForm, setShowPassForm] = useState(false);
    const [passwords, setPasswords] = useState({ old: '', new: '', confirm: '' });

    // Список разрешений администратора
    const permissions = [
        'Dashboards', 
        'Players', 
        'Games', 
        'Transactions', 
        'Risk Management', 
        'Role Management', 
        'Analytics'
    ];

    const handleUpdateProfile = () => {
        alert('Данные профиля обновлены локально');
    };

    const handlePasswordChange = () => {
        if (!passwords.new || passwords.new !== passwords.confirm) {
            alert('Пароли не совпадают!');
            return;
        }
        alert('Пароль успешно изменен!');
        setShowPassForm(false);
        setPasswords({ old: '', new: '', confirm: '' });
    };

    // Твой основной глубокий синий цвет
    const DEEP_BLUE = '#0a1124';

    return (
        <Box className={styles.pageWrapper} p={{ base: 'md', lg: 'xl' }}>
            
            {/* МОДАЛЬНОЕ ОКНО ВЫХОДА */}
            <Modal 
                opened={logoutModalOpened} 
                onClose={closeLogout} 
                centered 
                withCloseButton={false}
                padding={0}
                radius="lg"
                overlayProps={{
                    backgroundOpacity: 0.7,
                    blur: 10,
                }}
                styles={{
                    content: {
                        backgroundColor: DEEP_BLUE,
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        boxShadow: '0 30px 60px rgba(0, 0, 0, 0.8)',
                        overflow: 'hidden'
                    },
                    body: {
                        backgroundColor: DEEP_BLUE,
                        padding: '40px'
                    }
                }}
            >
                <Stack align="center" gap="xl">
                    <Box className={styles.warningIconWrapper}>
                        <div className={styles.redGlow} />
                        <WarningCircle size={64} weight="duotone" color="#ef4444" style={{ zIndex: 2 }} />
                    </Box>

                    <Stack gap={8} align="center">
                        <Title order={2} c="white" fz="24px" fw={800}>Confirm Logout</Title>
                        <Text c="dimmed" ta="center" fz="sm" maw={280}>
                            Are you sure you want to log out? Your current administrative session will be ended.
                        </Text>
                    </Stack>
                    
                    <Group grow w="100%" gap="md" mt="md">
                        <Button 
                            variant="subtle" 
                            color="gray" 
                            h={50} 
                            radius="md" 
                            onClick={closeLogout} 
                            fw={700}
                        >
                            Cancel
                        </Button>
                        <Button 
                            color="red" 
                            h={50} 
                            radius="md" 
                            onClick={() => window.location.href = '/login'} 
                            fw={700}
                        >
                            Logout
                        </Button>
                    </Group>
                </Stack>
            </Modal>

            <Grid gutter="xl">
                
                {/* ЛЕВАЯ КОЛОНКА */}
                <Grid.Col span={{ base: 12, md: 4, lg: 3.5 }}>
                    <Stack gap="md">
                        <Paper className={styles.profileCard} p="xl" radius="lg">
                            <Stack align="center" gap="sm">
                                <Box className={styles.avatarWrapper}>
                                    <Avatar 
                                        src="/assets/images/admin-panel.jpg" 
                                        size={120} 
                                        radius={100} 
                                        className={styles.avatar} 
                                    />
                                    <div className={styles.onlineBadge} />
                                </Box>
                                <Stack gap={4} align="center">
                                    <Title order={2} fz="xl" fw={900} c="white">{profile.name}</Title>
                                    <Text fz="xs" c="blue.2" fw={700} tt="uppercase" lts="1px">Administrator</Text>
                                </Stack>
                                <Badge size="lg" variant="gradient" gradient={{ from: 'blue', to: 'cyan' }} radius="sm" px="xl">
                                    {profile.role}
                                </Badge>
                                <Divider w="100%" opacity={0.05} my="md" />
                                <Group justify="space-between" w="100%">
                                    <Text fz="xs" c="dimmed" fw={700}>REGISTERED</Text>
                                    <Text fz="xs" c="white" fw={800}>{profile.joined}</Text>
                                </Group>
                            </Stack>
                        </Paper>

                        <Paper className={styles.card} p="lg" radius="lg">
                            <Group gap="xs" mb="md">
                                <ShieldCheck size={20} color="#3b82f6" weight="fill" />
                                <Text fz="sm" fw={800} c="white" tt="uppercase" lts="0.5px">Access Permissions</Text>
                            </Group>
                            <Flex wrap="wrap" gap={8}>
                                {permissions.map(p => (
                                    <Badge key={p} variant="light" color="gray" size="sm" className={styles.permBadge}>
                                        {p}
                                    </Badge>
                                ))}
                            </Flex>
                        </Paper>
                    </Stack>
                </Grid.Col>

                {/* ПРАВАЯ КОЛОНКА */}
                <Grid.Col span={{ base: 12, md: 8, lg: 8.5 }}>
                    <Stack gap="md">
                        <Paper className={styles.card} p="xl" radius="lg">
                            <Group gap="sm" mb="xl">
                                <IdentificationCard size={24} color="#3b82f6" weight="duotone" />
                                <Title order={3} c="white" fz="lg">General Information</Title>
                            </Group>
                            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
                                <TextInput 
                                    label="Display Name" 
                                    value={profile.name} 
                                    onChange={(e) => setProfile({...profile, name: e.target.value})} 
                                    className={styles.input} 
                                />
                                <TextInput 
                                    label="Admin Email" 
                                    value={profile.email} 
                                    onChange={(e) => setProfile({...profile, email: e.target.value})} 
                                    leftSection={<Envelope size={16} />} 
                                    className={styles.input} 
                                />
                            </SimpleGrid>
                            <Button mt="xl" color="blue" radius="md" h={44} onClick={handleUpdateProfile}>
                                Save Profile Changes
                            </Button>
                        </Paper>

                        <Paper className={styles.card} p="xl" radius="lg">
                            <Group justify="space-between" mb={showPassForm ? "xl" : 0}>
                                <Group gap="sm">
                                    <Lock size={24} color="#f59e0b" weight="duotone" />
                                    <Title order={3} c="white" fz="lg">Password Settings</Title>
                                </Group>
                                {!showPassForm && (
                                    <Button 
                                        variant="light" 
                                        color="orange" 
                                        size="xs" 
                                        onClick={() => setShowPassForm(true)} 
                                        leftSection={<Key size={14} />}
                                    >
                                        Change Password
                                    </Button>
                                )}
                            </Group>

                            {showPassForm && (
                                <Box className={styles.passwordArea}>
                                    <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
                                        <PasswordInput 
                                            label="Old Password" 
                                            placeholder="••••" 
                                            value={passwords.old} 
                                            onChange={(e) => setPasswords({...passwords, old: e.target.value})} 
                                            className={styles.input} 
                                        />
                                        <PasswordInput 
                                            label="New Password" 
                                            placeholder="••••" 
                                            value={passwords.new} 
                                            onChange={(e) => setPasswords({...passwords, new: e.target.value})} 
                                            className={styles.input} 
                                        />
                                        <PasswordInput 
                                            label="Confirm New" 
                                            placeholder="••••" 
                                            value={passwords.confirm} 
                                            onChange={(e) => setPasswords({...passwords, confirm: e.target.value})} 
                                            className={styles.input} 
                                        />
                                    </SimpleGrid>
                                    <Group mt="xl">
                                        <Button color="green" radius="md" size="sm" onClick={handlePasswordChange}>
                                            Update Credentials
                                        </Button>
                                        <Button variant="subtle" color="gray" size="sm" onClick={() => setShowPassForm(false)}>
                                            Cancel
                                        </Button>
                                    </Group>
                                </Box>
                            )}
                            {!showPassForm && (
                                <Text fz="sm" c="dimmed" mt="xs">Your account uses an encrypted administrative password.</Text>
                            )}
                        </Paper>

                        {/* Danger Zone */}
                        <Paper className={styles.dangerZoneCard} p="xl" radius="lg">
                            <Flex justify="space-between" align="center" direction={{ base: 'column', sm: 'row' }} gap="md">
                                <Box>
                                    <Text fz="md" fw={800} c="white">Administrative Session</Text>
                                    <Text fz="xs" c="white" opacity={0.7}>Securely end your current session and exit the panel.</Text>
                                </Box>
                                <Button 
                                    color="red" 
                                    radius="md"
                                    h={44}
                                    px="xl"
                                    onClick={openLogout}
                                    className={styles.logoutButtonFinal}
                                    leftSection={<SignOut size={18} weight="bold" />}
                                >
                                    Logout
                                </Button>
                            </Flex>
                        </Paper>
                    </Stack>
                </Grid.Col>
            </Grid>
        </Box>
    );
}