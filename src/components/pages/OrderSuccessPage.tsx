'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, PackageCheck, Home, ShoppingBag, PhoneCall } from 'lucide-react';

interface OrderDetails {
  orderNumber: string;
  customerName: string;
  phone: string;
  address: string;
  city: string;
  totalAmount: number;
  items: Array<{
    productId: string;
    productName: string;
    price: number;
    quantity: number;
  }>;
}

interface OrderSuccessPageProps {
  locale: string;
  orderId: string;
  checkoutData: {
    success: {
      title: string;
      order_number_label: string;
      thank_you: string;
      summary_title: string;
      shipping_to: string;
      payment_type: string;
      cod_value: string;
      back_home: string;
      continue_shopping: string;
    };
  };
}

export default function OrderSuccessPage({ locale, orderId, checkoutData }: OrderSuccessPageProps) {
  const searchParams = useSearchParams();
  const codeParam = searchParams.get('code');
  const [details, setDetails] = useState<OrderDetails | null>(null);

  const isBn = locale === 'bn';

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(`order_${orderId}`);
      if (saved) {
        setDetails(JSON.parse(saved));
      }
    } catch {
      // Ignore sessionStorage read errors
    }
  }, [orderId]);

  const displayCode = details?.orderNumber || codeParam || 'SF-CONFIRMED';

  return (
    <div className="min-h-screen bg-[#FAF3E0] py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl space-y-8">
        {/* Success Header Banner */}
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-[#1B4332]/15 shadow-sm text-center space-y-4">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1A1A2E]">
            {checkoutData.success.title}
          </h1>

          <div className="inline-block bg-[#1B4332]/10 px-5 py-2 rounded-2xl border border-[#1B4332]/20">
            <span className="text-xs uppercase font-bold text-gray-600 block">
              {checkoutData.success.order_number_label}
            </span>
            <span className="text-2xl font-black text-[#1B4332] tracking-wider">{displayCode}</span>
          </div>

          <p className="text-sm text-gray-700 max-w-lg mx-auto leading-relaxed">
            {checkoutData.success.thank_you}
          </p>

          <div className="pt-4 flex items-center justify-center gap-2 text-xs font-semibold text-[#1B4332]">
            <PhoneCall className="w-4 h-4" />
            <span>
              {isBn
                ? 'যেকোনো সহায়তার জন্য কল করুন: 01700-000000'
                : 'Customer Support Helpline: 01700-000000'}
            </span>
          </div>
        </div>

        {/* Order Details Breakdown */}
        {details && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#1B4332]/15 shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-[#1A1A2E] flex items-center gap-2 border-b border-gray-100 pb-3">
              <PackageCheck className="w-5 h-5 text-[#1B4332]" />
              {checkoutData.success.summary_title}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-gray-700 bg-gray-50 p-4 rounded-2xl border border-gray-100">
              <div>
                <span className="font-bold text-gray-500 block mb-1">
                  {checkoutData.success.shipping_to}:
                </span>
                <p className="font-semibold text-gray-900">{details.customerName}</p>
                <p>{details.phone}</p>
                <p>
                  {details.address}, {details.city}
                </p>
              </div>

              <div>
                <span className="font-bold text-gray-500 block mb-1">
                  {checkoutData.success.payment_type}
                </span>
                <p className="font-bold text-[#1B4332]">{checkoutData.success.cod_value}</p>
                <p className="mt-2 text-sm font-extrabold text-[#1B4332]">
                  {details.totalAmount.toLocaleString('bn-BD')} ৳
                </p>
              </div>
            </div>

            {/* Purchased Items List */}
            <div className="divide-y divide-gray-100">
              {details.items.map((item) => (
                <div key={item.productId} className="py-3 flex justify-between items-center text-sm">
                  <div>
                    <h3 className="font-bold text-gray-900">{item.productName}</h3>
                    <p className="text-xs text-gray-500">
                      {item.price.toLocaleString('bn-BD')} ৳ × {item.quantity}
                    </p>
                  </div>
                  <span className="font-bold text-[#1B4332]">
                    {(item.price * item.quantity).toLocaleString('bn-BD')} ৳
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom CTA Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href={`/${locale}`}
            className="w-full sm:w-auto px-6 py-3 rounded-xl border border-gray-300 bg-white text-gray-700 font-bold text-sm hover:bg-gray-50 flex items-center justify-center gap-2 shadow-xs"
          >
            <Home className="w-4 h-4" />
            {checkoutData.success.back_home}
          </Link>

          <Link
            href={`/${locale}/products`}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#1B4332] text-white font-bold text-sm hover:bg-[#143527] flex items-center justify-center gap-2 shadow-md"
          >
            <ShoppingBag className="w-4 h-4" />
            {checkoutData.success.continue_shopping}
          </Link>
        </div>
      </div>
    </div>
  );
}
