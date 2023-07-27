/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'www.sportsbase.io',
                port: '',
                pathname: '/images/**'
            }
        ]
    }
}

module.exports = nextConfig