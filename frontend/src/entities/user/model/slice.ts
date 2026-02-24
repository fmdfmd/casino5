import { User } from '@/features/auth/model/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { logoutUser } from './api/logout';

interface UserState {
	user: User | null;
	isLoading: boolean;
	error: string | null;
}

const initialState: UserState = {
	user: null,
	isLoading: false,
	error: null,
};

export const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		setUser: (state, action: PayloadAction<User>) => {
			state.user = action.payload;
		},
		clearUser: (state) => {
			state.user = null;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(logoutUser.pending, (state) => {
				console.log('logoutUser.pending');
				state.isLoading = true;
				state.error = null;
			})
			.addCase(logoutUser.fulfilled, (state) => {
				console.log('logoutUser.fulfilled');
				state.isLoading = false;
				state.user = null;
				console.log('user-null');
			})
			.addCase(logoutUser.rejected, (state, action) => {
				console.log('logoutUser.rejected');
				state.isLoading = false;
				// state.error = action.payload || 'Logout failed';
			});
	},
});

export const { setUser, clearUser } = userSlice.actions;
export const userReducer = userSlice.reducer;
