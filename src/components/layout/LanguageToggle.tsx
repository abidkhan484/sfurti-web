"use client";

import { useRouter, usePathname } from "@/i18n/routing";
import { useLocale } from "next-intl";

export default function LanguageToggle() {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale();

  const switchLocale = (newLocale: "bn" | "en") => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <div className="flex items-center gap-2 text-sm">
      <button
        onClick={() => switchLocale("bn")}
        data-locale="bn"
        className={
          currentLocale === "bn"
            ? "cursor-pointer font-bold text-[#2D6A4F] underline"
            : "cursor-pointer text-[#1A1A2E]/60 transition-colors hover:text-[#2D6A4F]"
        }
        type="button"
        aria-label="Switch to Bangla"
      >
        বাংলা
      </button>
      <span className="text-[#1A1A2E]/30">|</span>
      <button
        onClick={() => switchLocale("en")}
        data-locale="en"
        className={
          currentLocale === "en"
            ? "cursor-pointer font-bold text-[#2D6A4F] underline"
            : "cursor-pointer text-[#1A1A2E]/60 transition-colors hover:text-[#2D6A4F]"
        }
        type="button"
        aria-label="Switch to English"
      >
        EN
      </button>
    </div>
  );
}
