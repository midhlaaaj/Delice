import type { Metadata } from "next";
import { Instrument_Sans, Modak } from "next/font/google";
import { SITE_URL, SITE_NAME } from "@/lib/site";
import { OrganizationStructuredData } from "@/components/site-schema";
import "./globals.css";

const instrument = Instrument_Sans({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const modak = Modak({
  variable: "--font-modak",
  subsets: ["latin"],
  weight: ["400"],
  display: "optional",
});

const TITLE = "Delice — Slice of Happiness";
const DESCRIPTION =
  "Small-batch cheesecakes and bakes, boxed by hand and delivered to shops across Kerala.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/",
    siteName: SITE_NAME,
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
  // Set GOOGLE_SITE_VERIFICATION in the environment with the value Google
  // Search Console gives you for the HTML-tag verification method; omitted
  // (no meta tag rendered) until that env var is set.
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${instrument.variable} ${modak.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-cream text-ink">
        <OrganizationStructuredData />
        {children}
      </body>
    </html>
  );
}
