import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import Header from "@/components/layout/Header";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import AnalyticsProviders from "@/components/analytics/AnalyticsProviders";
import { CartProvider } from "@/context/CartContext";
import CartDrawer from "@/components/cart/CartDrawer";
import "../globals.css";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "bn" | "en")) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="flex min-h-screen flex-col bg-[#FAF3E0] font-sans text-[#1A1A2E] antialiased">
        <NextIntlClientProvider messages={messages}>
          <CartProvider>
            <Header locale={locale} />
            <main className="flex-grow">{children}</main>
            <CartDrawer locale={locale} />
          </CartProvider>
        </NextIntlClientProvider>
        <Analytics />
        <SpeedInsights />
        <AnalyticsProviders />
      </body>
    </html>
  );
}

