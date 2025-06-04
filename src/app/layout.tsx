import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  metadataBase: new URL('https://abdoraquibi.icu'),
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
    url: "https://abdoraquibi.icu",
    siteName: "Abdo Raquibi Portfolio",
    locale: "en_US",
    type: "website",
    images: [{
      url: "https://abdoraquibi.icu/abderrahmaneraquibi.jpg",
      width: 1200,
      height: 630,
      alt: "Abdo Raquibi | Full-Stack Web Developer Portfolio",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Abdo Raquibi | Full-Stack Web Developer Portfolio",
    description: "Full-stack developer specializing in Laravel, React, and Next.js",
    images: ["https://abdoraquibi.icu/abderrahmaneraquibi.jpg"],
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
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
        <meta name="author" content="Abderrahmane Raquibi" />
        <meta name="copyright" content="© 2025 Abderrahmane Raquibi" />
        <meta property="og:image" content="/abderrahmaneraquibi.jpg" />
        <meta name="theme-color" content="#0f172a" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "name": "Abderrahmane Raquibi",
              "alternateName": "Abdo Raquibi",
              "url": "https://abdoraquibi.icu",
              "jobTitle": "Full-Stack Web Developer",
              "sameAs": [
                "https://github.com/raquibiabderrahmane",
                "https://instagram.com/abderrahmaneraquibi1",
                "https://www.linkedin.com/in/abderrahmaneraquibi"
              ],
              "image": "https://abdoraquibi.icu/abderrahmaneraquibi.jpg",
              "description": "Moroccan full-stack developer & entrepreneur specialized in Laravel, React, and SaaS platforms.",
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "url": "https://abdoraquibi.icu",
              "name": "Abdo Raquibi Portfolio",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://abdoraquibi.icu/search?q={search_term_string}",
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />

      </head>
      <body className={inter.className}>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-KDDQ6RLX"
            height="0"
            width="0"
            style={{
              display: 'none',
              visibility: 'hidden'
            }}
          />
        </noscript>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "name": "Abderrahmane Raquibi",
              "url": "https://abdoraquibi.icu",
              "image": "https://fr.wikipedia.org/wiki/Abderrahmane_Raquibi#/media/Fichier:Abderrahmane_Raquibi_at_GITEX_Africa_2025.jpg",
              "sameAs": [
                "https://fr.wikipedia.org/wiki/Abderrahmane_Raquibi",
                "https://www.linkedin.com/in/abderrahmaneraquibi",
                "https://github.com/Raquibiabderrahmane"
              ],
              "jobTitle": "Développeur web",
              "nationality": "MA"
            }),
          }}
        />


      </body>
    </html>
  );
}