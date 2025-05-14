import { withSentryConfig } from "@sentry/nextjs";

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

export default withSentryConfig(nextConfig, {
  // For all available options, see:
  // https://www.npmjs.com/package/@sentry/webpack-plugin#options

  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  tunnelRoute: "/monitoring",

  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: true,

  // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
  // See the following for more information:
  // https://docs.sentry.io/product/crons/
  // https://vercel.com/docs/cron-jobs
  automaticVercelMonitors: true,
});
