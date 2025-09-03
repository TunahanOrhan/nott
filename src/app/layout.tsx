import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import Header from "@/components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nott - Smart Note Taking App",
  description: "Take, organize, and manage your notes easily with Nott.",
  openGraph: {
    title: "Nott - Smart Note Taking App",
    description: "Take, organize, and manage your notes easily with Nott.",
    url: "https://nott-theta.vercel.app",
    siteName: "Nott",
    images: [
      {
        url: "/og-image.png", // /public/og-image.png
        width: 1200,
        height: 630,
        alt: "Nott - Smart Note Taking App",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nott - Smart Note Taking App",
    description: "Take, organize, and manage your notes easily with Nott.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white dark:bg-gray-900 text-black dark:text-white transition-colors duration-300`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          <main className="pt-20">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
