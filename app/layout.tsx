import type { Metadata, Viewport } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "AAE — Attentive Art Encounters",
    template: "%s — AAE",
  },
  description:
    "Guided walks through museums in Copenhagen. Slow looking, conversation, and shared encounters with art.",
  openGraph: {
    title: "AAE — Attentive Art Encounters",
    description:
      "Guided walks through museums in Copenhagen. Slow looking, conversation, and shared encounters with art.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="pt-16 sm:pt-20">
        <Header />
        <div className="min-h-screen">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
