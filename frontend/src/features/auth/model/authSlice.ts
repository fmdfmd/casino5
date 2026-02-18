import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User } from './types';
import { ApiHttpError } from '@/shared/lib/api/baseApi';
import { setUser } from '@/entities/user/model/slice';
import { api } from '@/shared/lib/api/axios';

interface AuthState {
	token: string | null;
	isLoginPopupOpen: boolean;
	isLoading: boolean;
	error: string | null;
}

// Попытка восстановить сессию из localStorage при старте
const tokenFromStorage =
	typeof window !== 'undefined' ? localStorage.getItem('token') : null;

const initialState: AuthState = {
	token: tokenFromStorage,
	isLoginPopupOpen: false,
	isLoading: false,
	error: null,
};

export const loginUser = createAsyncThunk(
	'auth/login',
	async (data, { rejectWithValue, dispatch }) => {
		try {
			const response = await api.post('/auth/login', data);
			// const response = await authApi.login(data);
			console.log(response.data.user, 'response-loginUser');

			dispatch(setUser(response.data));

			return {
				accessToken: response.data.access_token,
			};
		} catch (err) {
			if (err instanceof ApiHttpError) {
				return rejectWithValue(err.payload?.message || err.message);
			}
			return rejectWithValue('Login failed');
		}
	}
);

export const registerUser = createAsyncThunk(
	'auth/register',
	async (data, { rejectWithValue, dispatch }) => {
		try {
			// const response = await authApi.register(data);
			const response = await api.post('/auth/register', data);

			dispatch(setUser(response.data.user));

			return {
				accessToken: response.data.access_token,
			};
		} catch (err) {
			return rejectWithValue('Registration failed');
		}
	}
);

export const fetchMe = createAsyncThunk(
	'auth/me',
	async (_, { rejectWithValue, dispatch }) => {
		try {
			const { data } = await api.get('/auth/me');
			dispatch(setUser(data));
			return data;
		} catch {
			return rejectWithValue(null);
		}
	}
);

export const logoutUser = createAsyncThunk(
	'auth/logoutUser',
	async (_, { dispatch }) => {
		try {
			await api.get('/auth/logout');
		} catch (e) {
			console.error(e);
		} finally {
			// В любом случае сбрасываем состояние на клиенте
			dispatch(logout());
		}
	}
);

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		openLoginPopup: (state) => {
			state.isLoginPopupOpen = true;
		},
		closeLoginPopup: (state) => {
			state.isLoginPopupOpen = false;
		},
		logout: (state) => {
			state.token = null;
			localStorage.removeItem('token');
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(loginUser.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(loginUser.fulfilled, (state, action) => {
				state.isLoading = false;
				state.token = action.payload.accessToken;
				localStorage.setItem('token', action.payload.accessToken);
			})
			.addCase(loginUser.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload as string;
			});

		builder
			.addCase(fetchMe.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(fetchMe.fulfilled, (state, action) => {
				state.isLoading = false;
			})
			.addCase(fetchMe.rejected, (state, action) => {
				state.isLoading = false;
			});
	},
});

export const { openLoginPopup, closeLoginPopup, logout } = authSlice.actions;
export const authReducer = authSlice.reducer;
