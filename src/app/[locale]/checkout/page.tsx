import React from 'react';
import { setRequestLocale } from 'next-intl/server';
import CheckoutPage from '@/components/pages/CheckoutPage';
import bnCheckout from '@/content/bn/checkout.json';
import enCheckout from '@/content/en/checkout.json';

type Props = {
  params: Promise<{ locale: string }>;
};

function getCheckoutData(locale: string) {
  return locale === 'bn' ? bnCheckout : enCheckout;
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const checkoutData = getCheckoutData(locale);

  return {
    title: checkoutData.meta?.title || 'Checkout | Sfurti',
    description: checkoutData.meta?.description || 'Complete your order',
  };
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const checkoutData = getCheckoutData(locale);

  return <CheckoutPage locale={locale} checkoutData={checkoutData} />;
}
