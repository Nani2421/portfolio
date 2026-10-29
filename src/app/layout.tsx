import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { profile } from "@/data/portfolio";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Backdrop from "@/components/Backdrop";

// One font for everything; weight 500 is only for headings and buttons.
const sans = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  // The live deployment. Link-preview image URLs resolve against this.
  metadataBase: new URL("https://neerajreddy.vercel.app"),
  title: `${profile.name} — AI & App Developer`,
  description: profile.description,
  keywords: ["Machine Learning", "LLMs", "RAG", "Computer Vision", "Android", "macOS", "PingDrop", profile.name],
  authors: [{ name: profile.name }],
  openGraph: {
    title: `${profile.name} — AI & App Developer`,
    description: profile.description,
    type: "profile",
    locale: "en_IN",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    // Font variable on <html> so --font-sans in globals.css can resolve it.
    // suppressHydrationWarning: the script below sets data-theme before React
    // hydrates, so this element's attributes legitimately differ from the server's.
    <html lang="en" className={sans.variable} suppressHydrationWarning>
      <head>
        {/* Runs before first paint: a saved choice wins, otherwise the system mode. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var s=localStorage.getItem('theme');var d=s?s==='dark':matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.dataset.theme=d?'dark':'light'}catch(e){document.documentElement.dataset.theme='light'}})()`,
          }}
        />
      </head>
      <body>
        <Backdrop />
        <Nav />
        <main className="mx-auto max-w-site px-5">
          {children}
          <Footer />
        </main>
      </body>
    </html>
  );
}
