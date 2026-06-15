import type { Metadata } from "next";
import { Inter, Rajdhani, JetBrains_Mono } from "next/font/google";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-rajdhani",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Gamers Exile — Where Gamers Become Legends",
  description:
    "The ultimate gaming & streaming platform hub. A community-first destination for MENA and global gamers and streamers. Featuring VALORANT, Marvel Rivals, CS2, and Overwatch 2.",
  keywords: ["gaming", "streaming", "esports", "VALORANT", "CS2", "Marvel Rivals", "Overwatch 2", "MENA gaming"],
  openGraph: {
    title: "Gamers Exile — Where Gamers Become Legends",
    description: "The ultimate gaming & streaming platform hub for MENA and global gamers.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${rajdhani.variable} ${jetbrainsMono.variable}`}
    >
      <body className="font-body bg-exile-bg text-exile-text min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
