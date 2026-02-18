import { api } from '@/shared/lib/api/axios';
import axios from 'axios';
import { headers } from 'next/headers';

export async function getCurrentUser() {
	const headersList = await headers();
	const cookie = headersList.get('cookie');

	if (!cookie) return null;

	try {
		const res = await api.get(`${process.env.API_URL}/auth/me`, {
			headers: {
				Cookie: cookie,
			},
		});

		console.log(res, 'res');
		return res.data ?? null;
	} catch {
		console.log('res-error');

		// ❗ 401 / expired access = НОРМА
		return null;
	}
}
