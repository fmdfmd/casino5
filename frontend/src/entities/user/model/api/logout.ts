import { api } from '@/shared/lib/api/axios';
import { createAsyncThunk } from '@reduxjs/toolkit';

// export const logoutUser = createAsyncThunk<void, void, { rejectValue: string }>(
// 	'user/logout',
// 	async (_, { rejectWithValue }) => {
// 		try {
// 			await api.post('/auth/logout', {}, { withCredentials: true });
// 		} catch (error: any) {
// 			return rejectWithValue(
// 				error.response?.data?.message || 'Failed to logout',
// 			);
// 		}
// 	},
// );

export const logoutUser = createAsyncThunk(
	'user/logout',
	async (_, { rejectWithValue }) => {
		try {
			const response = await api.post(
				'/auth/logout',
				{},
				{ withCredentials: true },
			);

			console.log('LOGOUT STATUS:', response.status);
			console.log('LOGOUT DATA:', response.data);

			return true;
		} catch (error: any) {
			console.log('LOGOUT ERROR:', error);
			return rejectWithValue(
				error.response?.data?.message || 'Failed to logout',
			);
		}
	},
);
