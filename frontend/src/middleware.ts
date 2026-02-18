import { NextRequest, NextResponse } from 'next/server';

const PROTECTED_PATHS: Array<string | null> = [];

export async function middleware(req: NextRequest) {
	const { pathname } = req.nextUrl;

	if (
		!PROTECTED_PATHS.some(
			(path) => pathname.startsWith(path) && PROTECTED_PATHS.length !== 0,
		)
	) {
		return NextResponse.next();
	}

	const accessToken = req.cookies.get('access_token')?.value;
	const refreshToken = req.cookies.get('refresh_token')?.value;

	// ❌ нет refresh → сразу на логин
	if (!refreshToken) {
		return redirectToLogin(req);
	}

	// ✅ access есть → считаем, чтоx всё ок
	if (accessToken) {
		return NextResponse.next();
	}

	// 🔄 access нет → пробуем refresh
	try {
		const refreshRes = await fetch(`${process.env.API_URL}/auth/refresh`, {
			method: 'GET',
			headers: {
				Cookie: `refresh_token=${refreshToken}`,
			},
		});

		if (!refreshRes.ok) {
			return redirectToLogin(req);
		}
		const res = NextResponse.next();

		const setCookie = refreshRes.headers.get('set-cookie');
		if (setCookie) {
			res.headers.set('set-cookie', setCookie);
		}

		return res;
	} catch {
		return redirectToLogin(req);
	}
}

function redirectToLogin(req: NextRequest) {
	const url = req.nextUrl.clone();
	url.pathname = '/';
	url.searchParams.set('from', req.nextUrl.pathname);

	const res = NextResponse.redirect(url);

	// 🧹 чистим cookies
	res.cookies.delete('access_token');
	res.cookies.delete('refresh_token');

	return res;
}

export const config = {
	matcher: ['/((?!api|_next|static|favicon.ico).*)'],
};
