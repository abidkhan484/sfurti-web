import React from 'react';
import { setRequestLocale } from 'next-intl/server';
import ProductsPage from '@/components/pages/ProductsPage';
import bnProducts from '@/content/bn/products.json';
import enProducts from '@/content/en/products.json';

type Props = {
  params: Promise<{ locale: string }>;
};

function getProductsData(locale: string) {
  return locale === 'bn' ? bnProducts : enProducts;
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const productsData = getProductsData(locale);

  return {
    title: productsData.meta?.title || 'Sfurti Cognitive Toys',
    description: productsData.meta?.description || 'Cognitive wooden toys for children',
  };
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const productsData = getProductsData(locale);

  return <ProductsPage locale={locale} productsData={productsData} />;
}
