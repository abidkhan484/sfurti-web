import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as "bn" | "en")) {
    locale = routing.defaultLocale;
  }

  const home = (await import(`../../content/${locale}/home.json`)).default;
  const about = (await import(`../../content/${locale}/about.json`)).default;
  const contact = (await import(`../../content/${locale}/contact.json`)).default;

  return {
    locale,
    messages: {
      ...home,
      about,
      contact,
    },
  };
});
