import type { MetadataRoute } from "next";

const BASE_URL = "https://elbethelthekings.xyz";

const PUBLIC_PAGES: Array<{
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}> = [
  { path: "", changeFrequency: "weekly", priority: 1 },
  { path: "/about", changeFrequency: "monthly", priority: 0.8 },
  { path: "/academics", changeFrequency: "monthly", priority: 0.8 },
  { path: "/admissions", changeFrequency: "monthly", priority: 0.9 },
  { path: "/admissions/apply", changeFrequency: "monthly", priority: 0.9 },
  { path: "/gallery", changeFrequency: "weekly", priority: 0.6 },
  { path: "/news", changeFrequency: "weekly", priority: 0.7 },
  { path: "/student-life", changeFrequency: "monthly", priority: 0.6 },
  { path: "/contact", changeFrequency: "yearly", priority: 0.6 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return PUBLIC_PAGES.map(({ path, changeFrequency, priority }) => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }));
}