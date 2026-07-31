"use client";

import NavLinks from "./NavLinks";
import LanguageToggle from "./LanguageToggle";

type MobileMenuProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  if (!isOpen) return null;

  return (
    <div className="animate-in slide-in-from-top border-b border-[#2D6A4F]/20 bg-[#FAF3E0] px-4 pt-2 pb-6 shadow-lg duration-200 md:hidden">
      <div className="flex flex-col gap-4">
        <NavLinks
          onItemClick={onClose}
          className="flex flex-col gap-3 pt-2 text-base font-medium"
        />
        <div className="flex items-center justify-between border-t border-[#1A1A2E]/10 pt-2">
          <span className="text-xs text-[#1A1A2E]/60">Language / ভাষা</span>
          <LanguageToggle />
        </div>
      </div>
    </div>
  );
}
