'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '@/shared/lib/redux/store';
import { logout } from '@/shared/lib/redux/authSlice';

export default function Dashboard() {
	const { user, isAuthenticated, loading } = useSelector(
		(state: RootState) => state.auth
	);
	const dispatch = useDispatch<AppDispatch>();
	const router = useRouter();

	useEffect(() => {
		if (!loading && !isAuthenticated) {
			router.push('/');
		}
	}, [loading, isAuthenticated, router]);

	if (loading) return <div>Loading...</div>;
	if (!user) return null;

	return (
		<div style={{ padding: 40 }}>
			<h1>Welcome {user.email}</h1>
			<button onClick={() => dispatch(logout())}>Logout</button>
		</div>
	);
}
