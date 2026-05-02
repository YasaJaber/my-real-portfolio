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
        src: "/favicon.ico",
        sizes: "16x16 32x32 48x48",
        type: "image/x-icon",
      },
      {
        src: "/yasaJaberLogo.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
