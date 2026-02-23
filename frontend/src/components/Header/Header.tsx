'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Header.module.scss';
import BalanceDropdown from '../BalanceDropdown/BalanceDropdown';
import BuregMenu from '../BuregMenu/BuregMenu';
import NotificationsDropdown from '../NotificationsDropdown/NotificationsDropdown';
import { useAppDispatch, useAppSelector } from '@/shared/lib/redux/hooks';
import { useAuthModal } from '../AuthModal/provider/AuthModalProvider';
import clsx from 'clsx';

const USER_ACTIONS = [
	{
		id: 'like',
		tag: 'link',
		href: '/favourites',
		src: '/like.svg',
		alt: 'Like',
		width: 32,
		height: 32,
		wrapperClass: 'header__wrapper-like',
	},
	// Колокольчик удален из конфига, он вставляется вручную в JSX
	{
		id: 'profile',
		tag: 'link',
		href: '',
		src: '/lc.svg',
		alt: 'Profile',
		width: 33,
		height: 33,
		wrapperClass: 'header__wrapper-personalaccountList',
		imgClass: 'header__wrapper-personalaccountItem',
	},
];

const Header = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const { user } = useAppSelector((store) => store.user);
	const { openLogin, openSignup } = useAuthModal();

	const dispatch = useAppDispatch();

	const handleLogout = () => {
		// dispatch(logoutUser()).then(() => {
		// 	// Редирект или обновление UI
		// 	window.location.href = '/';
		// });
	};

	return (
		<>
			<header className={styles.header}>
				<div className={styles.header__wrapper}>
					<div className={styles['header__wrapper-logoImg']}>
						{/* Бургер - добавили onClick */}
						<div
							className={styles['header__wrapper-burgerMenu']}
							onClick={() => setIsMenuOpen(true)} // Открываем меню
							role='button'
							tabIndex={0}
						>
							<Image
								src='/burgerMenu.svg'
								alt='menu'
								width={44}
								height={44}
								priority
							/>
						</div>

						<Link
							href='/'
							style={{
								display: 'flex',
								alignItems: 'center',
								gap: '10px',
								textDecoration: 'none',
							}}
						>
							<Image
								src='/logoMain.svg'
								alt='winvube_logo'
								width={67}
								height={58}
								priority
								className={styles['header__wrapper-logoIcon']}
							/>
							<span className={styles['header__wrapper-logoName']}>
								WinVibe
							</span>
						</Link>
					</div>

					{/* ПРАВЫЙ БЛОК: Кнопки */}
					{user && (
						<div className={styles['header__wrapper-buttonList']}>
							<BalanceDropdown />

							<Link
								href='/deposit'
								className={styles['header__wrapper-balanceup']}
							>
								Deposit
							</Link>
							<div className={styles['header__wrapper-headerMenu']}>
								{/* 1. Рендерим Лайк (фильтруем из массива) */}
								{USER_ACTIONS.filter((item) => item.id === 'like').map(
									(item) => (
										<Link
											key={item.id}
											href={item.href || ''}
											className={styles[item.wrapperClass]}
										>
											<Image
												src={item.src}
												alt={item.alt}
												width={item.width}
												height={item.height}
												priority
											/>
										</Link>
									),
								)}

								{/* 2. Вставляем компонент Колокольчика */}
								<NotificationsDropdown />

								{/* 3. Рендерим Профиль (фильтруем из массива) */}

								<Link
									href={'/account'}
									className={styles['header__wrapper-like']}
								>
									<Image
										src={!user?.avatar ? '/lc.svg' : user.avatar}
										// src={'/lc.svg'}
										alt={''}
										width={32}
										height={32}
										priority
										style={{ borderRadius: 20 }}
									/>
								</Link>
							</div>
						</div>
					)}

					{!user && (
						<div className={styles['header__wrapper-auth']}>
							<button
								onClick={openLogin}
								className={styles['header__wrapper-login']}
							>
								Log In
							</button>
							<button
								onClick={openSignup}
								className={styles['header__wrapper-singin']}
							>
								Sign up
							</button>
						</div>
					)}
				</div>
			</header>

			{/* Вставляем компонент меню, передаем состояние */}
			<BuregMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
		</>
	);
};

export default Header;
