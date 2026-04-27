import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api1.eless.com.pe",
        pathname: "/storage/**",
      },
      {
        protocol: "https",
        hostname: "elesstyle.com",
      },
    ],
    // Permite que <img> normales sean tan tolerantes como <Image>
    dangerouslyAllowSVG: true,
  },
};

export default nextConfig;
