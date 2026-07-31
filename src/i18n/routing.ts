import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export const routing = defineRouting({
  locales: ["en", "bn"],
  defaultLocale: "en",
  localePrefix: "always",
  pathnames: {
    "/": "/",
    "/about": "/about",
    "/contact": "/contact",
  },
});

export const { Link, redirect, usePathname, useRouter } = createNavigation(routing);
