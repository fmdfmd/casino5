'use client';
import { Modal, Stack, Box, Title, Text, Flex } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { WarningCircle, SignOut } from '@phosphor-icons/react';
import styles from './LogoutModal.module.scss';

interface LogoutModalProps {
    opened: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export default function LogoutModal({ opened, onClose, onConfirm }: LogoutModalProps) {
    const THEME_BLUE = '#0a1124'; // Твой темно-синий цвет
    const isMobile = useMediaQuery('(max-width: 480px)');

    return (
        <Modal 
            opened={opened} 
            onClose={onClose} 
            centered 
            withCloseButton={false}
            padding={0}
            radius="xl"
            // На мобилках модалка будет занимать почти всю ширину
            size={isMobile ? '90%' : '420px'} 
            overlayProps={{
                backgroundOpacity: 0.8,
                blur: 10,
            }}
            styles={{
                root: {
                    '--modal-bg': THEME_BLUE,
                },
                content: { 
                    backgroundColor: THEME_BLUE, 
                    backgroundImage: 'none',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    boxShadow: '0 40px 100px rgba(0, 0, 0, 0.8)',
                    overflow: 'hidden',
                    color: '#fff'
                },
                body: {
                    backgroundColor: THEME_BLUE,
                    // Динамический падинг: 25px на мобилке, 40px на десктопе
                    padding: isMobile ? '30px 20px' : '40px',
                }
            }}
        >
            <Stack align="center" gap={isMobile ? 'lg' : 'xl'}>
                {/* Иконка */}
                <Box className={styles.iconContainer}>
                    <div className={styles.redGlow} />
                    <WarningCircle 
                        size={isMobile ? 54 : 64} 
                        weight="duotone" 
                        color="#ef4444" 
                        style={{ zIndex: 2 }} 
                    />
                </Box>

                <Stack gap={8} align="center">
                    <Title order={2} className={styles.modalTitle}>
                        Confirm Logout
                    </Title>
                    <Text className={styles.modalText}>
                        Are you sure you want to end your current administrative session?
                    </Text>
                </Stack>
                
                {/* Flex вместо Group для удобного перестроения в колонку */}
                <Flex 
                    direction={isMobile ? 'column-reverse' : 'row'} 
                    gap="md" 
                    w="100%" 
                    mt="md"
                >
                    <button 
                        className={styles.btnCancel}
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button 
                        className={styles.btnLogout}
                        onClick={onConfirm}
                    >
                        <SignOut size={20} weight="bold" />
                        Logout
                    </button>
                </Flex>
            </Stack>
        </Modal>
    );
}