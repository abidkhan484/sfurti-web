"use client";

import { useEffect, useState } from "react";

export function useDevice(): "mobile" | "desktop" {
  const [device, setDevice] = useState<"mobile" | "desktop">("mobile");

  useEffect(() => {
    const ua = navigator.userAgent;
    const isMobile = /Mobi|Android|iPhone|iPad/i.test(ua);
    setDevice(isMobile ? "mobile" : "desktop");
  }, []);

  return device;
}
