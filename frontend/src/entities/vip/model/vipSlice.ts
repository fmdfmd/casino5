import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@/shared/lib/api/axios'; // Ваш настроенный axios instance
import { RootState } from '@/shared/lib/redux/store';

// Типы (на основе схемы БД)
interface VipLevelConfig {
	level: number;
	name: string;
	wagerRequiredUsd: string;
	rakebackRate: string;
	levelUpBonusUsd: string;
	weeklyBoostBaseRate: string;
}

interface UserProgress {
	currentWager: number;
	currentLevel: number;
	nextLevelName: string;
	nextLevelWager: number;
}

interface VipState {
	levels: VipLevelConfig[];
	userProgress: UserProgress | null;
	loading: boolean;
	error: string | null;
}

const initialState: VipState = {
	levels: [],
	userProgress: null,
	loading: false,
	error: null,
};

// Асинхронный экшен
export const fetchVipData = createAsyncThunk(
	'vip/fetchData',
	async (_, { rejectWithValue }) => {
		try {
			const response = await api.get('/vip/info');
			return response.data; // { levels: [...], userProgress: {...} }
		} catch (error: any) {
			return rejectWithValue(
				error.response?.data?.message || 'Failed to fetch VIP data',
			);
		}
	},
);

const vipSlice = createSlice({
	name: 'vip',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(fetchVipData.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchVipData.fulfilled, (state, action) => {
				state.loading = false;
				state.levels = action.payload.levels;
				state.userProgress = action.payload.userProgress;
			})
			.addCase(fetchVipData.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload as string;
			});
	},
});

export const selectVipLevels = (state: RootState) => state.vip.levels;
export const selectVipProgress = (state: RootState) => state.vip.userProgress;
export const selectVipLoading = (state: RootState) => state.vip.loading;

export default vipSlice.reducer;
