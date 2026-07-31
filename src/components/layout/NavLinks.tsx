"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";

type NavLinksProps = {
  onItemClick?: () => void;
  className?: string;
};

export default function NavLinks({
  onItemClick,
  className = "flex items-center gap-6",
}: NavLinksProps) {
  const t = useTranslations("nav");
  const pathname = usePathname();

  const links = [
    { href: "/" as const, label: t("home") },
    { href: "/about" as const, label: t("about") },
    { href: "/contact" as const, label: t("contact") },
  ];

  return (
    <nav className={className}>
      {links.map((link) => {
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={onItemClick}
            className={`text-sm transition-colors duration-200 ${
              isActive
                ? "border-b-2 border-[#2D6A4F] pb-1 font-semibold text-[#2D6A4F]"
                : "text-[#1A1A2E]/80 hover:text-[#2D6A4F]"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
