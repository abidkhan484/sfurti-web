"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import LanguageToggle from "../layout/LanguageToggle";

export default function Footer() {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");

  return (
    <footer className="border-t border-white/10 bg-[#1A1A2E] py-12 text-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 border-b border-white/10 pb-8 md:grid-cols-3 md:gap-12">
          {/* Column 1: Brand */}
          <div className="flex flex-col items-start">
            <Link
              href="/"
              className="font-['Hind_Siliguri',sans-serif] text-2xl font-bold text-white"
            >
              স্ফূর্তি
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/70">{t("tagline")}</p>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="flex flex-col gap-2.5">
            <span className="mb-1 text-xs font-semibold tracking-wider text-white/50 uppercase">
              {t("navigation")}
            </span>
            <Link href="/" className="text-sm text-white/80 transition-colors hover:text-white">
              {tNav("home")}
            </Link>
            <Link
              href="/about"
              className="text-sm text-white/80 transition-colors hover:text-white"
            >
              {tNav("about")}
            </Link>
            <Link
              href="/contact"
              className="text-sm text-white/80 transition-colors hover:text-white"
            >
              {tNav("contact")}
            </Link>
          </div>

          {/* Column 3: Social & Language */}
          <div className="flex flex-col gap-3">
            <span className="text-xs font-semibold tracking-wider text-white/50 uppercase">
              {t("social_and_language")}
            </span>
            <div className="flex items-center gap-4 text-sm text-white/80">
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-[#E8A838]"
              >
                {t("social.facebook")}
              </a>
              <span>·</span>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-[#E8A838]"
              >
                {t("social.instagram")}
              </a>
            </div>
            <div className="pt-2">
              <LanguageToggle />
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 pt-6 text-xs text-white/50 sm:flex-row">
          <p>{t("copyright")}</p>
          <Link href="/contact" className="transition-colors hover:text-white">
            {t("contact_link")}
          </Link>
        </div>
      </div>
    </footer>
  );
}
