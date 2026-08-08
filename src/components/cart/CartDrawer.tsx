'use client';

import React from 'react';
import Link from 'next/link';
import { useCart, CartItem } from '@/context/CartContext';

interface CartDrawerProps {
  locale: string;
}

export default function CartDrawer({ locale }: CartDrawerProps) {
  const { items, isCartOpen, setIsCartOpen, removeItem, updateQuantity, subtotal, totalItems } =
    useCart();

  if (!isCartOpen) return null;

  const isBn = locale === 'bn';

  return (
    <div className="aria-modal backdrop-blur-xs fixed inset-0 z-50 overflow-hidden bg-black/50 transition-opacity">
      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-md bg-[#FAF3E0] shadow-xl border-l border-[#1B4332]/10 flex flex-col">
          {/* Drawer Header */}
          <div className="flex items-center justify-between px-6 py-4 bg-[#1B4332] text-white">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              {isBn ? `আপনার কার্ট (${totalItems})` : `Your Cart (${totalItems})`}
            </h2>
            <button
              onClick={() => setIsCartOpen(false)}
              className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition"
              aria-label="Close cart"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-12 text-gray-600">
                <svg
                  className="w-16 h-16 mx-auto mb-4 text-[#1B4332]/30"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
                <p className="font-medium text-lg">
                  {isBn ? 'আপনার কার্ট এখন খালি।' : 'Your cart is currently empty.'}
                </p>
                <Link
                  href={`/${locale}/products`}
                  onClick={() => setIsCartOpen(false)}
                  className="mt-4 inline-block px-5 py-2.5 bg-[#1B4332] text-white rounded-lg font-semibold hover:bg-[#143527] transition"
                >
                  {isBn ? 'খেলনাসমূহ দেখুন' : 'Explore Toys'}
                </Link>
              </div>
            ) : (
              items.map((item: CartItem) => (
                <div
                  key={item.productId}
                  className="flex items-center justify-between bg-white p-4 rounded-xl border border-[#1B4332]/10 shadow-xs"
                >
                  <div className="flex-1 min-w-0 pr-3">
                    <h3 className="font-semibold text-gray-900 truncate">{item.productName}</h3>
                    <p className="text-sm font-bold text-[#1B4332] mt-0.5">
                      {item.price.toLocaleString('bn-BD')} ৳
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-gray-50">
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="px-2.5 py-1 text-gray-600 hover:bg-gray-200 text-sm font-bold"
                      >
                        -
                      </button>
                      <span className="px-3 py-1 text-sm font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="px-2.5 py-1 text-gray-600 hover:bg-gray-200 text-sm font-bold"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.productId)}
                      className="text-red-500 hover:text-red-700 p-1"
                      title={isBn ? 'মুছে ফেলুন' : 'Remove'}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer */}
          {items.length > 0 && (
            <div className="p-6 bg-white border-t border-[#1B4332]/10 space-y-4">
              <div className="flex justify-between items-center text-lg font-bold text-gray-900">
                <span>{isBn ? 'উপমোট:' : 'Subtotal:'}</span>
                <span className="text-[#1B4332]">{subtotal.toLocaleString('bn-BD')} ৳</span>
              </div>
              <p className="text-xs text-gray-500">
                {isBn
                  ? 'ক্যাশ অন ডেলিভারি (COD) পেমেন্টে কোনো অগ্রিম টাকা দিতে হবে না।'
                  : 'Cash on Delivery (COD) - No advance payment needed.'}
              </p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="w-full py-3 px-4 rounded-xl border border-gray-300 font-semibold text-gray-700 hover:bg-gray-50 text-center transition"
                >
                  {isBn ? 'আরও দেখুন' : 'Continue'}
                </button>
                <Link
                  href={`/${locale}/checkout`}
                  onClick={() => setIsCartOpen(false)}
                  className="w-full py-3 px-4 rounded-xl bg-[#1B4332] text-white font-semibold hover:bg-[#143527] text-center shadow-md transition"
                >
                  {isBn ? 'অর্ডার করুন' : 'Checkout'}
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
