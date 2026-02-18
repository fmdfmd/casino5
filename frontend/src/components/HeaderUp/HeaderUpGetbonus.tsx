'use client';

import Image from 'next/image';
import styles from './HeaderUp.module.scss';
import { useDisclosure } from '@mantine/hooks';
import AuthModal from '@/components/AuthModal/AuthModal';
import { useAuthModal } from '../AuthModal/provider/AuthModalProvider';

const HeaderUpGetbonus = () => {
	const { opened, openSignup } = useAuthModal();

	return (
		<>
			<div className={styles.getbonus}>
				<div className={styles.getbonus__main}>
					<div className={styles['getbonus__main-title']}>
						The best conditions for an exciting start
					</div>
					<button
						className={styles['getbonus__main-registrationLink']}
						onClick={openSignup}
						type='button'
					>
						Sign up and immediately get a bonus on your account!
					</button>
					<button className={styles['getbonus__main-closeButton']}>
						<Image
							src='/closeButton.svg'
							alt='winvube_closeButton'
							width={28}
							height={28}
							priority
						/>
					</button>
				</div>
			</div>
		</>
	);
};

export default HeaderUpGetbonus;
