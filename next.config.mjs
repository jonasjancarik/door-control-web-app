/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    env: {
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
        NEXT_PUBLIC_WEB_APP_TITLE: process.env.NEXT_PUBLIC_WEB_APP_TITLE,
        NEXT_PUBLIC_WEB_APP_SUBTITLE: process.env.NEXT_PUBLIC_WEB_APP_SUBTITLE,
        NEXT_PUBLIC_WEB_APP_PORT: process.env.NEXT_PUBLIC_WEB_APP_PORT,
    },
};

export default nextConfig;