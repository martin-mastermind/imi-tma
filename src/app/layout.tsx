import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

const inter = Inter({ subsets: ["cyrillic"] });

export const metadata: Metadata = {
  title: "IMI AI",
  description: "IMI AI Telegram Mini App",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={inter.className}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
