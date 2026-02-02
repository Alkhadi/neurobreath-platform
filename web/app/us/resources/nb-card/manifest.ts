import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "NB-Card",
    short_name: "NB-Card",
    description: "NB-Card — Digital Business Card. Local-first profiles and contact capture.",
    start_url: "/us/resources/nb-card",
    scope: "/us/resources/nb-card",
    display: "standalone",
    background_color: "#f5f3ff",
    theme_color: "#7c3aed",
    icons: [
      {
        src: "/icons/nbcard/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/nbcard/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/nbcard/maskable-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/nbcard/maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
