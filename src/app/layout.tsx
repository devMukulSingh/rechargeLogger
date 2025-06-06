import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Providers from "@/src/lib/Providers";
import { ClerkProvider } from "@clerk/nextjs";
import TRPCProvider from "../lib/TRPCProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Recharge-logger",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <TRPCProvider>
          <ClerkProvider>
            <Providers>
              <Toaster position="bottom-right" />
              {children}
            </Providers>
          </ClerkProvider>
        </TRPCProvider>
      </body>
    </html>
  );
}
