/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "cdn-images.dzcdn.net", // Deezer images
      "i.scdn.co", // Spotify images
      "mosaic.scdn.co", // Spotify images
      "api.music.apple.com", // Apple Music images
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "is*.mzstatic.com", // Apple Music images
        pathname: "/image/**",
      },
      {
        protocol: "https",
        hostname: "*.blobstore.apple.com", // Apple Music images (user uploaded)
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.spotifycdn.com", // Spotify images
        pathname: "/image/**",
      },
      {
        protocol: "https",
        hostname: "*.ytimg.com", // YouTube images
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;
