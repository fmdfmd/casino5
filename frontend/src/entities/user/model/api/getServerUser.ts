import { cookies } from 'next/headers';

export async function getServerUser() {
	const cookieStore = await cookies();
	const cookieHeader = cookieStore.toString();

	try {
		const res = await fetch(`${process.env.API_URL}/auth/me`, {
			headers: { Cookie: cookieHeader },
			cache: 'no-store',
		});

		if (res.ok) {
			return await res.json();
		}

		if (res.status !== 401) {
			return null;
		}

		// access token expired → пробуем refresh
		const refreshRes = await fetch(`${process.env.API_URL}/auth/refresh`, {
			headers: { Cookie: cookieHeader },
			cache: 'no-store',
		});

		if (!refreshRes.ok) {
			// refresh token invalid / expired
			return null;
		}

		const setCookie = refreshRes.headers.get('set-cookie');
		if (!setCookie) {
			return null;
		}

		const retry = await fetch(`${process.env.API_URL}/auth/me`, {
			headers: { Cookie: setCookie },
			cache: 'no-store',
		});

		if (!retry.ok) {
			return null;
		}

		return await retry.json();
	} catch {
		return null;
	}
}
