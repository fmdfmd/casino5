import { RootState } from '@/shared/lib/redux/store';
import {
	createEntityAdapter,
	createSlice,
	PayloadAction,
} from '@reduxjs/toolkit';

export type Currency = {
	symbol: string;
	id: string;
	name: string;
	network: string;
	priceUsd: string;
	lastPriceUpdate: Date | null;
	isActive: boolean | null;
	isDepositEnabled: boolean | null;
	isWithdrawalEnabled: boolean | null;
	icon: string | null;
	decimals: number;
	minDeposit: string | null;
	minWithdrawal: string | null;
	withdrawalFee: string | null;
	contractAddress: string | null;
	minConfirmations: number | null;
};

export type Wallet = {
	id: string;
	userId: string;
	currencyId: string;
	realBalance: string;
	bonusBalance: string;
	lockedBalance: string;
	wagerRemaining: string;
	version: number;
};

export type WalletSnapshot = Wallet & {
	currency: Currency;
};

export interface InitialStateType {
	currencies: Currency[];
}

const initialState: InitialStateType = {
	currencies: [],
};

const currenciesAdapter = createEntityAdapter<Currency>();

const currencySlice = createSlice({
	name: 'currencies',
	initialState: currenciesAdapter.getInitialState(),
	reducers: {
		upsertMany: currenciesAdapter.upsertMany,
		updatePrice: currenciesAdapter.updateOne,
	},
});

export const currenciesActions = currencySlice.actions;
export const currenciesSelectors = currenciesAdapter.getSelectors(
	(state: RootState) => state.currencies,
);
export default currencySlice.reducer;
