import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kobo | Find the better rate",
  description:
    "Compare crypto-to-fiat rates across exchanges, OTC providers and P2P platforms.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
                                   }
