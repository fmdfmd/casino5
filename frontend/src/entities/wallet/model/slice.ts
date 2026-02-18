import {
	createEntityAdapter,
	createSlice,
	PayloadAction,
} from '@reduxjs/toolkit';

import { RootState } from '@/shared/lib/redux/store';
import { Wallet } from '@/entities/currency/model/slice';

const walletsAdapter = createEntityAdapter<Wallet>();

const walletSlice = createSlice({
	name: 'wallets',
	initialState: walletsAdapter.getInitialState(),
	reducers: {
		upsertMany: walletsAdapter.upsertMany,

		applyBalancePatch(
			state,
			action: PayloadAction<{
				walletId: string;
				patch: Partial<
					Pick<
						Wallet,
						'realBalance' | 'bonusBalance' | 'lockedBalance' | 'wagerRemaining'
					>
				>;
				version: number;
			}>,
		) {
			const { walletId, patch, version } = action.payload;
			const wallet = state.entities[walletId];
			if (!wallet) return;
			if (wallet.version >= version) return;

			walletsAdapter.updateOne(state, {
				id: walletId,
				changes: { ...patch, version },
			});
		},
	},
});

export const walletsActions = walletSlice.actions;
export const walletsSelectors = walletsAdapter.getSelectors(
	(state: RootState) => state.wallet,
);
export default walletSlice.reducer;
