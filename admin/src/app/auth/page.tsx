'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

import {
	Paper,
	TextInput,
	PasswordInput,
	Button,
	Title,
	Text,
	Stack,
	Box,
	Center,
	Group,
	ActionIcon,
	Anchor,
	Loader,
} from '@mantine/core';

import {
	Envelope,
	Lock,
	ArrowLeft,
	ShieldCheck,
	UserPlus,
	SignIn,
	ClockCounterClockwise,
	CheckCircle,
} from '@phosphor-icons/react';
import { useForm } from '@mantine/form';

import styles from './Auth.module.scss';
import axios from 'axios';
import { api } from '@/shared/lib/api/axios';

// Типы состояний страницы
type AuthMode = 'login' | 'register' | 'pending';

export default function AuthPage() {
	const [mode, setMode] = useState<AuthMode>('login');
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	const form = useForm({
		initialValues: { email: 'ismo1@gmail.com', password: 'ismo1234' },
		validate: {
			email: (v) =>
				/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? null : 'Некорректный email',
			password: (v) =>
				/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,64}$/.test(v)
					? null
					: 'Минимум 8 символов, буквы и цифры',
		},
	});

	const handleSubmit = async ({
		password,
		email,
	}: {
		password: string;
		email: string;
	}) => {
		// setLoading(true);

		const res = await api.post(
			'auth/login',
			{
				email,
				password,
			},
			{ withCredentials: true },
		);

		if (res.data) {
			router.push('/');
		}
	};

	return (
		<Center className={styles.wrapper}>
			<Box className={styles.inner}>
				{/* Декоративное свечение на фоне */}
				<div className={styles.glow} />

				<Paper className={styles.card} p={{ base: 30, sm: 50 }} radius='xl'>
					{/* ЭКРАН ОЖИДАНИЯ ПРОВЕРКИ АДМИНИСТРАЦИЕЙ */}
					{mode === 'pending' ? (
						<Stack align='center' gap='xl' py='xl'>
							<Box className={styles.iconCircle}>
								<ClockCounterClockwise
									size={54}
									weight='duotone'
									color='#3b82f6'
								/>
							</Box>

							<Stack gap={8} align='center'>
								<Title order={2} c='white' ta='center' fz={28} fw={900}>
									Заявка отправлена
								</Title>
								<Text c='dimmed' ta='center' fz='sm' maw={320}>
									Ваш аккаунт успешно создан. В целях безопасности
									<Text span c='blue.4' fw={700}>
										{' '}
										администрация WinVibe{' '}
									</Text>
									должна подтвердить вашу личность перед предоставлением
									доступа.
								</Text>
							</Stack>

							<Paper className={styles.infoBox} p='md' radius='md' w='100%'>
								<Group gap='sm' wrap='nowrap'>
									<ShieldCheck size={20} color='#22c55e' />
									<Text fz='xs' c='gray.4' fw={500}>
										Вы получите уведомление на почту, когда доступ будет открыт.
									</Text>
								</Group>
							</Paper>

							<Button
								variant='light'
								color='gray'
								fullWidth
								radius='md'
								size='md'
								onClick={() => setMode('login')}
								leftSection={<ArrowLeft size={18} />}
							>
								Вернуться ко входу
							</Button>
						</Stack>
					) : (
						/* ФОРМЫ ЛОГИНА И РЕГИСТРАЦИИ */
						<>
							<Stack gap='xs' mb={30} align='center'>
								<Title order={2} c='white' fz={32} fw={900}>
									{mode === 'login' ? 'Welcome Back' : 'Create Account'}
								</Title>
								<Text c='dimmed' fz='sm'>
									{mode === 'login'
										? 'Access the administrative control panel'
										: 'Register for administrative access'}
								</Text>
							</Stack>

							<form onSubmit={form.onSubmit(handleSubmit)}>
								<Stack gap='md'>
									<TextInput
										required
										label='Email Address'
										placeholder='admin@winvibe.com'
										leftSection={<Envelope size={18} weight='duotone' />}
										className={styles.input}
										key={form.key('email')}
										{...form.getInputProps('email')}
										size='md'
									/>
									<PasswordInput
										required
										label='Password'
										placeholder='••••••••'
										leftSection={<Lock size={18} weight='duotone' />}
										className={styles.input}
										key={form.key('password')}
										{...form.getInputProps('password')}
										size='md'
									/>

									<Button
										type='submit'
										color='blue'
										size='lg'
										radius='md'
										fullWidth
										mt='md'
										loading={loading}
										loaderProps={{ type: 'dots' }}
										leftSection={
											mode === 'login' ? (
												<SignIn size={20} />
											) : (
												<UserPlus size={20} />
											)
										}
									>
										{mode === 'login' ? 'Sign In' : 'Request Access'}
									</Button>
								</Stack>
							</form>

							<Group justify='center' mt='xl'>
								<Text c='dimmed' fz='xs'>
									{mode === 'login'
										? "Don't have an account?"
										: 'Already have an account?'}
								</Text>
								<Anchor
									fz='xs'
									fw={700}
									onClick={() =>
										setMode(mode === 'login' ? 'register' : 'login')
									}
								>
									{mode === 'login' ? 'Create Account' : 'Log In'}
								</Anchor>
							</Group>
						</>
					)}
				</Paper>

				{/* Footer */}
				<Text ta='center' c='dimmed' fz='xs' mt='xl' opacity={0.5}>
					© 2026 WinVibe Security Systems. All rights reserved.
				</Text>
			</Box>
		</Center>
	);
}
