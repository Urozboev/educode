import type { MetadataRoute } from "next";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/seo";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_NAME} — ${SITE_TAGLINE}`,
    short_name: SITE_NAME,
    description:
      "Interaktiv dasturlash kurslari, AI Sokratik mentor va gamifikatsiya — bitta platformada.",
    start_url: "/",
    display: "standalone",
    background_color: "#f9f9fc",
    theme_color: "#4A34D8",
    orientation: "portrait",
    categories: ["education", "productivity", "developer"],
    lang: "uz-UZ",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "maskable" },
    ],
  };
}
