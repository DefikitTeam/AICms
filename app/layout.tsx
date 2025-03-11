
import type { Metadata } from "next";

import { DM_Sans, DM_Mono } from "next/font/google";

import "./globals.css";
import Providers from "./_contexts";
import { Toaster } from "react-hot-toast";
import NotLoggedInAlert from "./(app)/_components/not-logged-in-alert";
// import GlobalConnectWalletProvider from "./_components/connect-wallet/config";
import GlobalProvider from "./global-provider";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  weight: ["300", "400", "500"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Agent CMS",
  description: "A modular network of interoperable DeFi agents",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${dmSans.variable} ${dmMono.variable} antialiased bg-white dark:bg-neutral-900`}
      >
        {/* <Providers>{children}</Providers> */}
        <Providers>
        <GlobalProvider>
          {children}
        </GlobalProvider>
        </Providers>
        {/* <NotLoggedInAlert /> */}
        <Toaster />
      </body>
    </html>
  );
}
