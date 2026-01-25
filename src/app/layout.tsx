import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import Script from "next/script";
import { CyberBackground } from "@/components/CyberBackground";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  metadataBase: new URL('https://raquibi.com'),
  icons: {
    icon: "/favicon.ico"
  },
  title: {
    default: "Abdo Raquibi | Full-Stack Web Developer Portfolio",
    template: "%s | Abdo Raquibi"
  },
  description: "Hi, I'm Abderrahmane Raquibi — a full-stack developer building modern, fast, and scalable web apps with Laravel, React, and Next.js. Let's build something great together!",
  keywords: [
    "abdo",
    "raquibi",
    "abderrahmane raquibi",
    "abderrahmane",
    "raquibi abderrahmane",
    "abderrahmane raquibi portfolio",
    "abdo raquibi portfolio",
    "Abdo Raquibi",
    "Full-Stack Developer",
    "Laravel Developer",
    "React Developer",
    "Next.js Portfolio",
    "Morocco Developer",
    "SaaS Developer",
    "Tailwind CSS",
    "Web Development",
    "Software Engineer",
  ].join(", "),
  authors: [{ name: "Abderrahmane Raquibi" }],
  creator: "Abderrahmane Raquibi",
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  openGraph: {
    title: "Abdo Raquibi | Full-Stack Web Developer Portfolio",
    description: "Full-stack developer specializing in Laravel, React, and Next.js. Building modern web applications with a focus on performance and user experience.",
    url: "https://raquibi.com",
    siteName: "Abdo Raquibi Portfolio",
    locale: "en_US",
    type: "website",
    images: [{
      url: "https://raquibi.com/abderrahmaneraquibi.jpg",
      width: 1200,
      height: 630,
      alt: "Abdo Raquibi | Full-Stack Web Developer Portfolio",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Abdo Raquibi | Full-Stack Web Developer Portfolio",
    description: "Full-stack developer specializing in Laravel, React, and Next.js",
    images: ["https://raquibi.com/abderrahmaneraquibi.jpg"],
    creator: "@ceo_raquibi",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Abdo Raquibi',
  },
  formatDetection: {
    telephone: false,
  },
};

import PWAInstaller from "@/components/PWAInstaller";
import { NotificationManager } from "@/components/NotificationManager";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "name": "Abderrahmane Raquibi",
              "alternateName": "Abdo Raquibi",
              "url": "https://raquibi.com",
              "jobTitle": "Full-Stack Web Developer",
              "sameAs": [
                "https://github.com/raquibiabderrahmane",
                "https://instagram.com/abderrahmaneraquibi1",
                "https://www.linkedin.com/in/abderrahmaneraquibi"
              ],
              "image": "https://raquibi.com/abderrahmaneraquibi.jpg",
              "description": "Moroccan full-stack developer & entrepreneur specialized in Laravel, React, and SaaS platforms.",
            }),
          }}
        />
        <script
          async
          crossOrigin="anonymous"
          src="https://tweakcn.com/live-preview.min.js"
        />
      </head>
      <body className={inter.className}>
        <PWAInstaller />
        <NotificationManager />
        {children}
      </body>
    </html>
  );
}
