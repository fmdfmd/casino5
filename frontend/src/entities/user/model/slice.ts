import { User } from '@/features/auth/model/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
	user: User | null;
}

const initialState: UserState = {
	user: null,
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
});

export const { setUser, clearUser } = userSlice.actions;
export const userReducer = userSlice.reducer;
