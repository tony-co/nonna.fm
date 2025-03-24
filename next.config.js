/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "cdn-images.dzcdn.net",
      "static.thenounproject.com",
      "i.scdn.co",
      "mosaic.scdn.co",
      "api.music.apple.com",
      "is1-ssl.mzstatic.com",
      "is2-ssl.mzstatic.com",
      "is3-ssl.mzstatic.com",
      "is4-ssl.mzstatic.com",
      "is5-ssl.mzstatic.com",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "is*.mzstatic.com",
        pathname: "/image/**",
      },
      {
        protocol: "https",
        hostname: "*.spotifycdn.com",
        pathname: "/image/**",
      },
      {
        protocol: "https",
        hostname: "*.ytimg.com",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;
