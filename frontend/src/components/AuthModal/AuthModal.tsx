'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
	Modal,
	Button,
	TextInput,
	PasswordInput,
	Stack,
	Group,
	SegmentedControl,
	Select,
	Checkbox,
	Title,
	Text,
	ActionIcon,
	Box,
	Alert,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { IconX, IconAlertCircle } from '@tabler/icons-react';
import { useForm } from '@mantine/form';
import { useDispatch } from 'react-redux';

import classes from './AuthModal.module.scss';
import { api, API_URL } from '@/shared/lib/api/axios';
import { loginUser, registerUser } from '@/features/auth/model/authSlice';
import { useAppDispatch } from '@/shared/lib/redux/hooks';

// Define the Mode type matching your Provider
type ProviderMode = 'login' | 'signup';

interface AuthModalProps {
	opened: boolean;
	onClose: () => void;
	// New props to connect with your hook
	currentMode: ProviderMode;
	onSwitchMode: (mode: ProviderMode) => void;
}

type ViewState = 'login' | 'registration' | 'forgot_password';

export default function AuthModal({
	opened,
	onClose,
	currentMode,
	onSwitchMode,
}: AuthModalProps) {
	const [view, setView] = useState<ViewState>(
		currentMode === 'signup' ? 'registration' : 'login',
	);
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const isMobile = useMediaQuery('(max-width: 768px)');
	const dispatch = useAppDispatch();

	// --- SYNC LOGIC START ---
	// Sync internal view when the global mode changes or modal opens
	useEffect(() => {
		if (opened) {
			if (currentMode === 'login' && view !== 'forgot_password') {
				setView('login');
			} else if (currentMode === 'signup') {
				setView('registration');
			}
		}
	}, [currentMode, opened]);
	// --- SYNC LOGIC END ---

	const form = useForm({
		initialValues: {
			email: 'ismo@gmail.com',
			password: 'ismo1234',
			promo: '',
			currency: 'USD',
		},

		validate: {
			email: (val) => (/^\S+@\S+$/.test(val) ? null : 'Invalid email'),
			password: (val) => (val.length < 6 ? 'Password too short' : null),
		},
	});

	const handleSubmit = async () => {
		if (form.validate().hasErrors) return;
		setLoading(true);
		setError(null);

		try {
			if (view === 'login') {
				dispatch(
					loginUser({
						email: form.values.email,
						password: form.values.password,
					}),
				);
			} else if (view === 'registration') {
				dispatch(
					registerUser({
						email: form.values.email,
						password: form.values.password,
					}),
				);
			}

			onClose();
		} catch (err: any) {
			setError(err.response?.data?.message || 'Authentication failed');
		} finally {
			setLoading(false);
		}
	};

	const socialLogin = (provider: string) => {
		window.location.href = `${API_URL}/auth/${provider}`;
	};

	const handleTabChange = (value: string) => {
		// Update global context when tab is clicked
		if (value === 'login') onSwitchMode('login');
		if (value === 'registration') onSwitchMode('signup');

		// View will be updated by the useEffect, but we can set it here for instant feedback
		setView(value as ViewState);
		setError(null);
	};

	const showDesktopSideImage = view === 'registration' && !isMobile;
	const showMobileBanner = view === 'registration' && isMobile;

	return (
		<Modal
			opened={opened}
			onClose={onClose}
			centered
			size={showDesktopSideImage ? 900 : 'sm'}
			padding={0}
			withCloseButton={false}
			classNames={{
				content: classes.modalContent,
				body: classes.modalBody,
			}}
		>
			<div
				className={`${classes.container} ${
					!showDesktopSideImage ? classes.singleMode : ''
				}`}
			>
				<div className={classes.formSide}>
					{error && (
						<Alert
							icon={<IconAlertCircle size={16} />}
							title='Error'
							color='red'
							mb='sm'
						>
							{error}
						</Alert>
					)}

					{view === 'forgot_password' ? (
						<Box mb='md'>
							<Title order={3} className={classes.title}>
								Password recovery
							</Title>
							<Text className={classes.textDimmed}>
								Enter your email address...
							</Text>
						</Box>
					) : (
						<SegmentedControl
							fullWidth
							value={view}
							onChange={handleTabChange}
							data={[
								{ label: 'Registration', value: 'registration' },
								{ label: 'Log in', value: 'login' },
							]}
							classNames={{
								root: classes.segmentRoot,
								label: classes.segmentLabel,
								indicator: classes.segmentActive,
							}}
						/>
					)}

					{showMobileBanner && (
						<div className={classes.mobileBannerWrapper}>
							<Image
								src='/mobile_banner.jpg'
								alt='Welcome Bonus'
								width={300}
								height={100}
								className={classes.mobileImage}
							/>
						</div>
					)}

					<form
						onSubmit={(e) => {
							e.preventDefault();
							handleSubmit();
						}}
						style={{ width: '100%' }}
					>
						<Stack gap='md'>
							<TextInput
								placeholder='E-mail'
								{...form.getInputProps('email')}
								classNames={{
									input: classes.input,
									section: classes.inputSection,
								}}
							/>

							{view !== 'forgot_password' && (
								<>
									<PasswordInput
										placeholder='Password'
										{...form.getInputProps('password')}
										classNames={{
											input: classes.input,
											section: classes.inputSection,
										}}
									/>

									{view === 'login' && (
										<div
											className={classes.forgotLink}
											onClick={() => setView('forgot_password')}
										>
											Forget password?
										</div>
									)}

									{/* {view === 'registration' && (
										<Select
											placeholder='Currency'
											defaultValue='USD'
											data={['USD', 'EUR', 'RUB', 'KZT']}
											{...form.getInputProps('currency')}
											classNames={{
												input: classes.input,
												dropdown: classes.dropdown,
												section: classes.inputSection,
											}}
											comboboxProps={{ withinPortal: false }}
											rightSectionWidth={40}
											allowDeselect={false}
										/>
									)} */}

									<Group
										justify='center'
										className={classes.socialGroup}
										gap='md'
									>
										<div
											onClick={() => socialLogin('google')}
											className={classes.socialIconWrapper}
											style={{ cursor: 'pointer' }}
										>
											<Image
												src='/gogl.svg'
												alt='Google'
												width={50}
												height={50}
											/>
										</div>
										<div className={classes.socialIconWrapper}>
											<Image
												src='/steam.svg'
												alt='Steam'
												width={50}
												height={50}
											/>
										</div>
										<div className={classes.socialIconWrapper}>
											<Image
												src='/x-twitter.svg'
												alt='X'
												width={50}
												height={50}
											/>
										</div>
									</Group>

									{view === 'registration' && (
										<>
											<Stack gap='xs'>
												<Checkbox
													classNames={{ label: classes.checkboxLabel }}
													color='#3E30E9'
													iconColor='white'
													label={<>I am at least 18 years old...</>}
												/>
												<Checkbox
													classNames={{ label: classes.checkboxLabel }}
													color='#3E30E9'
													iconColor='white'
													label='I want to receive promotions by e-mail'
												/>
											</Stack>
											<TextInput
												placeholder='Promo code'
												{...form.getInputProps('promo')}
												classNames={{
													input: classes.input,
													section: classes.inputSection,
												}}
												mt='xs'
											/>
										</>
									)}
								</>
							)}

							<Button
								type='submit'
								loading={loading}
								fullWidth
								className={classes.submitButton}
								mt='xs'
							>
								{view === 'login' && 'Log in'}
								{view === 'registration' && 'Sign up'}
								{view === 'forgot_password' && 'Send Link'}
							</Button>

							{view === 'forgot_password' && (
								<Text
									className={classes.backLink}
									onClick={() => setView('login')}
								>
									← Back to Log in
								</Text>
							)}
						</Stack>
					</form>
				</div>

				{/* Kept your visual logic exactly as requested */}
				{/* {showDesktopSideImage && (
				<div className={classes.imageSide}>
					<div className={classes.imageWrapper}>
						<Image
							src='/desktop_bg.jpg'
							alt='Welcome Bonus'
							fill
							sizes='50vw'
							priority
						/>
					</div>
				</div>
			)} */}

				<ActionIcon
					className={classes.closeButton}
					onClick={onClose}
					variant='transparent'
					aria-label='Close modal'
				>
					<IconX />
				</ActionIcon>
			</div>
		</Modal>
	);
}
