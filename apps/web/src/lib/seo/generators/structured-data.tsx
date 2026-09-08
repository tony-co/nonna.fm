import type { Locale } from "../config/base";
import { getHomepageSchemas } from "../config/structured-data";

export function HomepageStructuredData({
  locale,
  description,
}: {
  locale: Locale;
  description: string;
}) {
  return (
    <script
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD escapes HTML delimiters.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(getHomepageSchemas(locale, description)).replace(/</g, "\\u003c"),
      }}
    />
  );
}
