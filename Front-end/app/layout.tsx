import type { Metadata } from "next";
import { Pixelify_Sans } from "next/font/google";
import "./globals.css";

const pixelifySans = Pixelify_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-pixel",
});

export const metadata: Metadata = {
  title: "Robo Nexus'26 Registration",
  icons: [
    { rel: "icon", type: "image/png", url: "/favicon.png" },
    { rel: "icon", type: "image/webp", url: "/logo.webp" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${pixelifySans.variable} font-pixel`}>{children}</body>
    </html>
  );
}
