import type { JsonLdObject } from "@/lib/seo/schema";
import { webPageSchema, breadcrumbSchema } from "@/lib/seo/schema";

export function JsonLd({ data }: { data: JsonLdObject }) {
  return (
    <script
      type="application/ld+json"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function PageStructuredData({
  path,
  name,
  description,
  breadcrumb,
}: {
  path: string;
  name: string;
  description?: string;
  breadcrumb?: { name: string; path?: string }[];
}) {
  return (
    <>
      <JsonLd data={webPageSchema({ path, name, description })} />
      {breadcrumb ? <JsonLd data={breadcrumbSchema(breadcrumb)} /> : null}
    </>
  );
}