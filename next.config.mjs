/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'firebasestorage.googleapis.com',
          pathname: '/v0/b/**', // ✅ Allows all Firebase Storage paths
        },
        {
          protocol: 'https',
          hostname: "manga-gg.com",
        },
        {
          protocol: 'https',
          hostname: "www.anime-sugoi.com",
        },
        {
          protocol: 'https',
          hostname: "mangaara.*",
        },
        {
          protocol: 'https',
          hostname: "manga.cipacmeeting.com",
        }
      ],
    },
  };

export default nextConfig;
