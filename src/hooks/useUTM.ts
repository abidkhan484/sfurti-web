"use client";

import { useSearchParams } from "next/navigation";

export type UTMParams = {
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
};

export function useUTM(): UTMParams {
  const searchParams = useSearchParams();
  return {
    utmSource: searchParams?.get("utm_source") ?? null,
    utmMedium: searchParams?.get("utm_medium") ?? null,
    utmCampaign: searchParams?.get("utm_campaign") ?? null,
  };
}
