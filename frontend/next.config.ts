import type { NextConfig } from 'next';
import path from 'path';

const sassOptions = {
	includePaths: [path.join(__dirname, 'styles')],
	prependData: "@use '@/shared/styles/main' as *;",
};

const nextConfig: NextConfig = {
	reactStrictMode: false,
	reactCompiler: true,
	typescript: { ignoreBuildErrors: true },
	// turbopack: {
	// 	resolveAlias: {
	// 		'@styles/*': 'src/styles/*',
	// 	},
	// },
	sassOptions: {
		...sassOptions,
	},

	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'lh3.googleusercontent.com',
			},
			{
				protocol: 'http',
				hostname: process.env.NEXT_PUBLIC_API_URL!,
				pathname: '/currenciesIcons',
			},
			{
				protocol: 'https',
				hostname: 'static.cdneu-stat.com',
			},
		],
	},
};

export default nextConfig;
