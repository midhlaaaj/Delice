import type { Metadata } from "next";
import { Fraunces, Instrument_Sans, Modak } from "next/font/google";
import { HeroTransitionProvider } from "@/components/hero-transition";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
});

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

export const metadata: Metadata = {
  title: "Delice — Slice of Happiness",
  description:
    "Small-batch cheesecakes and bakes, boxed by hand and delivered to shops across Kerala.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${instrument.variable} ${modak.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-cream text-ink">
        <HeroTransitionProvider>{children}</HeroTransitionProvider>
      </body>
    </html>
  );
}
