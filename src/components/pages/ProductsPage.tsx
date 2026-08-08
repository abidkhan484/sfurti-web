'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { ShoppingBag, Filter, Sparkles, Check, ArrowRight } from 'lucide-react';

interface ProductItem {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  price: number;
  originalPrice?: number;
  ageRange: string;
  category: string;
  inStock: boolean;
  icon: string;
  image?: string;
  benefits: string[];
}

interface ProductsPageProps {
  locale: string;
  productsData: {
    meta: { title: string; description: string };
    header: { title: string; subtitle: string };
    filters: {
      all: string;
      age_label: string;
      category_label: string;
      ages: Record<string, string>;
      categories: Record<string, string>;
    };
    actions: {
      view_details: string;
      order_now: string;
      add_to_cart: string;
      in_stock: string;
      preorder: string;
    };
    items: ProductItem[];
  };
}

export default function ProductsPage({ locale, productsData }: ProductsPageProps) {
  const [selectedAge, setSelectedAge] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [addedItems, setAddedItems] = useState<Record<string, boolean>>({});

  const { addItem } = useCart();
  const isBn = locale === 'bn';

  const filteredProducts = productsData.items.filter((item) => {
    const ageMatch = selectedAge === 'all' || item.ageRange === selectedAge;
    const catMatch = selectedCategory === 'all' || item.category === selectedCategory;
    return ageMatch && catMatch;
  });

  const handleAddToCart = (product: ProductItem) => {
    addItem({
      productId: product.id,
      productName: product.name,
      price: product.price,
      slug: product.slug,
      image: product.image,
    });
    setAddedItems((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedItems((prev) => ({ ...prev, [product.id]: false }));
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#FAF3E0] py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-10">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1B4332]/10 text-[#1B4332] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            {isBn ? 'কগনিটিভ খেলনাসমূহ' : 'Cognitive Collection'}
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1A1A2E] tracking-tight">
            {productsData.header.title}
          </h1>
          <p className="text-lg text-gray-700 leading-relaxed">{productsData.header.subtitle}</p>
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-5 rounded-2xl border border-[#1B4332]/15 shadow-xs space-y-4 md:space-y-0 md:flex md:items-center md:justify-between gap-4">
          {/* Age Filters */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" />
              {productsData.filters.age_label}
            </label>
            <div className="flex flex-wrap gap-2">
              {Object.entries(productsData.filters.ages).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setSelectedAge(key)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                    selectedAge === key
                      ? 'bg-[#1B4332] text-white shadow-xs'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Category Filters */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
              {productsData.filters.category_label}
            </label>
            <div className="flex flex-wrap gap-2">
              {Object.entries(productsData.filters.categories).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setSelectedCategory(key)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                    selectedCategory === key
                      ? 'bg-[#1B4332] text-white shadow-xs'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 sm:gap-8">
          {filteredProducts.length === 0 ? (
            <div className="col-span-full py-16 text-center text-gray-600 bg-white rounded-2xl border border-[#1B4332]/10">
              <p className="text-lg font-medium">
                {isBn
                  ? 'নির্বাচিত ফিল্টারে কোনো খেলনা পাওয়া যায়নি।'
                  : 'No products found matching your active filters.'}
              </p>
              <button
                onClick={() => {
                  setSelectedAge('all');
                  setSelectedCategory('all');
                }}
                className="mt-4 px-4 py-2 bg-[#1B4332] text-white rounded-lg text-sm font-semibold hover:bg-[#143527]"
              >
                {isBn ? 'সব ফিল্টার মুছুন' : 'Reset Filters'}
              </button>
            </div>
          ) : (
            filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl border border-[#1B4332]/15 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
              >
                <div className="p-6 space-y-4">
                  {/* Card Badge Header */}
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-[#1B4332]/10 text-[#1B4332] text-xs font-bold">
                      {isBn ? `বয়স: ${product.ageRange} বছর` : `Age: ${product.ageRange} Yrs`}
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      {productsData.actions.in_stock}
                    </span>
                  </div>

                  {/* Product Title & Tagline */}
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 hover:text-[#1B4332] transition">
                      <Link href={`/${locale}/products/${product.id}`}>{product.name}</Link>
                    </h2>
                    <p className="text-sm text-[#1B4332] font-medium mt-1">{product.tagline}</p>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                    {product.description}
                  </p>

                  {/* Benefits */}
                  <div className="space-y-1.5 pt-2">
                    {product.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-gray-700">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#1B4332]" />
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer / Price & Actions */}
                <div className="p-6 bg-gray-50 border-t border-gray-100 flex items-center justify-between gap-4">
                  <div>
                    <span className="text-2xl font-extrabold text-[#1B4332]">
                      {product.price.toLocaleString('bn-BD')} ৳
                    </span>
                    {product.originalPrice && (
                      <span className="ml-2 text-xs text-gray-400 line-through">
                        {product.originalPrice.toLocaleString('bn-BD')} ৳
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/${locale}/products/${product.id}`}
                      className="px-3 py-2 text-xs font-semibold text-gray-700 hover:text-[#1B4332] border border-gray-300 rounded-lg hover:bg-white transition flex items-center gap-1"
                    >
                      {productsData.actions.view_details}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>

                    <button
                      onClick={() => handleAddToCart(product)}
                      className={`px-4 py-2 text-xs font-bold rounded-lg text-white shadow-xs transition flex items-center gap-1.5 ${
                        addedItems[product.id]
                          ? 'bg-emerald-600 hover:bg-emerald-700'
                          : 'bg-[#1B4332] hover:bg-[#143527]'
                      }`}
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      {addedItems[product.id]
                        ? isBn
                          ? 'যোগ করা হয়েছে!'
                          : 'Added!'
                        : productsData.actions.add_to_cart}
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
