'use client';

import { useState } from 'react';
import {
	TextInput,
	PasswordInput,
	Button,
	Stack,
	Text,
	Group,
	Alert,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconAlertCircle } from '@tabler/icons-react';
import Image from 'next/image';

import { api } from '@/shared/lib/api/axios';
import classes from '../AuthModal/AuthModal.module.scss';

interface LoginFormProps {
	onSuccess: () => void;
	onForgotPassword: () => void;
}

export function LoginForm({ onSuccess, onForgotPassword }: LoginFormProps) {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const form = useForm({
		initialValues: {
			email: '',
			password: '',
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
			await api.post('/auth/login', form.values);
			onSuccess();
		} catch (err: any) {
			setError(err.response?.data?.message || 'Login failed');
		} finally {
			setLoading(false);
		}
	};

	const socialLogin = (provider: string) => {
		window.location.href = `http://localhost:8000/auth/${provider}`;
	};

	return (
		<>
			{error && (
				<Alert icon={<IconAlertCircle size={16} />} color='red' mb='sm'>
					{error}
				</Alert>
			)}

			<form
				onSubmit={(e) => {
					e.preventDefault();
					handleSubmit();
				}}
			>
				<Stack gap='md'>
					<TextInput
						placeholder='E-mail'
						{...form.getInputProps('email')}
						classNames={{ input: classes.input }}
					/>

					<PasswordInput
						placeholder='Password'
						{...form.getInputProps('password')}
						classNames={{ input: classes.input }}
					/>

					<Text className={classes.forgotLink} onClick={onForgotPassword}>
						Forget password?
					</Text>

					<Group justify='center' gap='md'>
						<div onClick={() => socialLogin('google')}>
							<Image src='/gogl.svg' alt='Google' width={50} height={50} />
						</div>
						<Image src='/steam.svg' alt='Steam' width={50} height={50} />
						<Image src='/x-twitter.svg' alt='X' width={50} height={50} />
					</Group>

					<Button
						type='submit'
						fullWidth
						loading={loading}
						className={classes.submitButton}
					>
						Log in
					</Button>
				</Stack>
			</form>
		</>
	);
}
