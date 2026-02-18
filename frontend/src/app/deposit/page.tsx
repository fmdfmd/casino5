'use client';

import React, { useEffect, useState, useMemo } from 'react';
import QRCode from 'react-qr-code';
import { FaBitcoin, FaEthereum, FaQuestionCircle } from 'react-icons/fa';
import { SiTether, SiBinance, SiLitecoin, SiDogecoin } from 'react-icons/si';

import HeaderUpGetbonus from '@/components/HeaderUp/HeaderUpGetbonus';
import Header from '@/components/Header/Header';
import SlideBar from '@/components/SlideBar/SlideBar';
import Footer from '@/components/Footer/Footer';
import Chat from '@/widgets/chat/ui';

import styles from './page.module.scss';
import { useAppSelector } from '@/shared/lib/redux/hooks';
import { currenciesSelectors } from '@/entities/currency/model/slice';
import { walletsSelectors } from '@/entities/wallet/model/slice';
import { api } from '@/shared/lib/api/axios';

// Иконки (дизайн без изменений)
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
		case 'LTC':
			return <SiLitecoin />;
		case 'DOGE':
			return <SiDogecoin />;
		default:
			return <FaQuestionCircle />;
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
		case 'DOGE':
			return '#C2A633';
		default:
			return '#888888';
	}
};

export default function DepositPage() {
	const wallets = useAppSelector(walletsSelectors.selectAll);
	const currenciesEntities = useAppSelector(currenciesSelectors.selectEntities);

	// Объединяем кошельки с данными их валют
	const availableWallets = useMemo(() => {
		return wallets
			.map((wallet) => ({
				...wallet,
				currency: currenciesEntities[wallet.currencyId],
			}))
			.filter(
				(w) => w.currency && w.currency.isActive && w.currency.isDepositEnabled,
			);
	}, [wallets, currenciesEntities]);

	const [selectedWalletId, setSelectedWalletId] = useState<string | null>(null);
	const [depositAddress, setDepositAddress] = useState<string | null>(null);
	const [isLoadingAddress, setIsLoadingAddress] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const selectedWallet = availableWallets.find(
		(w) => w.id === selectedWalletId,
	);

	// Авто-выбор первого кошелька
	useEffect(() => {
		if (availableWallets.length > 0 && !selectedWalletId) {
			setSelectedWalletId(availableWallets[0].id);
		}
	}, [availableWallets, selectedWalletId]);

	// Сброс при смене кошелька
	useEffect(() => {
		setDepositAddress(null);
		setError(null);
	}, [selectedWalletId]);

	const handleCopy = (text: string) => {
		navigator.clipboard.writeText(text);
		alert('Address copied!');
	};

	const handleGenerateAddress = async () => {
		if (!selectedWallet) return;

		setIsLoadingAddress(true);
		setError(null);

		try {
			// Бэкенд ожидает currencyId для генерации адреса
			const response = await api.post('/wallet/deposit-address', {
				currencyId: selectedWallet.currencyId,
			});

			setDepositAddress(response.data.address);
		} catch (err: any) {
			setError(err.response?.data?.message || 'Failed to generate address');
		} finally {
			setIsLoadingAddress(false);
		}
	};

	return (
		<div className={styles.pageLayout}>
			<HeaderUpGetbonus />
			<Header />

			<div className={styles.wrapper}>
				<SlideBar />

				<main className={styles.mainContent}>
					<div className={styles.depositContainer}>
						<div className={styles.headerArea}>
							<h1 className={styles.title}>Deposit</h1>
							<p className={styles.subtitle}>Select a convenient system:</p>
						</div>

						<div className={styles.contentColumns}>
							{/* ЛЕВАЯ КОЛОНКА */}
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
												style={{
													color:
														selectedWalletId === wallet.id
															? '#fff'
															: getBrandColor(wallet.currency!.symbol),
												}}
											>
												{getCurrencyIcon(
													wallet.currency!.symbol,
													wallet.currency!.icon,
												)}
											</span>
											<span className={styles.methodName}>
												{wallet.currency!.name}
											</span>
											<span className={styles.networkBadge}>
												{wallet.currency!.network}
											</span>
										</div>
									))}
								</div>
							</div>

							{/* ПРАВАЯ КОЛОНКА */}
							<div className={styles.rightSection}>
								{selectedWallet ? (
									<div className={styles.paymentDetails}>
										<div className={styles.detailsHeader}>
											<div className={styles.selectedTitle}>
												<span
													style={{
														color: getBrandColor(
															selectedWallet.currency!.symbol,
														),
													}}
													className={styles.headerIcon}
												>
													{getCurrencyIcon(
														selectedWallet.currency!.symbol,
														selectedWallet.currency!.icon,
													)}
												</span>
												<div>
													<h3>{selectedWallet.currency!.name}</h3>
													<span className={styles.networkName}>
														{selectedWallet.currency!.network} Network
													</span>
												</div>
											</div>
											<span className={styles.badge}>
												{selectedWallet.currency!.minConfirmations}{' '}
												confirmations required
											</span>
										</div>

										<div className={styles.cryptoForm}>
											<div className={styles.warningBox}>
												Send only{' '}
												<strong>{selectedWallet.currency!.symbol}</strong> via{' '}
												<strong>{selectedWallet.currency!.network}</strong>.
											</div>

											<label className={styles.label}>
												Your Deposit Address:
											</label>

											{!depositAddress ? (
												<div className={styles.generateContainer}>
													{error && (
														<div className={styles.errorMessage}>{error}</div>
													)}
													<button
														className={styles.generateBtn}
														onClick={handleGenerateAddress}
														disabled={isLoadingAddress}
													>
														{isLoadingAddress
															? 'Generating...'
															: 'Get Deposit Address'}
													</button>
												</div>
											) : (
												<>
													<div className={styles.addressBox}>
														<input readOnly value={depositAddress} />
														<button onClick={() => handleCopy(depositAddress)}>
															Copy
														</button>
													</div>

													<div className={styles.qrContainer}>
														<div className={styles.qrWrapper}>
															<QRCode value={depositAddress} size={140} />
														</div>
														<p>Scan to pay</p>
													</div>
												</>
											)}

											<div className={styles.infoGrid}>
												<div className={styles.infoItem}>
													<span>Min Deposit:</span>
													<strong>
														{selectedWallet.currency!.minDeposit}{' '}
														{selectedWallet.currency!.symbol}
													</strong>
												</div>
												<div className={styles.infoItem}>
													<span>Current Balance:</span>
													<strong>
														{Number(selectedWallet.realBalance).toFixed(6)}{' '}
														{selectedWallet.currency!.symbol}
													</strong>
												</div>
											</div>
										</div>
									</div>
								) : (
									<div className={styles.emptyState}>Select a currency</div>
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
