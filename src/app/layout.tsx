import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ui/toast";
import { PageLoadOverlay } from "@/components/ui/page-load-overlay";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { ChatWidget } from "@/components/ai/chat-widget";
import { PromoCard } from "@/components/ui/promo-card";
import { ServiceWorkerRegister } from "@/components/ui/service-worker-register";
import { JsonLd } from "@/components/seo/json-ld";
import { schoolSchema } from "@/lib/seo/schema";
import { SITE } from "@/lib/site";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: SITE.name,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  keywords: [...SITE.keywords],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: SITE.url,
    siteName: SITE.name,
    title: `${SITE.name} | ${SITE.motto}`,
    description: SITE.description,
    images: [
      {
        url: SITE.ogImage.path,
        width: SITE.ogImage.width,
        height: SITE.ogImage.height,
        alt: SITE.ogImage.alt,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} | ${SITE.motto}`,
    description: SITE.description,
    images: [SITE.ogImage.path],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0b1f4b",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${playfair.variable} antialiased`}>
      <body suppressHydrationWarning className="min-h-screen bg-surface text-ink font-sans">
        <JsonLd data={schoolSchema()} />
        <ThemeProvider>
          <ToastProvider>{children}</ToastProvider>
          <PageLoadOverlay />
          <ChatWidget />
          <PromoCard />
          <ServiceWorkerRegister />
        </ThemeProvider>
      </body>
    </html>
  );
}
