"use client";

import { useTranslations } from "next-intl";

type NotifyMeCTAProps = {
  showCTA: boolean;
};

export default function NotifyMeCTA({ showCTA }: NotifyMeCTAProps) {
  const t = useTranslations("header");

  const handleClick = () => {
    const heroForm = document.getElementById("hero-cta-form");
    if (heroForm) {
      heroForm.scrollIntoView({ behavior: "smooth" });
      const input = heroForm.querySelector("input");
      if (input) {
        input.focus();
      }
    }
  };

  return (
    <button
      onClick={handleClick}
      type="button"
      className={`hidden items-center justify-center rounded-lg bg-[#1B4332] px-4 py-2 text-sm font-medium text-white shadow-sm transition-all duration-300 hover:bg-[#143527] focus:ring-2 focus:ring-[#1B4332] focus:ring-offset-2 focus:outline-none md:inline-flex ${
        showCTA ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-2 opacity-0"
      }`}
    >
      {t("cta")}
    </button>
  );
}
