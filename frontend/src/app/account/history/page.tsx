'use client';

import React, { useState } from 'react';
import HeaderUpGetbonus from '@/components/HeaderUp/HeaderUpGetbonus';
import Header from '@/components/Header/Header';
import SlideBar from '@/components/SlideBar/SlideBar';
import Footer from '@/components/Footer/Footer';
import Chat from '@/widgets/chat/ui';
import WalletNavigation from '@/components/WalletNavigation/WalletNavigation';
import EmptyState from '@/components/EmptyState/EmptyState';

// Импортируем наши новые компоненты
import TransactionHistoryTable, {
	TransactionItem,
} from '@/components/Tables/TransactionHistoryTable';
import GameHistoryTable, {
	GameBetItem,
} from '@/components/Tables/GameHistoryTable';

import styles from './page.module.scss';

// МОКОВЫЕ ДАННЫЕ С ДОБАВЛЕННЫМ FEE И НОВЫМИ ЗАПИСЯМИ
const MOCK_TRANSACTIONS: TransactionItem[] = [
	{
		id: 1,
		date: '06.05.2025',
		type: 'Deposits',
		currencyCode: 'BTC',
		currencyIcon: '/btc.svg',
		amount: 0.00002,
		fee: 0.000001,
		status: 'Completed',
	},
	{
		id: 2,
		date: '06.05.2025',
		type: 'Deposits',
		currencyCode: 'LTC',
		currencyIcon: '/doge.svg',
		amount: 0.000007,
		fee: 0,
		status: 'Pending',
	},
	{
		id: 3,
		date: '01.05.2025',
		type: 'Withdrawals',
		currencyCode: 'XPM',
		currencyIcon: '/doge.svg',
		amount: 0.34,
		fee: 0.01,
		status: 'Completed',
	},
	{
		id: 4,
		date: '02.05.2025',
		type: 'Deposits',
		currencyCode: 'ETH',
		currencyIcon: '/eth.svg',
		amount: 0.05,
		fee: 0.0002,
		status: 'Completed',
	},
	{
		id: 5,
		date: '03.05.2025',
		type: 'Withdrawals',
		currencyCode: 'DOGE',
		currencyIcon: '/doge.svg',
		amount: 150,
		fee: 2,
		status: 'Pending',
	},
];

const MOCK_BETS: GameBetItem[] = [
	{
		id: 1,
		game: 'Roulette',
		time: '9:10 AM',
		betAmount: 5.76854,
		currencyIcon: '/btc.svg',
		coefficient: '2,4x',
		payout: 5.76854,
		status: 'win',
	},
	{
		id: 2,
		game: 'Blackjack',
		time: '9:10 AM',
		betAmount: 15000,
		currencyIcon: '/eth.svg',
		coefficient: '2,4x',
		payout: 15000,
		status: 'win',
	},
	{
		id: 3,
		game: 'Slots',
		time: '9:10 AM',
		betAmount: 15000,
		currencyIcon: '/doge.svg',
		coefficient: '2,4x',
		payout: -15000,
		status: 'loss',
	},
	{
		id: 4,
		game: 'Roulette',
		time: '10:15 AM',
		betAmount: 250,
		currencyIcon: '/doge.svg',
		coefficient: '2,0x',
		payout: 500,
		status: 'win',
	},
	{
		id: 5,
		game: 'Blackjack',
		time: '11:30 AM',
		betAmount: 10,
		currencyIcon: '/btc.svg',
		coefficient: '1,5x',
		payout: -10,
		status: 'loss',
	},
];

export default function TransactionsHistoryPage() {
	// Состояние для данных
	const [transactions] = useState<TransactionItem[]>(MOCK_TRANSACTIONS);
	const [bets] = useState<GameBetItem[]>(MOCK_BETS);

	const handleAuth = () => {
		console.log('Open Login/Signup Modal');
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

						{/* 1. Секция Транзакций */}
						<div className={styles.sectionBlock}>
							<div className={styles.headerArea}>
								<h1 className={styles.title}>Transactions</h1>
							</div>

							{transactions.length > 0 ? (
								<TransactionHistoryTable data={transactions} />
							) : (
								<EmptyState
									imageSrc='/astronaut-safe.svg'
									title='No deposits'
									buttonText='Log in/Sign up'
									description='Start your journey by adding funds to your account'
									onAction={handleAuth}
								/>
							)}
						</div>

						{/* 2. Секция Ставок */}
						<div className={styles.sectionBlock}>
							<div className={styles.headerArea}>
								<h2 className={styles.title}>My bets</h2>
							</div>

							{bets.length > 0 ? (
								<GameHistoryTable data={bets} />
							) : (
								<EmptyState
									imageSrc='/astronaut-rocket.svg'
									title='No bets yet'
									buttonText='Log in/Sign up'
									description='Take the first step to winning big!'
									onAction={handleAuth}
								/>
							)}
						</div>
					</div>
				</main>
			</div>
			<Chat />
			<Footer />
		</div>
	);
}
