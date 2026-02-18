'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
// import { checkAuth } from '@/shared/lib/redux/authSlice';

export default function AuthSuccessPage() {
	const router = useRouter();
	const dispatch = useDispatch<any>();

	// useEffect(() => {
	// 	// The backend set the cookies. Now we fetch /auth/me to update Redux.
	// 	dispatch(checkAuth())
	// 		.unwrap()
	// 		.then(() => router.push('/dashboard')) // Redirect to protected area
	// 		.catch(() => router.push('/?error=google_failed'));
	// }, [dispatch, router]);

	return <div>Securely logging you in...</div>;
}
