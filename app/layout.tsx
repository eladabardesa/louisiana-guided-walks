import type { Metadata, Viewport } from "next";
import SiteChrome from "@/components/SiteChrome";
import Analytics from "@/components/Analytics";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "AAE — Attentive Art Encounters",
    template: "%s — AAE",
  },
  description:
    "An invitation to one or two attentive walks with Elad at Louisiana Museum.",
  openGraph: {
    title: "AAE — Attentive Art Encounters",
    description:
      "An invitation to one or two attentive walks with Elad at Louisiana Museum.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <SiteChrome>
        {children}
        <Analytics />
      </SiteChrome>
    </html>
  );
}
