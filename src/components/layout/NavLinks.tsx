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
    { href: "/" as const, label: t("home"), minWidth: "md:min-w-[56px]" },
    { href: "/about" as const, label: t("about"), minWidth: "md:min-w-[135px]" },
    { href: "/contact" as const, label: t("contact"), minWidth: "md:min-w-[75px]" },
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
            className={`inline-flex items-center justify-start text-sm transition-colors duration-200 md:justify-center ${link.minWidth} ${
              isActive
                ? "border-b-2 border-[#2D6A4F] pb-1 font-semibold text-[#2D6A4F]"
                : "border-b-2 border-transparent pb-1 text-[#1A1A2E]/80 hover:text-[#2D6A4F]"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
