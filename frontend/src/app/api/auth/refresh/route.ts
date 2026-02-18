// import { cookies } from 'next/headers';
// import { NextResponse } from 'next/server';

// export async function GET() {
// 	const cookieStore = await cookies();
// 	// const res = await fetch(`${process.env.API_URL}/auth/refresh`, {
// 	// 	headers: {
// 	// 		Cookie: cookieStore.toString(),
// 	// 	},
// 	// 	cache: 'no-store',
// 	// });

// 	// if (!res.ok) {
// 	// 	return NextResponse.json(null, { status: 401 });
// 	// }

// 	const nextRes = new NextResponse(null, {
// 		status: 200,
// 	});

// 	// const setCookie = res.headers.get('set-cookie');

// 	// if (setCookie) {
// 	// 	nextRes.headers.set('set-cookie', setCookie);
// 	// }

// 	nextRes.cookies.set('hello', 'hello', { httpOnly: true, path: '/' });
// 	return nextRes;
// }

import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
	const res = NextResponse.json({ ok: true });

	// res.cookies.set('hello', 'hello', {
	// 	path: '/',
	// 	httpOnly: false, // для теста
	// 	sameSite: 'none',
	// });

	const cookieStore = await cookies();

	cookieStore.set('hello', 'hello');

	return res;
}
