import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

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

  openGraph: {
    title: "Abdo Raquibi | Full-Stack Web Developer Portfolio",
    description: "Full-stack developer specializing in Laravel, React, and Next.js. Building modern web applications with a focus on performance and user experience.",
    url: "https://raquibi.com",
    siteName: "Abdo Raquibi Portfolio",
    locale: "en_US",
    type: "website",
    images: [{
      url: "/api/og",
      width: 1200,
      height: 630,
      alt: "Abdo Raquibi | Full-Stack Web Developer Portfolio",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Abdo Raquibi | Full-Stack Web Developer Portfolio",
    description: "Full-stack developer specializing in Laravel, React, and Next.js",
    images: ["/api/og"],
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
import { AnalyticsTracker } from "@/components/AnalyticsTracker";
import { PageLoader } from "@/components/PageLoader";

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
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-KDDQ6RLX');
          `}
        </Script>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-CQ4F903N9X"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-CQ4F903N9X');
          `}
        </Script>
      </head>
      <body className={inter.className}>
        <PageLoader />
        <PWAInstaller />
        <NotificationManager />
        <AnalyticsTracker />
        {children}

        {/* ElevenLabs ConvAI Widget */}
        {/* <div
          dangerouslySetInnerHTML={{
            __html: '<elevenlabs-convai agent-id="agent_1301k4n2f78kf7q8wzz0m7n9mdee"></elevenlabs-convai>'
          }}
        />
        <Script
          src="https://unpkg.com/@elevenlabs/convai-widget-embed"
          strategy="afterInteractive"
        /> */}
      </body>
    </html>
  );
}
