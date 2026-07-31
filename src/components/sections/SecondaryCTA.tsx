"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useUTM } from "@/hooks/useUTM";
import { useDevice } from "@/hooks/useDevice";
import { track } from "@vercel/analytics";

export default function SecondaryCTASection() {
  const t = useTranslations("secondary_cta");
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
          source: "secondary_cta",
          ...utm,
          device,
        }),
      });

      if (!res.ok) throw new Error("Submission failed");
      track("lead_captured", { source: "secondary_cta", device });
      setStatus("success");
      setPhone("");
    } catch {
      setStatus("error");
    }
  };

  return (
    <section className="bg-[#1B4332] py-16 text-white md:py-20">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="font-['Hind_Siliguri',sans-serif] text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
          {t("headline")}
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-base text-white/90 sm:text-lg">
          {t("subheadline")}
        </p>

        <form
          onSubmit={handleSubmit}
          className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
        >
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder={t("form.placeholder")}
            required
            className="flex-1 rounded-xl border border-white/30 bg-white/10 px-4 py-3 text-base text-white placeholder-white/60 focus:border-white focus:ring-2 focus:ring-white/40 focus:outline-none"
          />
          <button
            type="submit"
            disabled={status === "submitting"}
            className="rounded-xl bg-white px-6 py-3 text-base font-bold whitespace-nowrap text-[#1B4332] shadow-md transition-all hover:bg-[#FAF3E0] focus:ring-2 focus:ring-white focus:outline-none disabled:opacity-60"
          >
            {status === "submitting" ? t("form.submitting") : t("form.cta")}
          </button>
        </form>

        {status === "success" && (
          <p className="mt-3 text-sm font-medium text-[#E8A838]">{t("form.success")}</p>
        )}
        {status === "error" && (
          <p className="mt-3 text-sm font-medium text-red-200">{t("form.error")}</p>
        )}
      </div>
    </section>
  );
}
