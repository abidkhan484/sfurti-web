"use client";

import { useTranslations } from "next-intl";

export default function ProblemSection() {
  const t = useTranslations("problem");

  return (
    <section className="border-y border-[#2D6A4F]/10 bg-[#2D6A4F]/5 py-16 md:py-24">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="font-['Hind_Siliguri',sans-serif] text-2xl font-bold tracking-tight text-[#1A1A2E] sm:text-3xl md:text-4xl">
          {t("headline")}
        </h2>
        <div className="mt-6 space-y-4 text-base leading-relaxed font-normal text-[#1A1A2E]/80 sm:text-lg md:mt-8 md:text-xl">
          <p>{t("body")}</p>
        </div>
      </div>
    </section>
  );
}
