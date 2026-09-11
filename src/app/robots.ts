import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

const crawlerAllows: { userAgent: string }[] = [
  { userAgent: "Googlebot" },
  { userAgent: "Bingbot" },
  { userAgent: "Applebot" },
  { userAgent: "OAI-SearchBot" },
  { userAgent: "ChatGPT-User" },
  { userAgent: "PerplexityBot" },
  { userAgent: "ClaudeBot" },
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      ...crawlerAllows.map(({ userAgent }) => ({
        userAgent,
        allow: "/",
      })),
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/login",
          "/api",
          "/dashboard",
          "/admin",
          "/teacher",
          "/parent",
          "/student",
          "/super-admin",
        ],
      },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}