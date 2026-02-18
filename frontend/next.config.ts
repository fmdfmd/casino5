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
				hostname: 'localhost:8000',
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
