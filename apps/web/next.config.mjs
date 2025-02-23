import { fileURLToPath } from "node:url";
import { withSentryConfig } from "@sentry/nextjs";
import { withAxiom } from "next-axiom";
import nextMdx from "@next/mdx";
import { createJiti } from "jiti";
import withSerwistInit from "@serwist/next";
import bundleAnalyzerPkg from "@next/bundle-analyzer";


const jiti = createJiti(fileURLToPath(import.meta.url));

// Import env here to validate during build. Using jiti we can import .ts files :)
await jiti.import("./env");

const withMDX = nextMdx();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverComponentsExternalPackages: ["@sentry/nextjs", "@sentry/node"],
    turbo: {
      rules: {
        "*.svg": {
          loaders: ["@svgr/webpack"],
          as: "*.js",
        },
      },
    },
  },
  pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"],
  images: {
    remotePatterns: [
      // Existing domains
      {
        protocol: "https",
        hostname: "pbs.twimg.com",
      },
      {
        protocol: "https",
        hostname: "ph-avatars.imgix.net",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
      // New domains for GitHub / shields.io images
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "github.com",
      },
      {
        protocol: "https",
        hostname: "img.shields.io",
      },
      {
        protocol: "https",
        hostname: "user-images.githubusercontent.com",
      },
    ],
  },
  async redirects() {
    // Removed all /automation + InboxZero references, kept newsletters → bulk-unsubscribe
    return [
      {
        source: "/newsletters",
        destination: "/bulk-unsubscribe",
        permanent: false,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/ingest/:path*",
        destination: "https://app.posthog.com/:path*",
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
        ],
      },
    ];
  },
};

const sentryOptions = {
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options
  silent: true,
  org: process.env.SENTRY_ORGANIZATION,
  project: process.env.SENTRY_PROJECT,
};

const sentryConfig = {
  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/
  widenClientFileUpload: true,
  transpileClientSDK: true,
  tunnelRoute: "/monitoring",
  hideSourceMaps: true,
  disableLogger: true,
  automaticVercelMonitors: true,
};

const mdxConfig = withMDX(nextConfig);

const useSentry =
  process.env.NEXT_PUBLIC_SENTRY_DSN &&
  process.env.SENTRY_ORGANIZATION &&
  process.env.SENTRY_PROJECT;

const exportConfig = useSentry
  ? withSentryConfig(mdxConfig, { ...sentryOptions, ...sentryConfig })
  : mdxConfig;

const withSerwist = withSerwistInit({
  swSrc: "app/sw.ts",
  swDest: "public/sw.js",
});

const withBundleAnalyzer = bundleAnalyzerPkg({
  enabled: process.env.ANALYZE === "true",
});

// ✅ Use `export default` instead of `module.exports`
export default withAxiom(withSerwist(withBundleAnalyzer(exportConfig)));