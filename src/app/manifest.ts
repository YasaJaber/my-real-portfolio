import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${siteConfig.name} | ${siteConfig.nameAr}`,
    short_name: siteConfig.shortName,
    description: `${siteConfig.description} ${siteConfig.descriptionAr}`,
    start_url: "/",
    display: "standalone",
    background_color: "#030303",
    theme_color: "#030303",
    lang: "en",
    dir: "auto",
    categories: ["portfolio", "developer", "technology", "blog"],
    icons: [
      {
        src: "/favicon_io/favicon.ico",
        sizes: "16x16 32x32 48x48",
        type: "image/x-icon",
      },
      {
        src: "/favicon_io/favicon-16x16.png",
        sizes: "16x16",
        type: "image/png",
      },
      {
        src: "/favicon_io/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: "/favicon_io/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
      {
        src: "/favicon_io/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/favicon_io/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/yasaJaberLogo.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
