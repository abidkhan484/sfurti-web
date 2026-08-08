'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart, CartItem } from '@/context/CartContext';
import { Truck, ShieldCheck, ShoppingBag, ArrowLeft, AlertCircle } from 'lucide-react';

interface CheckoutPageProps {
  locale: string;
  checkoutData: {
    meta: { title: string; description: string };
    cart_summary: {
      title: string;
      empty: string;
      subtotal: string;
      delivery: string;
      delivery_free: string;
      total: string;
      item_count: string;
    };
    form: {
      title: string;
      name_label: string;
      name_placeholder: string;
      phone_label: string;
      phone_placeholder: string;
      address_label: string;
      address_placeholder: string;
      city_label: string;
      city_default: string;
      note_label: string;
      note_placeholder: string;
      payment_method: {
        title: string;
        cod_title: string;
        cod_desc: string;
      };
      submit_button: string;
      submitting: string;
      errors: {
        name_required: string;
        phone_invalid: string;
        address_required: string;
        cart_empty: string;
        server_error: string;
      };
    };
  };
}

export default function CheckoutPage({ locale, checkoutData }: CheckoutPageProps) {
  const { items, subtotal, clearCart } = useCart();
  const router = useRouter();
  const isBn = locale === 'bn';

  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState(checkoutData.form.city_default || 'Dhaka');
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (items.length === 0) {
      setErrorMessage(checkoutData.form.errors.cart_empty);
      return;
    }

    if (!customerName.trim()) {
      setErrorMessage(checkoutData.form.errors.name_required);
      return;
    }

    const cleanPhone = phone.trim().replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setErrorMessage(checkoutData.form.errors.phone_invalid);
      return;
    }

    if (!address.trim()) {
      setErrorMessage(checkoutData.form.errors.address_required);
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: customerName.trim(),
          phone: cleanPhone,
          address: address.trim(),
          city,
          note: note.trim(),
          items: items.map((i: CartItem) => ({
            productId: i.productId,
            productName: i.productName,
            price: i.price,
            quantity: i.quantity,
          })),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.message || checkoutData.form.errors.server_error);
        setIsSubmitting(false);
        return;
      }

      // Store order details in sessionStorage for confirmation page display
      try {
        sessionStorage.setItem(
          `order_${data.orderId}`,
          JSON.stringify({
            orderNumber: data.orderNumber,
            customerName: customerName.trim(),
            phone: cleanPhone,
            address: address.trim(),
            city,
            totalAmount: data.totalAmount,
            items,
          })
        );
      } catch {
        // Ignore sessionStorage write error
      }

      clearCart();
      router.push(`/${locale}/order-success/${data.orderId}?code=${data.orderNumber}`);
    } catch {
      setErrorMessage(checkoutData.form.errors.server_error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF3E0] py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-8">
        {/* Navigation back link */}
        <Link
          href={`/${locale}/products`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#1B4332] hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          {isBn ? 'কেনাকাটা চালিয়ে যান' : 'Continue Shopping'}
        </Link>

        {items.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-3xl border border-[#1B4332]/15 shadow-sm max-w-md mx-auto space-y-4">
            <ShoppingBag className="w-16 h-16 mx-auto text-[#1B4332]/30" />
            <h2 className="text-xl font-bold text-gray-900">{checkoutData.cart_summary.empty}</h2>
            <Link
              href={`/${locale}/products`}
              className="inline-block px-6 py-3 bg-[#1B4332] text-white rounded-xl font-bold text-sm hover:bg-[#143527]"
            >
              {isBn ? 'খেলনাসমূহ দেখুন' : 'Explore Toys'}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Customer & Address Form */}
            <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-[#1B4332]/15 shadow-sm space-y-6">
              <h2 className="text-xl font-bold text-[#1A1A2E] border-b border-gray-100 pb-4">
                {checkoutData.form.title}
              </h2>

              {errorMessage && (
                <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-sm font-semibold rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleSubmitOrder} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    {checkoutData.form.name_label} *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder={checkoutData.form.name_placeholder}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#1B4332] focus:outline-none text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    {checkoutData.form.phone_label} *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={checkoutData.form.phone_placeholder}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#1B4332] focus:outline-none text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    {checkoutData.form.address_label} *
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder={checkoutData.form.address_placeholder}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#1B4332] focus:outline-none text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      {checkoutData.form.city_label}
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#1B4332] focus:outline-none text-sm bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      {checkoutData.form.note_label}
                    </label>
                    <input
                      type="text"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder={checkoutData.form.note_placeholder}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#1B4332] focus:outline-none text-sm"
                    />
                  </div>
                </div>

                {/* Payment Selection Block */}
                <div className="pt-4 border-t border-gray-100 space-y-3">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                    {checkoutData.form.payment_method.title}
                  </label>
                  <div className="p-4 rounded-xl border-2 border-[#1B4332] bg-[#1B4332]/5 flex items-start gap-3">
                    <input
                      type="radio"
                      checked
                      readOnly
                      className="mt-1 text-[#1B4332] focus:ring-[#1B4332]"
                    />
                    <div>
                      <h4 className="font-bold text-sm text-[#1B4332]">
                        {checkoutData.form.payment_method.cod_title}
                      </h4>
                      <p className="text-xs text-gray-600 mt-0.5">
                        {checkoutData.form.payment_method.cod_desc}
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 rounded-xl bg-[#1B4332] text-white font-extrabold text-base hover:bg-[#143527] shadow-lg transition disabled:opacity-50 mt-4"
                >
                  {isSubmitting
                    ? checkoutData.form.submitting
                    : checkoutData.form.submit_button.replace(
                        '{amount}',
                        subtotal.toLocaleString('bn-BD')
                      )}
                </button>
              </form>
            </div>

            {/* Right: Order Summary Sidebar */}
            <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-[#1B4332]/15 shadow-sm space-y-6">
              <h3 className="text-lg font-bold text-[#1A1A2E] border-b border-gray-100 pb-3">
                {checkoutData.cart_summary.title}
              </h3>

              <div className="divide-y divide-gray-100 max-h-80 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.productId} className="py-3 flex justify-between items-center text-sm">
                    <div>
                      <h4 className="font-semibold text-gray-900">{item.productName}</h4>
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

              <div className="border-t border-gray-100 pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>{checkoutData.cart_summary.subtotal}</span>
                  <span className="font-semibold">{subtotal.toLocaleString('bn-BD')} ৳</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>{checkoutData.cart_summary.delivery}</span>
                  <span className="font-semibold text-emerald-700">
                    {checkoutData.cart_summary.delivery_free}
                  </span>
                </div>
                <div className="flex justify-between text-base font-extrabold text-[#1B4332] pt-2 border-t border-gray-200">
                  <span>{checkoutData.cart_summary.total}</span>
                  <span>{subtotal.toLocaleString('bn-BD')} ৳</span>
                </div>
              </div>

              <div className="bg-[#FAF3E0] p-4 rounded-2xl border border-[#1B4332]/10 text-xs text-gray-700 space-y-2">
                <div className="flex items-center gap-2 text-[#1B4332] font-bold">
                  <Truck className="w-4 h-4" />
                  <span>{isBn ? 'দ্রুত নিরাপদ হোম ডেলিভারি' : 'Fast & Safe Home Delivery'}</span>
                </div>
                <div className="flex items-center gap-2 text-[#1B4332] font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>{isBn ? '১০০% ক্যাশ অন ডেলিভারি সুবিধা' : '100% Cash on Delivery Guarantee'}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
