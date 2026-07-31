import { getMessages, setRequestLocale } from "next-intl/server";
import ContactPage from "@/components/pages/ContactPage";
import Footer from "@/components/sections/Footer";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const messages = (await getMessages()) as {
    contact?: { meta?: { title?: string; description?: string } };
  };

  return {
    title: messages.contact?.meta?.title ?? "Contact Us — Sfurti",
    description: messages.contact?.meta?.description ?? "Get in touch with Sfurti team",
  };
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <ContactPage />
      <Footer />
    </>
  );
}
