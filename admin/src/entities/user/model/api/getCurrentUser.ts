import { api } from '@/shared/lib/api/axios';
// import { headers } from 'next/headers';

export async function getCurrentUser() {
	// const headersList = await headers();
	// const cookie = headersList.get('cookie');

	// if (!cookie) return null;

	try {
		const res = await api.get(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
			// headers: {
			// 	Cookie: cookie,
			// },
			withCredentials: true,
		});

		return res.data ?? null;
	} catch {
		console.log('res-error');

		return null;
	}
}
