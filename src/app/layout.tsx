import type { Metadata } from "next";
import "./globals.css";
import { Inter, Calistoga } from "next/font/google";
import { twMerge } from "tailwind-merge";
import Image from "next/image";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const calistoga = Calistoga({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://abdoraquibi.icu'),
  title: {
    default: "Abdo Raquibi | Full-Stack Web Developer Portfolio",
    template: "%s | Abdo Raquibi"
  },
  description:
    "Hi, I'm Abderrahmane Raquibi — a full-stack developer building modern, fast, and scalable web apps with Laravel, React, and Next.js. Let's build something great together!",
  keywords: [
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
    "Full Stack Engineer",
    "Web Applications",
    "Portfolio Website"
  ].join(", "),
  authors: [{ name: "Abderrahmane Raquibi" }],
  creator: "Abderrahmane Raquibi",
  publisher: "Abderrahmane Raquibi",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Abdo Raquibi | Full-Stack Web Developer Portfolio",
    description:
      "Dive into the portfolio of Abderrahmane Raquibi, showcasing expertise in full-stack development, modern web technologies, and innovative project solutions.",
    url: "https://abdoraquibi.icu/",
    siteName: "Abdo Raquibi Portfolio",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://abdoraquibi.icu/abderrahmaneraquibi.jpg",
        width: 1200,
        height: 630,
        alt: "Abdo Raquibi | Full-Stack Web Developer Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Abdo Raquibi | Full-Stack Web Developer Portfolio",
    description: "Full-stack developer specializing in Laravel, React, and Next.js. Building modern web applications with a focus on performance and user experience.",
    images: ["https://abdoraquibi.icu/abderrahmaneraquibi.jpg"],
    creator: "@ceo_raquibi",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  other: {
    "facebook-domain-verification": "l0j97svsueiuplxttmp216u4ks798j",
  },
  alternates: {
    canonical: "https://abdoraquibi.icu",
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
  verification: {
    google: "your-google-site-verification", // Add your Google Search Console verification code
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <meta name="author" content="Abderrahmane Raquibi" />
        <meta name="copyright" content="© 2025 Abderrahmane Raquibi" />
        <meta property="og:image" content="/abderrahmaneraquibi.jpg" />
        <meta name="theme-color" content="#0f172a" />
      </head>
      <body
        className={`${inter.variable} ${calistoga.variable} bg-gray-900 text-white antialiased font-sans scrollbar`}
      >
        {children}
        <a
          href="https://www.buymeacoffee.com/RAQUIBI"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-4 right-4 z-50"
        >
          <Image
            src="https://cdn.buymeacoffee.com/buttons/v2/default-green.png"
            alt="Support Abdo Raquibi by buying a coffee"
            width={217}
            height={60}
            loading="lazy"
            priority={false}
          />
        </a>
      </body>
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


    </html>
  );
}
