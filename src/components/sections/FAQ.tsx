"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ChevronDown } from "lucide-react";

export default function FAQSection() {
  const t = useTranslations("faq");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleIndex = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqItems = [
    { q: t("items.0.q"), a: t("items.0.a") },
    { q: t("items.1.q"), a: t("items.1.a") },
    { q: t("items.2.q"), a: t("items.2.a") },
    { q: t("items.3.q"), a: t("items.3.a") },
    { q: t("items.4.q"), a: t("items.4.a") },
  ];

  return (
    <section className="bg-[#FAF3E0] py-16 md:py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="font-['Hind_Siliguri',sans-serif] text-2xl font-bold tracking-tight text-[#1A1A2E] sm:text-3xl md:text-4xl">
            {t("headline")}
          </h2>
        </div>

        <div className="mt-10 space-y-4">
          {faqItems.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="overflow-hidden rounded-xl border border-[#2D6A4F]/20 bg-white/60 shadow-sm transition-all"
              >
                <button
                  type="button"
                  data-faq-item
                  onClick={() => toggleIndex(index)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between p-5 text-left font-['Hind_Siliguri',sans-serif] text-base font-bold text-[#1A1A2E] hover:text-[#2D6A4F] focus:outline-none md:text-lg"
                >
                  <span>{item.q}</span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-[#2D6A4F] transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div
                    data-faq-answer
                    className="border-t border-gray-100 px-5 pt-1 pb-5 text-sm leading-relaxed text-[#1A1A2E]/80 md:text-base"
                  >
                    <p>{item.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
