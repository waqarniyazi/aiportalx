import type { Metadata } from "next";
import { Suspense } from "react";
import { Analytics } from "@vercel/analytics/react";
import { AxiomWebVitals } from "next-axiom";
import { GoogleTagManager } from "@next/third-parties/google";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "../styles/globals.css";
import { PostHogPageview, PostHogProvider } from "@/providers/PostHogProvider";
import { env } from "@/env";
import { GlobalProviders } from "@/providers/GlobalProviders";
import { UTM } from "@/app/utm";
import { startupImage } from "@/app/startup-image";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  preload: true,
  display: "swap",
});
const calFont = localFont({
  src: "../styles/CalSans-SemiBold.woff2",
  variable: "--font-cal",
  preload: true,
  display: "swap",
});

const title = "AIPortalX | AI Models Repo";
const description =
  "Get 4,00,000+ AI Models from all domains in one place. Filter them according to your needs and try them in our dedicated playground.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    siteName: "AIPortalX",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    creator: "@niyaziwaqar",
  },
  metadataBase: new URL(env.NEXT_PUBLIC_BASE_URL),
  // issues with robots.txt: https://github.com/vercel/next.js/issues/58615#issuecomment-1852457285
  robots: {
    index: true,
    follow: true,
  },
  // pwa
  applicationName: "AIPortalX",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "AIPortalX",
    startupImage,
  },
  formatDetection: {
    telephone: false,
  },
  // safe area for iOS PWA
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "white-translucent",
  },
};

export const viewport = {
  themeColor: "#FFF",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`h-full ${inter.variable} ${calFont.variable} font-sans antialiased`}
      >
        <PostHogProvider>
          <Suspense>
            <PostHogPageview />
          </Suspense>
          <GlobalProviders>{children}</GlobalProviders>
        </PostHogProvider>
        <Analytics />
        <AxiomWebVitals />
        <UTM />
        {env.NEXT_PUBLIC_GTM_ID ? (
          <GoogleTagManager gtmId={env.NEXT_PUBLIC_GTM_ID} />
        ) : null}
      </body>
    </html>
  );
}
