import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn-media-0.freecodecamp.org',
          port: "", // <-- optional but sometimes needed
        pathname: "/**"
      },
      {
        protocol: "https",
        hostname: "www.bigdatawire.com",
        pathname: "/**", // add this new hostname
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com", // <-- added this line
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com", // for the fallback avatar
        pathname: "/**",
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        pathname: '/**', // <-- add this for GitHub avatars
      },
      {
        protocol: "https",
        hostname: "apiumhub.com",
        pathname: "/**",
      },

    ],
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/home',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
