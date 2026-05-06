import createMDX from "@next/mdx";

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["ts", "tsx", "mdx"],
  reactStrictMode: true,
  // Strip the X-Powered-By header to shave a few bytes off every response.
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  compiler: {
    // Drop console.* (except error/warn) from the production bundle to save bytes and main-thread time.
    removeConsole:
      process.env.NODE_ENV === "production"
        ? { exclude: ["error", "warn"] }
        : false,
  },
  async redirects() {
    return [
      {
        source: "/favicon.ico",
        destination: "/favicon_io/favicon.ico",
        permanent: true,
      },
      {
        source: "/yasa-jaber-logo.ico",
        destination: "/favicon_io/favicon.ico",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        // Cache the hero/LCP image aggressively in the browser; Next already long-caches /_next/static.
        source: "/yasa-jaber-hero.jpg",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "cdn.jsdelivr.net" },
      { protocol: "https", hostname: "image.thum.io" },
      { protocol: "https", hostname: "raw.githubusercontent.com" },
    ],
  },
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "react-icons",
      "framer-motion",
      "gsap",
      "@vercel/analytics",
    ],
  },
};

// Use string-based plugin references so Turbopack can serialize them.
const withMDX = createMDX({
  options: {
    remarkPlugins: [["remark-gfm"]],
    rehypePlugins: [
      [
        "rehype-pretty-code",
        {
          theme: { dark: "github-dark", light: "github-light" },
          keepBackground: false,
        },
      ],
    ],
  },
});

export default withMDX(nextConfig);
