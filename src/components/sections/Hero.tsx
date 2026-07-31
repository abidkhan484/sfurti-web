"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useUTM } from "@/hooks/useUTM";
import { useDevice } from "@/hooks/useDevice";
import { track } from "@vercel/analytics";

export default function HeroSection() {
  const t = useTranslations("hero");
  const utm = useUTM();
  const device = useDevice();

  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) return;

    setStatus("submitting");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: phone.trim(),
          source: "hero",
          ...utm,
          device,
        }),
      });

      if (!res.ok) throw new Error("Submission failed");
      track("lead_captured", { source: "hero", device });
      setStatus("success");
      setPhone("");
    } catch {
      setStatus("error");
    }
  };

  return (
    <section
      id="hero-section"
      className="relative flex min-h-[calc(100vh-4rem)] items-center overflow-hidden bg-[#FAF3E0] py-12 md:py-20"
    >
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-12 md:gap-12">
          {/* Text & Form Column */}
          <div className="flex flex-col items-start text-left md:col-span-7">
            <h1 className="font-['Hind_Siliguri',sans-serif] text-3xl leading-tight font-bold tracking-tight text-[#1A1A2E] sm:text-4xl md:text-5xl lg:text-6xl">
              {t("headline")}
            </h1>
            <p className="mt-4 text-base leading-relaxed text-[#1A1A2E]/80 sm:text-lg md:mt-6 md:text-xl">
              {t("subheadline")}
            </p>

            {/* CTA Form */}
            <form
              id="hero-cta-form"
              onSubmit={handleSubmit}
              className="mt-6 flex w-full max-w-md flex-col gap-3 sm:flex-row md:mt-8"
            >
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={t("form.placeholder")}
                required
                className="flex-1 rounded-xl border border-[#2D6A4F]/30 bg-white/80 px-4 py-3 text-base text-[#1A1A2E] placeholder-[#1A1A2E]/50 shadow-sm focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#2D6A4F]/20 focus:outline-none"
              />
              <button
                type="submit"
                disabled={status === "submitting"}
                className="rounded-xl bg-[#1B4332] px-6 py-3 text-base font-semibold whitespace-nowrap text-white shadow-md transition-all hover:bg-[#143527] focus:ring-2 focus:ring-[#1B4332] focus:outline-none disabled:opacity-60"
              >
                {status === "submitting" ? t("form.submitting") : t("form.cta")}
              </button>
            </form>

            {/* Status Feedback */}
            {status === "success" && (
              <p className="mt-3 text-sm font-medium text-[#2D6A4F]">{t("form.success")}</p>
            )}
            {status === "error" && (
              <p className="mt-3 text-sm font-medium text-red-600">{t("form.error")}</p>
            )}
          </div>

          {/* Illustration Block Column */}
          <div className="flex w-full justify-center md:col-span-5">
            <div className="flex aspect-square w-full max-w-xs flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#2D6A4F]/30 bg-[#2D6A4F]/10 p-8 text-center shadow-inner sm:max-w-sm md:max-w-none">
              <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[#E8A838]/20">
                <svg
                  className="h-10 w-10 text-[#2D6A4F]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M11 4a2 2 0 114 0v1a2 2 0 002 2h3a1 1 0 011 1v3a2 2 0 01-2 2h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a2 2 0 01-2-2v-1a2 2 0 10-4 0v1a2 2 0 01-2 2H4a1 1 0 01-1-1v-3a2 2 0 012-2h1a2 2 0 100-4H4a1 1 0 01-1-1V7a1 1 0 011-1h3a2 2 0 012-2V4z"
                  />
                </svg>
              </div>
              <span className="text-sm font-medium text-[#2D6A4F]">
                {t("illustration_caption")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
