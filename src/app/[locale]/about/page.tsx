import { getMessages, setRequestLocale } from "next-intl/server";
import AboutPage from "@/components/pages/AboutPage";
import Footer from "@/components/sections/Footer";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const messages = (await getMessages()) as { about?: { meta?: { title?: string; description?: string } } };

  return {
    title: messages.about?.meta?.title ?? "About Us — Sfurti",
    description: messages.about?.meta?.description ?? "Why Sfurti exists and our core mission for children's cognitive growth",
  };
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <AboutPage />
      <Footer />
    </>
  );
}
