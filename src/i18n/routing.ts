import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export const routing = defineRouting({
  locales: ["en", "bn"],
  defaultLocale: "en",
  localePrefix: "always",
  pathnames: {
    "/": "/",
    "/products": "/products",
    "/about": "/about",
    "/contact": "/contact",
    "/checkout": "/checkout",
  },
});

export const { Link, redirect, usePathname, useRouter } = createNavigation(routing);
