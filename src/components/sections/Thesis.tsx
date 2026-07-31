"use client";

import { useTranslations } from "next-intl";
import { Hand, Brain, Puzzle } from "lucide-react";

export default function ThesisSection() {
  const t = useTranslations("thesis");

  const iconMap = {
    hand: Hand,
    brain: Brain,
    puzzle: Puzzle,
  };

  const pillars = [
    {
      iconKey: "hand" as const,
      title: t("pillars.0.title"),
      body: t("pillars.0.body"),
    },
    {
      iconKey: "brain" as const,
      title: t("pillars.1.title"),
      body: t("pillars.1.body"),
    },
    {
      iconKey: "puzzle" as const,
      title: t("pillars.2.title"),
      body: t("pillars.2.body"),
    },
  ];

  return (
    <section className="bg-[#FAF3E0] py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-['Hind_Siliguri',sans-serif] text-2xl font-bold tracking-tight text-[#1A1A2E] sm:text-3xl md:text-4xl">
            {t("headline")}
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
          {pillars.map((pillar, index) => {
            const IconComponent = iconMap[pillar.iconKey];
            return (
              <div
                key={index}
                className="flex flex-col items-start rounded-2xl border border-[#2D6A4F]/15 bg-white/70 p-8 text-left shadow-sm backdrop-blur-sm transition-shadow hover:shadow-md"
              >
                <div className="mb-6 rounded-xl bg-[#E8A838]/15 p-3 text-[#E8A838]">
                  <IconComponent className="h-8 w-8 text-[#E8A838]" />
                </div>
                <h3 className="font-['Hind_Siliguri',sans-serif] text-xl font-bold text-[#1A1A2E]">
                  {pillar.title}
                </h3>
                <p className="mt-3 text-base leading-relaxed text-[#1A1A2E]/75">{pillar.body}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
