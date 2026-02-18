'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/shared/lib/redux/hooks';
import { fetchMe } from '@/shared/lib/redux/authSlice';

export default function AuthInit() {
	const dispatch = useAppDispatch();
	const initialized = useAppSelector((s) => s.auth.initialized);

	useEffect(() => {
		if (!initialized) {
			console.log('initialized-2');
			dispatch(fetchMe());
		}
	}, [initialized, dispatch]);

	return null;
}
