import { SITE } from "@/lib/site";

export function absolute(path: string) {
  if (path.startsWith("http")) return path;
  return `${SITE.url}${path}`;
}

export type JsonLdObject = Record<string, unknown>;

export function schoolSchema(): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "School",
    "@id": `${SITE.url}/#school`,
    name: SITE.name,
    alternateName: SITE.alternateName,
    url: SITE.url,
    logo: absolute(SITE.logo),
    image: [absolute(SITE.image), absolute(SITE.ogImage.path)],
    description: SITE.description,
    slogan: SITE.motto,
    foundingDate: String(SITE.established),
    email: SITE.email,
    telephone: SITE.phones.map((p) => p.tel),
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.address.streetAddress,
      addressLocality: SITE.address.addressLocality,
      addressRegion: SITE.address.addressRegion,
      addressCountry: SITE.address.country,
    },
    openingHoursSpecification: SITE.officeHours.map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek:
        h.days === "Saturday"
          ? "Saturday"
          : ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: h.opens,
      closes: h.closes,
    })),
    knowsAbout: [
      "Early Years education",
      "Primary education",
      "Secondary education",
      "Admissions and enrolment",
    ],
  };
}

export function websiteSchema(): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE.url}/#website`,
    url: SITE.url,
    name: SITE.name,
    description: SITE.description,
    inLanguage: "en",
    publisher: {
      "@id": `${SITE.url}/#school`,
    },
  };
}

export function webPageSchema({
  path,
  name,
  description,
}: {
  path: string;
  name: string;
  description?: string;
}): JsonLdObject {
  const pageUrl = absolute(path);
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${pageUrl}#webpage`,
    url: pageUrl,
    name,
    description,
    inLanguage: "en",
    isPartOf: {
      "@id": `${SITE.url}/#website`,
    },
    about: {
      "@id": `${SITE.url}/#school`,
    },
  };
}

export function breadcrumbSchema(
  items: { name: string; path?: string }[],
): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      ...(item.path ? { item: absolute(item.path) } : {}),
    })),
  };
}

export function faqSchema(
  items: { q: string; a: string }[],
): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };
}