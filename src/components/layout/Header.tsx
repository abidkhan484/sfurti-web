"use client";

import { useState, useEffect } from "react";
import { Link } from "@/i18n/routing";
import NavLinks from "./NavLinks";
import LanguageToggle from "./LanguageToggle";
import NotifyMeCTA from "./NotifyMeCTA";
import MobileMenu from "./MobileMenu";
import { Menu, X } from "lucide-react";

type HeaderProps = {
  locale?: string;
};

export default function Header({ locale: _locale }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showCTA, setShowCTA] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = (): void => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const heroEl = document.getElementById("hero-section");
    if (!heroEl) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry) {
          setShowCTA(!entry.isIntersecting);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(heroEl);
    return () => observer.disconnect();
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b border-[#2D6A4F]/20 transition-all duration-200 ${
        isScrolled ? "bg-[#FAF3E0]/90 shadow-sm backdrop-blur-md" : "bg-[#FAF3E0]"
      }`}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between md:h-18">
          {/* Wordmark */}
          <Link
            href="/"
            className="font-['Hind_Siliguri',sans-serif] text-2xl font-bold tracking-tight text-[#2D6A4F] transition-opacity hover:opacity-90 md:text-3xl"
          >
            স্ফূর্তি
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-8 md:flex">
            <NavLinks />
            <div className="h-4 w-px bg-[#1A1A2E]/20" />
            <LanguageToggle />
            <NotifyMeCTA showCTA={showCTA} />
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex items-center gap-3 md:hidden">
            <LanguageToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="p-2 text-[#1A1A2E] hover:text-[#2D6A4F] focus:outline-none"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <MobileMenu isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </header>
  );
}
