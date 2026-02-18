'use client';

import AuthModal from './AuthModal';
import { useAuthModal } from './provider/AuthModalProvider';

const AuthModalRoot = () => {
	const { opened, close, mode, openLogin, openSignup } = useAuthModal();

	const handleSwitchMode = (newMode: 'login' | 'signup') => {
		if (newMode === 'login') openLogin();
		if (newMode === 'signup') openSignup();
	};

	return (
		<AuthModal
			opened={opened}
			onClose={close}
			currentMode={mode}
			onSwitchMode={handleSwitchMode}
		/>
	);
};

export default AuthModalRoot;
