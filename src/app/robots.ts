import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard", "/admin", "/teacher", "/parent", "/student", "/super-admin"],
      },
    ],
    sitemap: "https://elbethelthekings.xyz/sitemap.xml",
  };
}