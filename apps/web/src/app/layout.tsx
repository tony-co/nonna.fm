import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Nonna.fm",
  description: "Transfer your music library between streaming services seamlessly",
  metadataBase: new URL("https://nonna.fm"),
  icons: {
    icon: [
      { url: "/favicons/favicon.svg", type: "image/svg+xml" },
      { url: "/favicons/favicon.ico", type: "image/x-icon" },
    ],
    apple: [{ url: "/favicons/apple-touch-icon.png", type: "image/png" }],
    other: [
      { url: "/favicons/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/favicons/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    ],
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Nonna.fm",
  },
  applicationName: "Nonna.fm",
};

export const viewport: Viewport = {
  themeColor: "#4F46E5",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

// Minimal root layout - locale-specific layout is in [locale]/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
