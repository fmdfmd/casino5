'use client';

import { createContext, useContext, useState } from 'react';
import { useDisclosure } from '@mantine/hooks';

type Mode = 'login' | 'signup';

const AuthModalContext = createContext<{
	opened: boolean;
	close: () => void;
	openLogin: () => void;
	openSignup: () => void;
	mode: Mode;
} | null>(null);

export const AuthModalProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const [opened, { open, close }] = useDisclosure(false);
	const [mode, setMode] = useState<Mode>('login');

	const openLogin = () => {
		setMode('login');
		open();
	};

	const openSignup = () => {
		setMode('signup');
		open();
	};

	return (
		<AuthModalContext.Provider
			value={{ opened, close, openLogin, openSignup, mode }}
		>
			{children}
		</AuthModalContext.Provider>
	);
};

export const useAuthModal = () => {
	const context = useContext(AuthModalContext);
	if (!context) {
		throw new Error('useAuthModal must be used within AuthModalProvider');
	}

	return context;
};
