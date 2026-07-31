"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Facebook, Instagram, Phone, ArrowLeft } from "lucide-react";

export default function ContactPage() {
  const t = useTranslations("contact");

  return (
    <div className="flex min-h-screen flex-col justify-center bg-[#FAF3E0] py-16 md:py-24">
      <div className="mx-auto max-w-2xl space-y-8 px-4 text-center sm:px-6 lg:px-8">
        <div>
          <h1 className="font-['Hind_Siliguri',sans-serif] text-3xl font-bold text-[#1A1A2E] sm:text-4xl md:text-5xl">
            {t("headline")}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-[#1A1A2E]/80 sm:text-lg">{t("body")}</p>
        </div>

        {/* Social Links */}
        <div className="mx-auto grid max-w-md grid-cols-1 gap-4 sm:grid-cols-2">
          <a
            href={t("social.facebook.href")}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 rounded-xl border border-[#1B4332] bg-white px-6 py-4 font-semibold text-[#1B4332] shadow-sm transition-colors hover:bg-[#1B4332] hover:text-white"
          >
            <Facebook className="h-5 w-5" />
            <span>{t("social.facebook.label")}</span>
          </a>
          <a
            href={t("social.instagram.href")}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 rounded-xl border border-[#1B4332] bg-white px-6 py-4 font-semibold text-[#1B4332] shadow-sm transition-colors hover:bg-[#1B4332] hover:text-white"
          >
            <Instagram className="h-5 w-5" />
            <span>{t("social.instagram.label")}</span>
          </a>
        </div>

        {/* Phone Optional Contact */}
        {t("phone.number") && (
          <div className="flex items-center justify-center gap-2 text-base font-semibold text-[#1B4332]">
            <Phone className="h-4 w-4" />
            <span>
              {t("phone.label")}: {t("phone.number")}
            </span>
          </div>
        )}

        {/* Back to Home Link */}
        <div className="pt-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#1B4332] hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>{t("back_link")}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
