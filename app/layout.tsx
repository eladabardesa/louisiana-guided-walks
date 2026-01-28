import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Look Back at You - An attentive walk with Elad at Louisiana",
  description: "Join a small group for pilot guided walks in the museum. Focus on attention, listening, and shared looking.",
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
