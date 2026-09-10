import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ui/toast";
import { PageLoadOverlay } from "@/components/ui/page-load-overlay";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { ChatWidget } from "@/components/ai/chat-widget";
import { PromoCard } from "@/components/ui/promo-card";
import { ServiceWorkerRegister } from "@/components/ui/service-worker-register";

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
  title: {
    default: "EL-BETH-EL The Kings' School — Fountain of Knowledge",
    template: "%s | EL-BETH-EL The Kings' School",
  },
  description:
    "EL-BETH-EL The Kings' School — Fountain of Knowledge. A place where knowledge meets character, excellence meets opportunity, and every child is prepared for a brighter future.",
  keywords: [
    "EL-BETH-EL",
    "Kings School",
    "school",
    "education",
    "academics",
    "admissions",
    "Fountain of Knowledge",
  ],
  openGraph: {
    title: "EL-BETH-EL The Kings' School",
    description:
      "Fountain of Knowledge. Where knowledge meets character, excellence meets opportunity.",
    type: "website",
    siteName: "EL-BETH-EL The Kings' School",
  },
  robots: {
    index: true,
    follow: true,
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
