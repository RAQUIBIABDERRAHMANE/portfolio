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
    "Explore the portfolio of Anas ERRAKIBI, a skilled full-stack developer specializing in modern web applications, user-friendly interfaces, and cutting-edge technologies.",
  keywords:
    "Anas ER-RAKIBI, Full-Stack Web Developer, Web Development, Portfolio, Frontend Developer, Backend Developer, PHP, Laravel, React, Next.js, Node.js, JavaScript, Tailwind Css, Bootstrap",
  openGraph: {
    title: "Anas Dev | Full-Stack Web Developer Portfolio",
    description:
      "Dive into the portfolio of Anas ER-RAKIBI, showcasing expertise in full-stack development, modern web technologies, and innovative project solutions.",
    url: "https://anas-dev.vercel.app/",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" type="image/x-icon" />
      </head>
      <body
        className={twMerge(
          inter.variable,
          calistoga.variable,
          "bg-gray-900 text-white antialiased font-sans scrollbar"
        )}
      >
        {children}
      </body>
    </html>
  );
}
