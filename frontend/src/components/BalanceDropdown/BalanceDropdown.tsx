'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './BalanceDropdown.module.scss';
import { useAppDispatch, useAppSelector } from '@/shared/lib/redux/hooks';
import {
	walletsActions,
	walletsSelectors,
} from '@/entities/wallet/model/slice';
import {
	currenciesActions,
	currenciesSelectors,
} from '@/entities/currency/model/slice';

import Big from 'big.js';
import { getMyWallets } from '@/entities/wallet/api/walletApi';

const BalanceDropdown: React.FC = () => {
	const wallets = useAppSelector(walletsSelectors.selectAll);
	const currencies = useAppSelector(currenciesSelectors.selectEntities);
	console.log(wallets, 'wallets');
	const [isOpen, setIsOpen] = useState(false);
	const [selectedWalletId, setSelectedWalletId] = useState<string | null>(null);
	const dispatch = useAppDispatch();

	useEffect(() => {
		const load = async () => {
			const data = await getMyWallets();

			dispatch(currenciesActions.upsertMany(data.map((w) => w.currency)));
			dispatch(walletsActions.upsertMany(data.map(({ currency, ...w }) => w)));

			setSelectedWalletId(data[0]?.id ?? null);
		};
		load();
	}, []);

	const wallet = wallets.find((w) => w.id === selectedWalletId);
	const currency = wallet ? currencies[wallet.currencyId] : null;

	if (!wallet || !currency) return null;

	const totalBalance = Big(wallet.realBalance)
		.plus(wallet.bonusBalance)
		.toString();

	return (
		<div className={styles.wrapper}>
			<button
				className={`${styles.balanceButton} ${isOpen ? styles.active : ''}`}
				onClick={() => setIsOpen((p) => !p)}
				type='button'
			>
				<span className={styles.balanceValue}>
					<span className={styles.balanceText}>
						{totalBalance} {currency.symbol}
					</span>
					<Image
						src={`http://localhost:8000/currenciesIcons${currency.icon}`}
						alt={currency.id}
						width={20}
						height={20}
						priority
						className={styles.currencyIcon}
					/>
				</span>

				<div className={styles.arrowIcon}>
					<Image src='/openButton.svg' alt='open' width={28} height={28} />
				</div>
			</button>

			{isOpen && (
				<div className={styles.dropdownList}>
					<div className={styles.mobileDepositWrapper}>
						<Link href='' className={styles.mobileDepositBtn}>
							Deposit
						</Link>
					</div>

					{wallets.map((w) => {
						const c = currencies[w.currencyId];
						const balance = Big(w.realBalance).plus(w.bonusBalance).toString();

						return (
							<div
								key={w.id}
								className={`${styles.dropdownItem} ${
									w.id === selectedWalletId ? styles.selected : ''
								}`}
								onClick={() => setSelectedWalletId(w.id)}
							>
								<span className={styles.itemBalance}>
									{balance} {c?.symbol}
								</span>
								<div className={styles.itemCurrency}>
									<Image
										src={`http://localhost:8000/currenciesIcons${c?.icon}`}
										alt={c?.id}
										width={20}
										height={20}
									/>
								</div>
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
};

export default BalanceDropdown;
