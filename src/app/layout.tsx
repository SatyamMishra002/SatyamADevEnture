import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://satyam.dev"),
  title: {
    default: "Satyam — Python Developer · AI · Adventure",
    template: "%s · Satyam",
  },
  description:
    "Portfolio and digital journal of a Python developer exploring AI, backend systems, mountains, and the craft of making things that last.",
  openGraph: {
    title: "Satyam — Python Developer · AI · Adventure",
    description: "Build systems that think. Live stories that breathe.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Satyam",
    description: "Python · AI · Adventure · Journal",
  },
  manifest: "/manifest.webmanifest",
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrains.variable} h-full antialiased`}
    >
      <head>
        <link
          href="https://api.fontshare.com/v2/css?f[]=satoshi@300,400,500,700,900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="flex min-h-full flex-col bg-bg text-text">{children}</body>
    </html>
  );
}
