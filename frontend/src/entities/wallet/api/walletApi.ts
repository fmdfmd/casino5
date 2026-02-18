import { api } from '@/shared/lib/api/axios';
import { WalletSnapshot } from '../../currency/model/slice';

export const getMyWallets = async () => {
	try {
		const res = await api.get<WalletSnapshot[]>('/wallet');
		return res.data;
	} catch (err) {}
};
