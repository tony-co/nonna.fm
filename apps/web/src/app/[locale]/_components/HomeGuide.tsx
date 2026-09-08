import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import type { Locale } from "@/lib/seo/config/base";

const languageNames: Record<Locale, string> = {
  en: "English",
  fr: "Français",
  es: "Español",
  pt: "Português",
  it: "Italiano",
  de: "Deutsch",
  ja: "日本語",
};

export async function HomeGuide({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "HomePage" });

  return (
    <div className="mx-auto max-w-5xl space-y-16 px-4 pb-16 text-zinc-800 dark:text-stone-200">
      <section aria-label={t("guide.title")}>
        <h2 className="mb-6 text-3xl font-semibold">{t("guide.title")}</h2>
        <p className="mb-6 text-lg text-zinc-600 dark:text-stone-400">{t("description")}</p>
        <ol className="list-decimal space-y-4 pl-6 text-lg">
          {(["connect", "select", "transfer"] as const).map(step => (
            <li key={step}>{t(`guide.${step}`)}</li>
          ))}
        </ol>
      </section>

      <section aria-label={t("faq.title")}>
        <h2 className="mb-6 text-3xl font-semibold">{t("faq.title")}</h2>
        <div className="space-y-8">
          {(["services", "free", "originals", "matching"] as const).map(question => (
            <div key={question}>
              <h3 className="mb-2 text-xl font-semibold">{t(`faq.${question}.question`)}</h3>
              <p className="text-lg text-zinc-600 dark:text-stone-400">
                {t(`faq.${question}.answer`)}
              </p>
            </div>
          ))}
        </div>
      </section>

      <nav aria-label={t("languages")} className="flex flex-wrap justify-center gap-x-6 gap-y-3">
        {routing.locales.map(language => (
          <a
            key={language}
            href={`/${language}`}
            hrefLang={language}
            lang={language}
            aria-current={language === locale ? "page" : undefined}
            className="underline decoration-indigo-300 underline-offset-4 hover:text-indigo-600 dark:hover:text-indigo-300"
          >
            {languageNames[language]}
          </a>
        ))}
      </nav>
    </div>
  );
}
