/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "gzgotsfnpkhaaglhvzgx.supabase.co",
				port: "",
				pathname: "/storage/v1/object/public/cabin-images/**",
			},
		],
	},
	experimental: {
		appDir: true,
	},
};

export default nextConfig;
