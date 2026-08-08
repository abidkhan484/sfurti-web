'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { ArrowLeft, Check, ShieldCheck, Truck, ShoppingBag, Zap, Award } from 'lucide-react';

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
  specs?: {
    material: string;
    pieces: string;
    safety: string;
  };
}

interface ProductDetailPageProps {
  locale: string;
  product: ProductItem;
}

export default function ProductDetailPage({ locale, product }: ProductDetailPageProps) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();
  const router = useRouter();
  const isBn = locale === 'bn';

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      productName: product.name,
      price: product.price,
      slug: product.slug,
      image: product.image,
      quantity,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addItem({
      productId: product.id,
      productName: product.name,
      price: product.price,
      slug: product.slug,
      image: product.image,
      quantity,
    });
    router.push(`/${locale}/checkout`);
  };

  return (
    <div className="min-h-screen bg-[#FAF3E0] py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-8">
        {/* Back Link */}
        <Link
          href={`/${locale}/products`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#1B4332] hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          {isBn ? 'সব খেলনায় ফিরে যান' : 'Back to All Toys'}
        </Link>

        {/* Product Details Container */}
        <div className="bg-white rounded-3xl border border-[#1B4332]/15 shadow-sm p-6 sm:p-10 grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Left Visual Illustration Block */}
          <div className="bg-[#FAF3E0] rounded-2xl p-8 flex flex-col items-center justify-center border border-[#1B4332]/10 min-h-[300px] text-center space-y-4">
            <div className="w-24 h-24 rounded-full bg-[#1B4332]/10 flex items-center justify-center text-[#1B4332]">
              <Award className="w-12 h-12" />
            </div>
            <div className="space-y-1">
              <span className="px-3 py-1 rounded-full bg-[#1B4332] text-white text-xs font-bold">
                {isBn ? `উপযোগী বয়স: ${product.ageRange} বছর` : `Target Age: ${product.ageRange} Yrs`}
              </span>
              <p className="text-xs text-gray-500 pt-2">
                {isBn ? 'স্ফূর্তি প্রাকৃতিক কাঠের ইনলাস্ট্রেশন' : 'Sfurti Handcrafted Wooden Illustration'}
              </p>
            </div>
          </div>

          {/* Right Product Copy & Actions */}
          <div className="flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
                  {isBn ? 'কগনিটিভ লার্নিং খেলনা' : 'Cognitive Learning Toy'}
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1A1A2E] mt-2">
                  {product.name}
                </h1>
                <p className="text-sm font-semibold text-[#1B4332] mt-1">{product.tagline}</p>
              </div>

              {/* Price Display */}
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-extrabold text-[#1B4332]">
                  {product.price.toLocaleString('bn-BD')} ৳
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-gray-400 line-through">
                    {product.originalPrice.toLocaleString('bn-BD')} ৳
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-sm text-gray-700 leading-relaxed">{product.description}</p>

              {/* Key Benefits */}
              <div className="space-y-2 pt-2 border-t border-gray-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  {isBn ? 'কী কী কগনিটিভ স্কিল বাড়বে:' : 'Cognitive Benefits:'}
                </h3>
                <div className="space-y-1.5">
                  {product.benefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs font-medium text-gray-800">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Product Specifications */}
              {product.specs && (
                <div className="bg-gray-50 p-4 rounded-xl space-y-2 text-xs text-gray-700 border border-gray-100">
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-500">{isBn ? 'উপাদান:' : 'Material:'}</span>
                    <span>{product.specs.material}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-500">{isBn ? 'ব্লক সংখ্যা:' : 'Pieces:'}</span>
                    <span>{product.specs.pieces}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-500">{isBn ? 'নিরাপত্তা ফিনিশ:' : 'Safety:'}</span>
                    <span>{product.specs.safety}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Quantity Selector & Action Buttons */}
            <div className="space-y-4 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold text-gray-700">{isBn ? 'পরিমাণ:' : 'Quantity:'}</span>
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-gray-50">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1.5 text-gray-600 hover:bg-gray-200 text-sm font-bold"
                  >
                    -
                  </button>
                  <span className="px-4 py-1.5 text-sm font-bold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-1.5 text-gray-600 hover:bg-gray-200 text-sm font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={handleAddToCart}
                  className={`w-full py-3 px-4 rounded-xl font-bold text-sm shadow-xs transition flex items-center justify-center gap-2 ${
                    added
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white text-[#1B4332] border-2 border-[#1B4332] hover:bg-[#1B4332]/5'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  {added
                    ? isBn
                      ? 'কার্টে যোগ হয়েছে!'
                      : 'Added to Cart!'
                    : isBn
                    ? 'কার্টে যোগ করুন'
                    : 'Add to Cart'}
                </button>

                <button
                  onClick={handleBuyNow}
                  className="w-full py-3 px-4 rounded-xl bg-[#1B4332] text-white font-bold text-sm hover:bg-[#143527] shadow-md transition flex items-center justify-center gap-2"
                >
                  <Zap className="w-4 h-4" />
                  {isBn ? 'সরাসরি অর্ডার করুন' : 'Buy Now'}
                </button>
              </div>

              {/* Guarantees */}
              <div className="flex items-center justify-around text-xs text-gray-500 pt-2 border-t border-gray-100">
                <span className="flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-[#1B4332]" />
                  {isBn ? 'ক্যাশ অন ডেলিভারি' : 'Cash on Delivery'}
                </span>
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#1B4332]" />
                  {isBn ? '১০০% বিষমুক্ত ফিনিশ' : '100% Non-Toxic'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
