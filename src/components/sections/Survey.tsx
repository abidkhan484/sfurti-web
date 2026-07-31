"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useUTM } from "@/hooks/useUTM";
import { useDevice } from "@/hooks/useDevice";
import { track } from "@vercel/analytics";

export default function SurveySection() {
  const t = useTranslations("survey");
  const utm = useUTM();
  const device = useDevice();

  const [childAgeRange, setChildAgeRange] = useState("3-5");
  const [screenTimeConcern, setScreenTimeConcern] = useState(4);
  const [wouldTry, setWouldTry] = useState("yes");
  const [priceExpectation, setPriceExpectation] = useState("500-1000");
  const [openFeedback, setOpenFeedback] = useState("");

  const [status, setStatus] = useState<"idle" | "submitting" | "submitted" | "error">("idle");
  const [surveyId, setSurveyId] = useState<string | null>(null);

  // Soft phone prompt state
  const [phone, setPhone] = useState("");
  const [phoneStatus, setPhoneStatus] = useState<"idle" | "submitting" | "success" | "skipped">(
    "idle"
  );

  const handleSurveySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");

    try {
      const res = await fetch("/api/survey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          childAgeRange,
          screenTimeConcern,
          wouldTry,
          priceExpectation,
          openFeedback: openFeedback.trim() || null,
          ...utm,
          device,
        }),
      });

      if (!res.ok) throw new Error("Survey submission failed");
      const data = (await res.json()) as { success: boolean; id: string };
      setSurveyId(data.id);
      track("survey_submitted", {
        childAgeRange,
        screenTimeConcern,
        wouldTry,
        priceExpectation,
        hasOpenFeedback: !!openFeedback.trim(),
        device,
      });
      setStatus("submitted");
    } catch {
      setStatus("error");
    }
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) return;

    setPhoneStatus("submitting");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: phone.trim(),
          source: "survey_soft_prompt",
          ...utm,
          device,
        }),
      });

      if (!res.ok) throw new Error("Phone submission failed");
      track("lead_captured", { source: "survey_soft_prompt", device });
      setPhoneStatus("success");
    } catch {
      setPhoneStatus("idle");
    }
  };

  return (
    <section id="survey-section" className="bg-[#2D6A4F]/10 py-16 md:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="font-['Hind_Siliguri',sans-serif] text-2xl font-bold tracking-tight text-[#1A1A2E] sm:text-3xl md:text-4xl">
            {t("headline")}
          </h2>
          <p className="mt-3 text-base text-[#1A1A2E]/80 sm:text-lg">{t("subheadline")}</p>
        </div>

        <div className="mt-10 rounded-2xl border border-[#2D6A4F]/20 bg-white p-6 shadow-md sm:p-10">
          {status !== "submitted" ? (
            <form onSubmit={handleSurveySubmit} className="space-y-8">
              {/* Question 1 — Age Range */}
              <div>
                <label className="mb-3 block text-base font-bold text-[#1A1A2E] sm:text-lg">
                  {t("questions.age.label")}
                </label>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {[
                    { value: "3-5", label: t("questions.age.options.0.label") },
                    { value: "6-9", label: t("questions.age.options.1.label") },
                    { value: "10-13", label: t("questions.age.options.2.label") },
                    { value: "14+", label: t("questions.age.options.3.label") },
                  ].map((option) => (
                    <label
                      key={option.value}
                      className={`flex cursor-pointer items-center justify-center rounded-xl border p-3 text-sm font-medium transition-colors ${
                        childAgeRange === option.value
                          ? "border-[#2D6A4F] bg-[#2D6A4F]/10 font-bold text-[#2D6A4F]"
                          : "border-gray-200 bg-gray-50/50 text-[#1A1A2E]/80 hover:bg-gray-100"
                      }`}
                    >
                      <input
                        type="radio"
                        name="childAgeRange"
                        value={option.value}
                        checked={childAgeRange === option.value}
                        onChange={(e) => setChildAgeRange(e.target.value)}
                        className="sr-only"
                      />
                      {option.label}
                    </label>
                  ))}
                </div>
              </div>

              {/* Question 2 — Screen Time Concern */}
              <div>
                <label className="mb-3 block text-base font-bold text-[#1A1A2E] sm:text-lg">
                  {t("questions.screenTime.label")}
                </label>
                <div className="mx-auto my-2 flex max-w-md items-center justify-between gap-2">
                  <span className="text-xs font-medium text-[#1A1A2E]/60">
                    {t("questions.screenTime.scale_min")}
                  </span>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setScreenTimeConcern(num)}
                        className={`h-10 w-10 rounded-full text-sm font-bold transition-all ${
                          screenTimeConcern === num
                            ? "scale-110 bg-[#2D6A4F] text-white shadow-md"
                            : "bg-gray-100 text-[#1A1A2E]/70 hover:bg-gray-200"
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                  <span className="text-xs font-medium text-[#1A1A2E]/60">
                    {t("questions.screenTime.scale_max")}
                  </span>
                </div>
              </div>

              {/* Question 3 — Would Try */}
              <div>
                <label className="mb-3 block text-base font-bold text-[#1A1A2E] sm:text-lg">
                  {t("questions.wouldTry.label")}
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: "yes", label: t("questions.wouldTry.options.0.label") },
                    { value: "maybe", label: t("questions.wouldTry.options.1.label") },
                    { value: "no", label: t("questions.wouldTry.options.2.label") },
                  ].map((option) => (
                    <label
                      key={option.value}
                      className={`flex cursor-pointer items-center justify-center rounded-xl border p-3 text-sm font-medium transition-colors ${
                        wouldTry === option.value
                          ? "border-[#2D6A4F] bg-[#2D6A4F]/10 font-bold text-[#2D6A4F]"
                          : "border-gray-200 bg-gray-50/50 text-[#1A1A2E]/80 hover:bg-gray-100"
                      }`}
                    >
                      <input
                        type="radio"
                        name="wouldTry"
                        value={option.value}
                        checked={wouldTry === option.value}
                        onChange={(e) => setWouldTry(e.target.value)}
                        className="sr-only"
                      />
                      {option.label}
                    </label>
                  ))}
                </div>
              </div>

              {/* Question 4 — Price Expectation */}
              <div>
                <label className="mb-3 block text-base font-bold text-[#1A1A2E] sm:text-lg">
                  {t("questions.price.label")}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: "<500", label: t("questions.price.options.0.label") },
                    { value: "500-1000", label: t("questions.price.options.1.label") },
                    { value: "1000-2000", label: t("questions.price.options.2.label") },
                    { value: ">2000", label: t("questions.price.options.3.label") },
                  ].map((option) => (
                    <label
                      key={option.value}
                      className={`flex cursor-pointer items-center justify-center rounded-xl border p-3 text-sm font-medium transition-colors ${
                        priceExpectation === option.value
                          ? "border-[#2D6A4F] bg-[#2D6A4F]/10 font-bold text-[#2D6A4F]"
                          : "border-gray-200 bg-gray-50/50 text-[#1A1A2E]/80 hover:bg-gray-100"
                      }`}
                    >
                      <input
                        type="radio"
                        name="priceExpectation"
                        value={option.value}
                        checked={priceExpectation === option.value}
                        onChange={(e) => setPriceExpectation(e.target.value)}
                        className="sr-only"
                      />
                      {option.label}
                    </label>
                  ))}
                </div>
              </div>

              {/* Question 5 — Open Feedback */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="block text-base font-bold text-[#1A1A2E] sm:text-lg">
                    {t("questions.openFeedback.label")}
                  </label>
                  <span className="text-xs font-medium text-[#1A1A2E]/50">
                    ({t("questions.openFeedback.optional_label")})
                  </span>
                </div>
                <textarea
                  rows={3}
                  value={openFeedback}
                  onChange={(e) => setOpenFeedback(e.target.value)}
                  placeholder={t("questions.openFeedback.placeholder")}
                  className="w-full rounded-xl border border-gray-300 p-3 text-sm text-[#1A1A2E] placeholder-[#1A1A2E]/40 focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#2D6A4F]/20 focus:outline-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={status === "submitting"}
                className="w-full rounded-xl bg-[#1B4332] py-3.5 text-base font-bold text-white shadow-md transition-all hover:bg-[#143527] focus:ring-2 focus:ring-[#1B4332] focus:outline-none disabled:opacity-60"
              >
                {status === "submitting" ? t("submitting") : t("submit")}
              </button>

              {status === "error" && (
                <p className="text-center text-sm font-medium text-red-600">
                  {t("success.soft_prompt.error")}
                </p>
              )}
            </form>
          ) : (
            /* Post-Survey Soft Phone Prompt */
            <div className="py-6 text-center">
              {surveyId && <span className="sr-only">Survey ID: {surveyId}</span>}
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#2D6A4F]/15 text-[#2D6A4F]">
                <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="font-['Hind_Siliguri',sans-serif] text-2xl font-bold text-[#1A1A2E]">
                {t("success.headline")}
              </h3>
              <p className="mt-2 text-base text-[#1A1A2E]/80">{t("success.body")}</p>

              {phoneStatus === "idle" && (
                <div className="mt-8 border-t border-gray-200 pt-6">
                  <p className="mb-4 text-sm font-semibold text-[#2D6A4F]">
                    {t("success.soft_prompt.headline")}
                  </p>
                  <form
                    onSubmit={handlePhoneSubmit}
                    className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row"
                  >
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder={t("success.soft_prompt.placeholder")}
                      required
                      className="flex-1 rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-[#2D6A4F] focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="rounded-xl bg-[#2D6A4F] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#23533e]"
                    >
                      {t("success.soft_prompt.cta")}
                    </button>
                  </form>
                  <button
                    type="button"
                    onClick={() => setPhoneStatus("skipped")}
                    className="mt-3 text-xs text-[#1A1A2E]/50 underline hover:text-[#1A1A2E]"
                  >
                    {t("success.soft_prompt.skip")}
                  </button>
                </div>
              )}

              {phoneStatus === "success" && (
                <p className="mt-6 text-sm font-medium text-[#2D6A4F]">
                  {t("success.soft_prompt.saved")}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
