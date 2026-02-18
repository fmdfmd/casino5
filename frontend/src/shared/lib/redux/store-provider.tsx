'use client';

import { useRef } from 'react';
import { Provider } from 'react-redux';
import { makeStore, AppStore } from './store';
import { setUser } from '@/entities/user/model/slice';

export default function StoreProvider({
	user,
	children,
}: {
	user: any | null;
	children: React.ReactNode;
}) {
	const storeRef = useRef<AppStore | null>(null);

	if (!storeRef.current) {
		storeRef.current = makeStore();

		if (user) {
			storeRef.current.dispatch(setUser(user));
		}
	}

	return <Provider store={storeRef.current}>{children}</Provider>;
}
