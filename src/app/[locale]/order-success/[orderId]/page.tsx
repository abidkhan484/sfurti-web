import React, { Suspense } from 'react';
import { setRequestLocale } from 'next-intl/server';
import OrderSuccessPage from '@/components/pages/OrderSuccessPage';
import bnCheckout from '@/content/bn/checkout.json';
import enCheckout from '@/content/en/checkout.json';

type Props = {
  params: Promise<{ locale: string; orderId: string }>;
};

function getCheckoutData(locale: string) {
  return locale === 'bn' ? bnCheckout : enCheckout;
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const checkoutData = getCheckoutData(locale);

  return {
    title: checkoutData.success?.title || 'Order Confirmed | Sfurti',
    description: checkoutData.success?.thank_you || 'Your order has been placed successfully',
  };
}

export default async function Page({ params }: Props) {
  const { locale, orderId } = await params;
  setRequestLocale(locale);

  const checkoutData = getCheckoutData(locale);

  return (
    <Suspense fallback={<div className="p-12 text-center text-[#1B4332]">Loading...</div>}>
      <OrderSuccessPage locale={locale} orderId={orderId} checkoutData={checkoutData} />
    </Suspense>
  );
}
