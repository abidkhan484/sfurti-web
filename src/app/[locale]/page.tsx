import { Suspense } from "react";
import { setRequestLocale } from "next-intl/server";
import HeroSection from "@/components/sections/Hero";
import ProblemSection from "@/components/sections/Problem";
import ThesisSection from "@/components/sections/Thesis";
import ProductsSection from "@/components/sections/Products";
import SurveySection from "@/components/sections/Survey";
import FAQSection from "@/components/sections/FAQ";
import SecondaryCTASection from "@/components/sections/SecondaryCTA";
import Footer from "@/components/sections/Footer";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <Suspense fallback={null}>
        <HeroSection />
      </Suspense>
      <ProblemSection />
      <ThesisSection />
      <ProductsSection />
      <Suspense fallback={null}>
        <SurveySection />
      </Suspense>
      <FAQSection />
      <Suspense fallback={null}>
        <SecondaryCTASection />
      </Suspense>
      <Footer />
    </>
  );
}
