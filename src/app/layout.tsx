import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono, Noto_Sans_Arabic } from "next/font/google";
import { siteConfig } from "@/config/site";
import { AuroraBackground } from "@/components/visuals/AuroraBackground";
import { CursorGlow } from "@/components/visuals/CursorGlow";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Chatbot } from "@/components/layout/Chatbot";
import { PageTransition } from "@/components/layout/PageTransition";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { LanguageProvider } from "@/i18n/LanguageContext";
import {
  buildOrganizationJsonLd,
  buildPersonJsonLd,
  buildWebsiteJsonLd,
  siteKeywords,
} from "@/lib/seo";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const grotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-grotesk",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const notoArabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  variable: "--font-arabic",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const defaultTitle = `${siteConfig.name} | ${siteConfig.nameAr} — Front-End Developer & Graphic Designer`;
const defaultDescription = `${siteConfig.description} ${siteConfig.descriptionAr}`;

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: defaultTitle,
    template: `%s | ${siteConfig.name}`,
  },
  applicationName: `${siteConfig.name} Portfolio`,
  description: defaultDescription,
  keywords: siteKeywords,
  authors: [{ name: siteConfig.author.name, url: siteConfig.url }],
  creator: siteConfig.author.name,
  publisher: siteConfig.author.name,
  manifest: "/manifest.webmanifest",
  referrer: "origin-when-cross-origin",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: siteConfig.logo, type: "image/svg+xml" },
    ],
    shortcut: ["/favicon.ico"],
    apple: [{ url: siteConfig.logo }],
  },
  alternates: {
    canonical: siteConfig.url,
    languages: {
      "en-US": siteConfig.url,
      "ar-EG": siteConfig.url,
    },
  },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    alternateLocale: [siteConfig.localeAr],
    url: siteConfig.url,
    title: defaultTitle,
    description: defaultDescription,
    siteName: `${siteConfig.name} | ${siteConfig.nameAr}`,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: defaultTitle,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDescription,
    images: [siteConfig.ogImage],
    creator: siteConfig.seo.socialHandle,
    site: siteConfig.seo.socialHandle,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "technology",
  classification: "Portfolio",
};

export const viewport: Viewport = {
  themeColor: "#030303",
  width: "device-width",
  initialScale: 1,
};

const personJsonLd = buildPersonJsonLd();
const organizationJsonLd = buildOrganizationJsonLd();
const websiteJsonLd = buildWebsiteJsonLd();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${grotesk.variable} ${mono.variable} ${notoArabic.variable} dark`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body
        className="relative min-h-dvh max-w-[100vw] overflow-x-hidden bg-base text-white antialiased"
        suppressHydrationWarning
      >
        <LanguageProvider>
          <SmoothScroll />
          <ScrollProgress />
          <AuroraBackground />
          <CursorGlow />

          <Navbar />

          <PageTransition>
            <main className="relative z-10 max-w-[100vw] overflow-x-hidden">{children}</main>
          </PageTransition>

          <Footer />
          <Chatbot />
        </LanguageProvider>
      </body>
    </html>
  );
}
