import type { Metadata, Viewport } from "next";
import { Inter, Space_Mono } from "next/font/google";
import "./globals.css";
import PWAProvider from "@/components/PWAProvider";
import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes';

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  weight: ["400", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vexl Ambassador Portal - P2P Bitcoin Revolution",
  description: "Your gateway to spreading the P2P Bitcoin revolution. Create presentations, engage your community, and build the future of decentralized trading.",
  applicationName: "Vexl Portal",
  authors: [{ name: "Vexl Team" }],
  generator: "Next.js",
  keywords: ["bitcoin", "p2p", "trading", "vexl", "cryptocurrency", "decentralized", "ambassador"],
  referrer: "origin-when-cross-origin",
  themeColor: "#FCEE0A",
  colorScheme: "dark",
  creator: "Vexl",
  publisher: "Vexl",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://portal.vexl.it"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Vexl Ambassador Portal",
    description: "Spread the P2P Bitcoin revolution",
    url: "https://portal.vexl.it",
    siteName: "Vexl Portal",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Vexl Ambassador Portal",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vexl Ambassador Portal",
    description: "Your gateway to spreading the P2P Bitcoin revolution",
    images: ["/twitter-image.png"],
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/icon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-icon.png" },
      { url: "/apple-icon-180x180.png", sizes: "180x180" },
    ],
    other: [
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg",
      },
    ],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#FCEE0A",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceMono.variable}`}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Vexl Portal" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="antialiased font-sans bg-black text-white">
        <ClerkProvider
          appearance={{
            baseTheme: dark,
            variables: {
              colorPrimary: '#FCEE0A',
              colorBackground: '#000000',
              colorText: '#FFFFFF',
            },
            elements: {
              formButtonPrimary: 'bg-yellow-400 hover:bg-yellow-500 text-black',
              card: 'bg-gray-900 border-gray-800',
            }
          }}
        >
          <PWAProvider>
            {children}
          </PWAProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
