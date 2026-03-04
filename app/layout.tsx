import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/app/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "M&N — Mohamad & Noor | Bottle-Themed Restaurant",
    template: "%s | M&N",
  },
  description:
    "M&N (Mohamad & Noor) — a bottle-themed restaurant experience with warm modern dining, subtle bubbles, and glassy highlights.",
  metadataBase: new URL("http://localhost:3000"),
  openGraph: {
    title: "M&N — Mohamad & Noor",
    description:
      "Bottle-themed modern dining. Explore the menu, reserve a table, and plan events with M&N.",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
