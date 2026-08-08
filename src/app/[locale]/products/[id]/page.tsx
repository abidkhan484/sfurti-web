import React from 'react';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import ProductDetailPage from '@/components/pages/ProductDetailPage';
import bnProducts from '@/content/bn/products.json';
import enProducts from '@/content/en/products.json';

type Props = {
  params: Promise<{ locale: string; id: string }>;
};

function getProductsData(locale: string) {
  return locale === 'bn' ? bnProducts : enProducts;
}

export async function generateMetadata({ params }: Props) {
  const { locale, id } = await params;
  const productsData = getProductsData(locale);
  const product = productsData.items?.find((p: { id: string }) => p.id === id);

  if (!product) return { title: 'Product Not Found | Sfurti' };

  return {
    title: `${product.name} | Sfurti`,
    description: product.description,
  };
}

export default async function Page({ params }: Props) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const productsData = getProductsData(locale);
  const product = productsData.items?.find((p: { id: string }) => p.id === id);

  if (!product) {
    notFound();
  }

  return <ProductDetailPage locale={locale} product={product} />;
}
