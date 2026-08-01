import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import path from "path";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  webpack(config) {
    config.resolve.alias["next-intl/config"] = path.resolve("./src/i18n/request.ts");
    return config;
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/en",
        permanent: true,
      },
    ];
  },
};

const finalConfig = withNextIntl(nextConfig) as any;

if (finalConfig.experimental?.turbo) {
  finalConfig.turbopack = {
    ...finalConfig.turbopack,
    resolveAlias: {
      ...finalConfig.turbopack?.resolveAlias,
      ...finalConfig.experimental.turbo.resolveAlias,
      "next-intl/config": "./src/i18n/request.ts",
    },
  };
  delete finalConfig.experimental.turbo;
}

export default finalConfig;
