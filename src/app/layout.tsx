import type { Metadata } from "next";
import "./globals.css";
import { Inter, Calistoga } from "next/font/google";
import { twMerge } from "tailwind-merge";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const calistoga = Calistoga({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "Abdo Raquibi | Full-Stack Web Developer Portfolio",
  description:
    "Explore the portfolio of Abdo Raquibi, a skilled full-stack developer specializing in modern web applications, user-friendly interfaces, and cutting-edge technologies.",
  keywords:
    "Abdo raquibi,raquibi,Raquibi,Abderrahmane Raquibi,Abderahmane,abderahmane, Full-Stack Web Developer, Web Development, Portfolio, Frontend Developer, Backend Developer, PHP, Laravel, React, Next.js, Node.js, JavaScript, Tailwind Css, Bootstrap",
  openGraph: {
    title: "Abdo Raquibi | Full-Stack Web Developer Portfolio",
    description:
      "Dive into the portfolio of Abderrahmane Raquibi, showcasing expertise in full-stack development, modern web technologies, and innovative project solutions.",
    url: "https://abdoraquibi.icu/",
    type: "website",
    images: [
      {
        url: "https://abdoraquibi.icu/abderrahmaneraquibi.jpg", // Replace with the actual URL of your image
        width: 1200,
        height: 630,
        alt: "Abdo Raquibi | Full-Stack Web Developer Portfolio",
      },
    ],
  },
  icons: {
    icon: "/favicon.ico",
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
          <img
            src="https://cdn.buymeacoffee.com/buttons/v2/default-green.png"
            alt="Buy Me A Coffee"
            style={{ height: "60px", width: "217px" }}
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
              "https://github.com/abderaquibi",
              "https://instagram.com/ceo.raquibi",
              "https://www.linkedin.com/in/abderrahmaneraquibi/"
            ],
            "image": "https://abdoraquibi.icu/abderrahmaneraquibi.jpg",
            "description": "Moroccan full-stack developer & entrepreneur specialized in Laravel, React, and SaaS platforms.",
          }),
        }}
      />

    </html>
  );
}
