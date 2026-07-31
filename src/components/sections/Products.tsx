"use client";

import { useTranslations } from "next-intl";
import { Puzzle, Layers, Shuffle, Wrench } from "lucide-react";

export default function ProductsSection() {
  const t = useTranslations("products");

  const iconMap = {
    puzzle: Puzzle,
    layers: Layers,
    shuffle: Shuffle,
    wrench: Wrench,
  };

  const items = [
    {
      iconKey: "puzzle" as const,
      name: t("items.0.name"),
      description: t("items.0.description"),
    },
    {
      iconKey: "layers" as const,
      name: t("items.1.name"),
      description: t("items.1.description"),
    },
    {
      iconKey: "shuffle" as const,
      name: t("items.2.name"),
      description: t("items.2.description"),
    },
    {
      iconKey: "wrench" as const,
      name: t("items.3.name"),
      description: t("items.3.description"),
    },
  ];

  return (
    <section className="border-t border-[#2D6A4F]/10 bg-[#FAF3E0] py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          <span className="mb-3 inline-flex items-center rounded-full bg-[#2D6A4F]/10 px-3.5 py-1 text-xs font-semibold tracking-wider text-[#2D6A4F] uppercase">
            {t("phase_label")}
          </span>
          <h2 className="font-['Hind_Siliguri',sans-serif] text-2xl font-bold tracking-tight text-[#1A1A2E] sm:text-3xl md:text-4xl">
            {t("headline")}
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, index) => {
            const IconComponent = iconMap[item.iconKey];
            return (
              <div
                key={index}
                className="flex flex-col items-start rounded-xl border border-[#2D6A4F]/20 bg-white/40 p-6 transition-colors hover:border-[#2D6A4F]/40"
              >
                <div className="mb-4 rounded-lg bg-[#2D6A4F]/10 p-3 text-[#2D6A4F]">
                  <IconComponent className="h-6 w-6" />
                </div>
                <h3 className="font-['Hind_Siliguri',sans-serif] text-lg font-bold text-[#1A1A2E]">
                  {item.name}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#1A1A2E]/70">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
