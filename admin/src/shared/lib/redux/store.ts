import chatReducer from '@/entities/chats/model/slice';
import { userReducer } from '@/entities/user/model/slice';
import { configureStore } from '@reduxjs/toolkit';

export const makeStore = () => {
	return configureStore({
		reducer: {
			chat: chatReducer,
			user: userReducer,
		},
	});
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
