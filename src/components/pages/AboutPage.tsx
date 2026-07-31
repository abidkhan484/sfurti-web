"use client";

import { useTranslations } from "next-intl";

export default function AboutPage() {
  const t = useTranslations("about");

  return (
    <div className="min-h-screen bg-[#FAF3E0] py-12 md:py-20">
      <div className="mx-auto max-w-4xl space-y-12 px-4 sm:px-6 md:space-y-16 lg:px-8">
        {/* Hero Section */}
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="font-['Hind_Siliguri',sans-serif] text-3xl font-bold text-[#1A1A2E] sm:text-4xl md:text-5xl">
            {t("hero.headline")}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-[#1A1A2E]/80 md:text-xl">
            {t("hero.subheadline")}
          </p>
        </div>

        <hr className="border-[#1B4332]/20" />

        {/* Origin Section */}
        <section className="space-y-4">
          <h2 className="font-['Hind_Siliguri',sans-serif] text-2xl font-bold text-[#1B4332] md:text-3xl">
            {t("origin.headline")}
          </h2>
          <p className="text-base leading-relaxed text-[#1A1A2E]/80 md:text-lg">
            {t("origin.body")}
          </p>
        </section>

        {/* Mission Statement callout */}
        <section className="rounded-2xl border-l-4 border-[#1B4332] bg-white/90 p-8 shadow-sm">
          <h2 className="mb-2 text-sm font-bold tracking-wider text-[#1B4332] uppercase">
            {t("mission.headline")}
          </h2>
          <blockquote className="font-['Hind_Siliguri',sans-serif] text-xl leading-relaxed font-semibold text-[#1A1A2E] md:text-2xl">
            “{t("mission.statement")}”
          </blockquote>
        </section>

        {/* Founder & Team Section */}
        <section className="space-y-4">
          <h2 className="font-['Hind_Siliguri',sans-serif] text-2xl font-bold text-[#1B4332] md:text-3xl">
            {t("team.headline")}
          </h2>
          <p className="text-base leading-relaxed text-[#1A1A2E]/80 md:text-lg">{t("team.body")}</p>
        </section>

        {/* Philosophy Section */}
        <section className="space-y-4">
          <h2 className="font-['Hind_Siliguri',sans-serif] text-2xl font-bold text-[#1B4332] md:text-3xl">
            {t("philosophy.headline")}
          </h2>
          <div className="rounded-xl border border-[#1B4332]/15 bg-white/70 p-6 text-base leading-relaxed whitespace-pre-line text-[#1A1A2E]/80 md:text-lg">
            {t("philosophy.body")}
          </div>
        </section>
      </div>
    </div>
  );
}
