import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Binc — Your emotional check-in companion",
  description:
    "Binc helps you process emotions, reflect on patterns, and move forward with clarity.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
