import currencyReducer from '@/entities/currency/model/slice';
import walletReducer from '@/entities/wallet/model/slice';
import { userReducer } from '@/entities/user/model/slice';
import { authReducer } from '@/features/auth/model/authSlice';
import { supportChatReducer } from '@/widgets/chat/model/slice';
import vipSlice from '@/entities/vip/model/vipSlice';
import { configureStore } from '@reduxjs/toolkit';

export const makeStore = () => {
	return configureStore({
		reducer: {
			auth: authReducer,
			supportChat: supportChatReducer,
			user: userReducer,
			currencies: currencyReducer,
			wallet: walletReducer,
			vip: vipSlice,
		},
	});
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
