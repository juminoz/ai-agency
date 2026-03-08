import { type Metadata } from "next";
import { Inter } from "next/font/google";

import "@repo/ui/globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "BrandBuddy — Connect with the right creators for your brand",
  description:
    "Data-driven creator-brand matching platform. Find, vet, and collaborate with influencers who fit your brand.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
