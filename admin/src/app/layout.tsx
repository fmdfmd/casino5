import localFont from 'next/font/local';

import '../shared/styles/globals.scss';

import '@mantine/core/styles.css';

import {
	ColorSchemeScript,
	MantineProvider,
	mantineHtmlProps,
} from '@mantine/core';
import StoreProvider from '@/shared/lib/redux/store-provider';
import { cookies } from 'next/headers';
import { getServerUser } from '@/entities/user/model/api/getServerUser';

// --- ШРИФТЫ ---
const proximaNova = localFont({
	src: [
		{
			path: '../../public/assets/fonts/ProximaNova/ProximaNovaBold/ProximaNovaBold.ttf',
			weight: '700',
			style: 'normal',
		},
		{
			path: '../../public/assets/fonts/ProximaNova/ProximaNovaRegular/ProximaNovaRegular.ttf',
			weight: '400',
			style: 'normal',
		},
	],
	variable: '--font-proxima-nova',
	display: 'swap',
});

const openSans = localFont({
	src: [
		{
			path: '../../public/assets/fonts/OpenSans/static/OpenSans-Regular.ttf',
			weight: '400',
			style: 'normal',
		},
		{
			path: '../../public/assets/fonts/OpenSans/static/OpenSans-SemiBold.ttf',
			weight: '600',
			style: 'normal',
		},
		{
			path: '../../public/assets/fonts/OpenSans/static/OpenSans-Bold.ttf',
			weight: '700',
			style: 'normal',
		},
		{
			path: '../../public/assets/fonts/OpenSans/static/OpenSans-ExtraBold.ttf',
			weight: '800',
			style: 'normal',
		},
	],
	variable: '--font-open-sans',
	display: 'swap',
});

const roboto = localFont({
	src: [
		{
			path: '../../public/assets/fonts/Roboto/static/Roboto-Regular.ttf',
			weight: '400',
			style: 'normal',
		},
		{
			path: '../../public/assets/fonts/Roboto/static/Roboto-SemiBold.ttf',
			weight: '600',
			style: 'normal',
		},
		{
			path: '../../public/assets/fonts/Roboto/static/Roboto-Bold.ttf',
			weight: '700',
			style: 'normal',
		},
		{
			path: '../../public/assets/fonts/Roboto/static/Roboto-ExtraBold.ttf',
			weight: '800',
			style: 'normal',
		},
		{
			path: '../../public/assets/fonts/Roboto/static/Roboto-Medium.ttf',
			weight: '500',
			style: 'normal',
		},
	],
	variable: '--font-roboto',
	display: 'swap',
});

const sanFranciscoProDisplay = localFont({
	src: [
		{
			path: '../../public/assets/fonts/SanFranciscoProDisplay/SF-Pro-Display-Semibold.otf',
			weight: '600',
			style: 'normal',
		},
		{
			path: '../../public/assets/fonts/SanFranciscoProDisplay/SF-Pro-Display-Bold.otf',
			weight: '700',
			style: 'normal',
		},
	],
	variable: '--font-sf-pro-display',
	display: 'swap',
});

const inter = localFont({
	src: [
		{
			path: '../../public/assets/fonts/Inter/static/Inter_18pt-Regular.ttf',
			weight: '400',
			style: 'normal',
		},
		{
			path: '../../public/assets/fonts/Inter/static/Inter_18pt-ExtraBold.ttf',
			weight: '800',
			style: 'normal',
		},
	],
	variable: '--font-inter',
	display: 'swap',
});

const arial = localFont({
	src: [
		{
			path: '../../public/assets/fonts/arial/arial-regular.ttf',
			weight: '400',
			style: 'normal',
		},
	],
	variable: '--font-arial',
	display: 'swap',
});

const tahoma = localFont({
	src: [
		{
			path: '../../public/assets/fonts/Tahoma/tahoma-regular.ttf',
			weight: '400',
			style: 'normal',
		},
	],
	variable: '--font-tahoma',
	display: 'swap',
});

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const cookiesStore = await cookies();

	let user = null;

	if (cookiesStore.get('refresh_token')) {
		user = await getServerUser();
	}

	return (
		<html lang='en' {...mantineHtmlProps}>
			<head>
				<ColorSchemeScript />
			</head>
			<body
				className={`${proximaNova.variable} ${openSans.variable} ${roboto.variable} ${sanFranciscoProDisplay.variable} ${inter.variable} ${arial.variable} ${tahoma.variable}`}
			>
				<StoreProvider user={user}>
					<MantineProvider defaultColorScheme='dark'>
						{children}
					</MantineProvider>
				</StoreProvider>
			</body>
		</html>
	);
}
