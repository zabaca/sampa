import type { Metadata } from "next";
import { Barlow_Condensed, DM_Sans } from "next/font/google";
import { PHProvider } from "@/components/PostHogProvider";
import "./globals.css";

const barlowCondensed = Barlow_Condensed({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sampa BJJ - Class Schedule",
  description: "Class schedule for Sampa Brazilian Jiu-Jitsu",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${barlowCondensed.variable} ${dmSans.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-zinc-950 text-zinc-100 font-sans">
        <PHProvider>{children}</PHProvider>
      </body>
    </html>
  );
}
