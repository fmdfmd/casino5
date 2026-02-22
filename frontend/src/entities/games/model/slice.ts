import { api } from '@/shared/lib/api/axios';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchLobby = createAsyncThunk('games/fetchLobby', async () => {
	const response = await api.get('/games/lobby');
	return response.data;
});

const gamesSlice = createSlice({
	name: 'games',
	initialState: { popular: [], personalized: [], loading: false },
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(fetchLobby.pending, (state) => {
				state.loading = true;
			})
			.addCase(fetchLobby.fulfilled, (state, action) => {
				state.loading = false;
				state.popular = action.payload.popularGames;
				state.personalized = action.payload.personalizedGames;
			});
	},
});
export default gamesSlice.reducer;
