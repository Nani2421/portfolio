import type { Metadata } from "next";
import { Source_Serif_4, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { profile } from "@/data/portfolio";
import MotionProvider from "@/components/MotionProvider";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import StarField from "@/components/StarField";

/**
 * Geist for headings and UI, Source Serif for body copy — the free stand-ins
 * for NB International Pro and STK Bureau Serif. Only 400 and 600 are loaded
 * for the serif and 400 for the sans: the source system has no bold at all,
 * and weight contrast comes from the serif/sans switch instead.
 */
const sans = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

const serif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
  weight: ["400", "600"],
  display: "swap",
});

const mono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const description = `${profile.positioning} ${profile.subline}`;

export const metadata: Metadata = {
  // The live deployment. OpenGraph/Twitter image URLs are resolved against
  // this, so a wrong value here silently breaks every link preview.
  metadataBase: new URL("https://neerajreddy.vercel.app"),
  title: {
    default: `${profile.name} — Computer Vision & ML`,
    template: `%s · ${profile.shortName}`,
  },
  description,
  keywords: [
    "Machine Learning Engineer",
    "Computer Vision",
    "Deep Learning",
    "YOLOv8",
    "Python",
    profile.name,
  ],
  authors: [{ name: profile.name }],
  openGraph: {
    title: `${profile.name} — Computer Vision & ML`,
    description,
    type: "profile",
    locale: "en_IN",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // Next 16 no longer overrides scroll-behavior during navigation, so
    // `data-scroll-behavior` is what keeps route changes instant while
    // in-page anchors still glide.
    // Font variables go on <html>, not <body>: globals.css declares
    // --font-heading/--font-body/--font-mono at :root, and a custom property
    // resolves its var() references where it is declared. With the fonts on
    // <body> those references are empty at :root and inherit empty everywhere.
    // suppressHydrationWarning is required, not cosmetic: the inline script
    // below writes `data-theme` onto this element before React hydrates, so
    // the client attributes legitimately differ from the server HTML. It
    // suppresses the warning for this element's attributes only, not its tree.
    <html
      lang="en"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${sans.variable} ${serif.variable} ${mono.variable}`}
    >
      <head>
        {/* Runs before first paint, so dark-mode users never see a white
            flash. An explicit choice in localStorage wins; otherwise follow
            the OS. Inline and synchronous on purpose — a React effect runs
            after paint, which is exactly too late. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var s=localStorage.getItem('theme');var d=s?s==='dark':matchMedia('(prefers-color-scheme:dark)').matches;document.documentElement.dataset.theme=d?'dark':'light'}catch(e){}})()`,
          }}
        />
      </head>
      <body>
        <MotionProvider>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:text-white"
          >
            Skip to content
          </a>
          {/* Fixed behind everything, decorative, pointer-events none. */}
          <StarField />
          <Nav />
          {/* Content runs the full 1312px band. Long prose still carries
              `measure` so the line length stays readable inside it. */}
          <main
            id="main"
            className="relative mx-auto max-w-site px-gutter pt-28 md:pt-40"
          >
            {children}
            <Footer />
          </main>
        </MotionProvider>
      </body>
    </html>
  );
}
