import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      ...["cdn-images.dzcdn.net", "i.scdn.co", "mosaic.scdn.co", "api.music.apple.com"].map(
        hostname => ({ protocol: "https", hostname })
      ),
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

export default withNextIntl(nextConfig);
