// 'use client';

// import React, { useState } from 'react';
// import {
//     FaPaypal, FaCcVisa, FaCcMastercard, FaBitcoin,
//     FaEthereum
// } from 'react-icons/fa6';
// import { SiTether, SiBinance } from 'react-icons/si';

// import HeaderUpGetbonus from '@/components/HeaderUp/HeaderUpGetbonus';
// import Header from '@/components/Header/Header';
// import SlideBar from '@/components/SlideBar/SlideBar';
// import Footer from '@/components/Footer/Footer';
// import Chat from '@/widgets/chat/ui';
// import WalletNavigation from '@/components/WalletNavigation/WalletNavigation'; // Добавил импорт

// import styles from './page.module.scss';

// const TronIcon = () => (
//     <svg width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor">
//         <path d="M12 2L3.5 4.5L5.5 20L12 22L18.5 20L20.5 4.5L12 2ZM12 4.8L17.2 6.4L16.1 14.5L12 11.2L7.9 14.5L6.8 6.4L12 4.8ZM12 13.5L15.3 16.1L12 19.3L8.7 16.1L12 13.5Z" />
//     </svg>
// );

// type PaymentType = 'fiat' | 'crypto';

// interface PaymentMethod {
//     id: string;
//     name: string;
//     icon: React.ReactNode;
//     type: PaymentType;
//     currency: string;
//     brandColor: string;
// }

// const paymentMethods: PaymentMethod[] = [
//     { id: 'paypal', name: 'PayPal', icon: <FaPaypal />, type: 'fiat', currency: 'USD', brandColor: '#c1d6ffff' },
//     {
//         id: 'visa',
//         name: 'Visa/MC',
//         icon: <div className={styles.dualIcon}><FaCcVisa /> <FaCcMastercard /></div>,
//         type: 'fiat', currency: 'USD', brandColor: '#c1d6ffff'
//     },
//     { id: 'btc', name: 'Bitcoin', icon: <FaBitcoin />, type: 'crypto', currency: 'BTC', brandColor: '#F7931A' },
//     { id: 'eth', name: 'Ethereum', icon: <FaEthereum />, type: 'crypto', currency: 'ETH', brandColor: '#627EEA' },
//     { id: 'tron', name: 'TRON', icon: <TronIcon />, type: 'crypto', currency: 'TRX', brandColor: '#FF0013' },
//     { id: 'usdt', name: 'Tether', icon: <SiTether />, type: 'crypto', currency: 'USDT', brandColor: '#26A17B' },
//     { id: 'bnb', name: 'BNB', icon: <SiBinance />, type: 'crypto', currency: 'BNB', brandColor: '#F3BA2F' },
// ];

// export default function WithdrawPage() { // Сменил название
//     const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(paymentMethods[1]);
//     const [amount, setAmount] = useState('75');

//     return (
//         <div className={styles.pageLayout}>
//             {/* <HeaderUpGetbonus /> */}
//             <Header />

//             <div className={styles.wrapper}>
//                 <SlideBar />

//                 <main className={styles.mainContent}>
//                     <div className={styles.depositContainer}>

//                         {/* Добавлен компонент навигации */}
//                         <WalletNavigation />

//                         <div className={styles.headerArea}>
//                             <h1 className={styles.title}>Withdraw</h1>
//                             <p className={styles.subtitle}>Select a convenient system for withdraw:</p>
//                         </div>

//                         <div className={styles.contentColumns}>
//                             <div className={styles.leftSection}>
//                                 <div className={styles.methodsGrid}>
//                                     {paymentMethods.map((method) => (
//                                         <div
//                                             key={method.id}
//                                             className={`${styles.methodCard} ${selectedMethod.id === method.id ? styles.active : ''}`}
//                                             onClick={() => setSelectedMethod(method)}
//                                         >
//                                             <span className={styles.methodIcon} style={{ color: method.brandColor }}>
//                                                 {method.icon}
//                                             </span>
//                                             <span className={styles.methodName}>{method.name}</span>
//                                         </div>
//                                     ))}
//                                 </div>
//                             </div>

//                             <div className={styles.rightSection}>
//                                 <div className={styles.paymentDetails}>
//                                     <div className={styles.detailsHeader}>
//                                         <div className={styles.selectedTitle}>
//                                             <span style={{ color: selectedMethod.brandColor }}>{selectedMethod.icon}</span>
//                                             <h3>{selectedMethod.name}</h3>
//                                         </div>
//                                         <span className={styles.badge}>Instant</span>
//                                     </div>

//                                     <div className={styles.fiatForm}>
//                                         <label className={styles.label}>
//                                             {selectedMethod.type === 'fiat' ? 'Enter wallet or card number' : `Enter ${selectedMethod.name} address`}
//                                         </label>
//                                         <div className={styles.inputWrapper} style={{marginBottom: '15px'}}>
//                                             <input
//                                                 type="text"
//                                                 placeholder={selectedMethod.type === 'fiat' ? "Account number" : "Wallet address"}
//                                             />
//                                         </div>

//                                         <label className={styles.label}>Enter withdraw amount (15 - 50,000 $)</label>
//                                         <div className={styles.inputWrapper}>
//                                             <input
//                                                 type="number"
//                                                 value={amount}
//                                                 onChange={(e) => setAmount(e.target.value)}
//                                             />
//                                             <span className={styles.currencySymbol}>$</span>
//                                         </div>
//                                         <div className={styles.presets}>
//                                             {['20', '50', '75', '500'].map(val => (
//                                                 <button
//                                                     key={val}
//                                                     onClick={() => setAmount(val)}
//                                                     className={amount === val ? styles.activePreset : ''}
//                                                 >
//                                                     {val}$
//                                                 </button>
//                                             ))}
//                                         </div>
//                                         <button className={styles.submitBtn}>Withdraw</button>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </main>
//             </div>
//             <Chat />
//             <Footer />
//         </div>
//     );
// }

'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { FaBitcoin, FaEthereum, FaCircleQuestion } from 'react-icons/fa6';
import { SiTether, SiBinance } from 'react-icons/si';

import HeaderUpGetbonus from '@/components/HeaderUp/HeaderUpGetbonus';
import Header from '@/components/Header/Header';
import SlideBar from '@/components/SlideBar/SlideBar';
import Footer from '@/components/Footer/Footer';
import Chat from '@/widgets/chat/ui';
import WalletNavigation from '@/components/WalletNavigation/WalletNavigation';

import styles from './page.module.scss';
import { useAppDispatch, useAppSelector } from '@/shared/lib/redux/hooks';
import {
	currenciesActions,
	currenciesSelectors,
} from '@/entities/currency/model/slice';
import {
	walletsActions,
	walletsSelectors,
} from '@/entities/wallet/model/slice';
import { api } from '@/shared/lib/api/axios'; // Ваш Axios instance
import { getMyWallets } from '@/entities/wallet/api/walletApi';

// --- Вспомогательные функции (сохраняем для консистентности) ---

const getCurrencyIcon = (symbol: string, iconUrl?: string | null) => {
	if (iconUrl) return <img src={iconUrl} alt={symbol} width={24} height={24} />;
	switch (symbol.toUpperCase()) {
		case 'BTC':
			return <FaBitcoin />;
		case 'ETH':
			return <FaEthereum />;
		case 'USDT':
			return <SiTether />;
		case 'BNB':
			return <SiBinance />;
		default:
			return <FaCircleQuestion />;
	}
};

const getBrandColor = (symbol: string) => {
	switch (symbol.toUpperCase()) {
		case 'BTC':
			return '#F7931A';
		case 'ETH':
			return '#627EEA';
		case 'USDT':
			return '#26A17B';
		case 'BNB':
			return '#F3BA2F';
		default:
			return '#888888';
	}
};

export default function WithdrawPage() {
	// --- Redux State ---
	const wallets = useAppSelector(walletsSelectors.selectAll);
	const currenciesEntities = useAppSelector(currenciesSelectors.selectEntities);
	const dispatch = useAppDispatch();

	// --- Component State ---
	const [selectedWalletId, setSelectedWalletId] = useState<string | null>(null);
	const [amount, setAmount] = useState('');
	const [address, setAddress] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);

	// ⭐ Объединяем кошельки с данными их валют и фильтруем доступные для вывода
	const availableWallets = useMemo(() => {
		return wallets
			.map((wallet) => ({
				...wallet,
				currency: currenciesEntities[wallet.currencyId],
			}))
			.filter(
				(w) =>
					w.currency && w.currency.isActive && w.currency.isWithdrawalEnabled,
			);
	}, [wallets, currenciesEntities]);

	const selectedWallet = availableWallets.find(
		(w) => w.id === selectedWalletId,
	);

	// --- Data Loading Effect ---
	useEffect(() => {
		const loadWallets = async () => {
			try {
				const data = await getMyWallets(); // Загружаем данные с бэкенда
				if (data && data.length > 0) {
					dispatch(currenciesActions.upsertMany(data.map((w) => w.currency)));
					dispatch(
						walletsActions.upsertMany(data.map(({ currency, ...w }) => w)),
					);

					// Автоматически выбираем первый доступный для вывода кошелек
					const firstAvailable = data.find(
						(w) => w.currency.isWithdrawalEnabled,
					);
					if (firstAvailable) {
						setSelectedWalletId(firstAvailable.id);
					}
				}
			} catch (err) {
				console.error('Failed to load wallets:', err);
			}
		};
		loadWallets();
	}, [dispatch]);

	// Сброс полей при смене кошелька
	useEffect(() => {
		setAmount('');
		setAddress('');
		setError(null);
		setSuccess(null);
	}, [selectedWalletId]);

	// --- Handlers ---
	const handleWithdraw = async () => {
		if (!selectedWallet || !amount || !address) {
			setError('Please fill all fields.');
			return;
		}

		const amountNum = parseFloat(amount);
		const balanceNum = parseFloat(selectedWallet.realBalance);
		const minWithdrawalNum = parseFloat(
			selectedWallet.currency.minWithdrawal || '0',
		);

		if (amountNum <= 0) {
			setError('Amount must be positive.');
			return;
		}
		if (amountNum > balanceNum) {
			setError('Insufficient balance.');
			return;
		}
		if (amountNum < minWithdrawalNum) {
			setError(
				`Minimum withdrawal is ${minWithdrawalNum} ${selectedWallet.currency.symbol}.`,
			);
			return;
		}

		setIsLoading(true);
		setError(null);
		setSuccess(null);

		try {
			await api.post('/wallet/withdraw/request', {
				walletId: selectedWallet.id,
				amount,
				address,
			});
			setSuccess(
				'Withdrawal request created successfully! It will be processed shortly.',
			);
			setAmount('');
			setAddress('');
			// Тут можно добавить обновление баланса через сокет или повторный fetch
		} catch (err: any) {
			setError(err.response?.data?.message || 'An error occurred.');
		} finally {
			setIsLoading(false);
		}
	};

	const setPresetAmount = (value: string) => {
		if (selectedWallet) {
			const balance = parseFloat(selectedWallet.realBalance);
			const presetValue = parseFloat(value);
			setAmount(String(Math.min(balance, presetValue)));
		}
	};

	return (
		<div className={styles.pageLayout}>
			{/* <HeaderUpGetbonus /> */}
			<Header />

			<div className={styles.wrapper}>
				<SlideBar />

				<main className={styles.mainContent}>
					<div className={styles.depositContainer}>
						<WalletNavigation />
						<div className={styles.headerArea}>
							<h1 className={styles.title}>Withdraw</h1>
							<p className={styles.subtitle}>
								Select a currency and enter details to withdraw:
							</p>
						</div>

						<div className={styles.contentColumns}>
							<div className={styles.leftSection}>
								<div className={styles.methodsGrid}>
									{availableWallets.map((wallet) => (
										<div
											key={wallet.id}
											className={`${styles.methodCard} ${selectedWalletId === wallet.id ? styles.active : ''}`}
											onClick={() => setSelectedWalletId(wallet.id)}
										>
											<span
												className={styles.methodIcon}
												style={{ color: getBrandColor(wallet.currency.symbol) }}
											>
												{getCurrencyIcon(
													wallet.currency.symbol,
													wallet.currency.icon,
												)}
											</span>
											<span className={styles.methodName}>
												{wallet.currency.name}
											</span>
										</div>
									))}
								</div>
							</div>

							<div className={styles.rightSection}>
								{selectedWallet ? (
									<div className={styles.paymentDetails}>
										<div className={styles.detailsHeader}>
											<div className={styles.selectedTitle}>
												<span
													style={{
														color: getBrandColor(
															selectedWallet.currency.symbol,
														),
													}}
												>
													{getCurrencyIcon(
														selectedWallet.currency.symbol,
														selectedWallet.currency.icon,
													)}
												</span>
												<h3>
													{selectedWallet.currency.name} (
													{selectedWallet.currency.network})
												</h3>
											</div>
											<span className={styles.badge}>
												Fee: {selectedWallet.currency.withdrawalFee}{' '}
												{selectedWallet.currency.symbol}
											</span>
										</div>

										<div className={styles.fiatForm}>
											<label className={styles.label}>
												Your {selectedWallet.currency.symbol} address on{' '}
												{selectedWallet.currency.network} network
											</label>
											<div
												className={styles.inputWrapper}
												style={{ marginBottom: '15px' }}
											>
												<input
													type='text'
													placeholder='Enter wallet address'
													value={address}
													onChange={(e) => setAddress(e.target.value)}
												/>
											</div>

											<label className={styles.label}>
												Withdraw amount (Balance:{' '}
												{parseFloat(selectedWallet.realBalance).toFixed(4)}{' '}
												{selectedWallet.currency.symbol})
											</label>
											<div className={styles.inputWrapper}>
												<input
													type='number'
													placeholder='0.00'
													value={amount}
													onChange={(e) => setAmount(e.target.value)}
												/>
												<span className={styles.currencySymbol}>
													{selectedWallet.currency.symbol}
												</span>
											</div>
											<div className={styles.presets}>
												{['20', '50', '75', '500'].map((val) => (
													<button
														key={val}
														onClick={() => setPresetAmount(val)}
														className={
															amount === val ? styles.activePreset : ''
														}
													>
														{val}$
													</button>
												))}
												<button
													onClick={() => setAmount(selectedWallet.realBalance)}
												>
													MAX
												</button>
											</div>

											{error && <p className={styles.errorText}>{error}</p>}
											{success && (
												<p className={styles.successText}>{success}</p>
											)}

											<button
												className={styles.submitBtn}
												onClick={handleWithdraw}
												disabled={isLoading}
											>
												{isLoading ? 'Processing...' : 'Withdraw'}
											</button>
										</div>
									</div>
								) : (
									<div className={styles.emptyState}>
										<p>You have no wallets available for withdrawal.</p>
									</div>
								)}
							</div>
						</div>
					</div>
				</main>
			</div>
			<Chat />
			<Footer />
		</div>
	);
}
