'use client';

import { useState } from 'react';
import {
	TextInput,
	PasswordInput,
	Button,
	Stack,
	Select,
	Checkbox,
	Group,
	Alert,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconAlertCircle } from '@tabler/icons-react';
import Image from 'next/image';

import { api } from '@/shared/lib/api/axios';
import classes from '../AuthModal/AuthModal.module.scss';

interface RegisterFormProps {
	onSuccess: () => void;
}

export function RegisterForm({ onSuccess }: RegisterFormProps) {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const form = useForm({
		initialValues: {
			email: '',
			password: '',
			currency: 'USD',
			promo: '',
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
			await api.post('/auth/register', form.values);
			onSuccess();
		} catch (err: any) {
			setError(err.response?.data?.message || 'Registration failed');
		} finally {
			setLoading(false);
		}
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

					<Select
						data={['USD', 'EUR', 'RUB', 'KZT']}
						{...form.getInputProps('currency')}
						classNames={{ input: classes.input }}
					/>

					<Group justify='center' gap='md'>
						<Image src='/gogl.svg' alt='Google' width={50} height={50} />
						<Image src='/steam.svg' alt='Steam' width={50} height={50} />
						<Image src='/x-twitter.svg' alt='X' width={50} height={50} />
					</Group>

					<Checkbox label='I am at least 18 years old' />
					<Checkbox label='I want to receive promotions by e-mail' />

					<TextInput
						placeholder='Promo code'
						{...form.getInputProps('promo')}
						classNames={{ input: classes.input }}
					/>

					<Button
						type='submit'
						fullWidth
						loading={loading}
						className={classes.submitButton}
					>
						Sign up
					</Button>
				</Stack>
			</form>
		</>
	);
}
