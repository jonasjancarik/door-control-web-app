import { join } from 'path';
import withPWA from 'next-pwa';

/** @type {import('next').NextConfig} */
const nextConfig = withPWA({
    dest: 'public',
    disable: process.env.NODE_ENV === 'development',
})({
    output: 'export',
    env: {
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
        NEXT_PUBLIC_WEB_APP_TITLE: process.env.NEXT_PUBLIC_WEB_APP_TITLE,
        NEXT_PUBLIC_WEB_APP_SUBTITLE: process.env.NEXT_PUBLIC_WEB_APP_SUBTITLE,
        NEXT_PUBLIC_WEB_APP_PORT: process.env.NEXT_PUBLIC_WEB_APP_PORT,
        NEXT_SENDER_EMAIL: process.env.NEXT_SENDER_EMAIL,
    },
});

export default nextConfig;
