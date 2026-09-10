import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "EL-BETH-EL The Kings' School",
    short_name: "EL-BETH-EL",
    description:
      "EL-BETH-EL The Kings' School — Fountain of Knowledge. A place where knowledge meets character, excellence meets opportunity.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0b1f4b",
    icons: [
      { src: "/icon.png", sizes: "48x48", type: "image/png" },
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}