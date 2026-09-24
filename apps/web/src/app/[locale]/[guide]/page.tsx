import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { NonnaLogo } from "@/components/icons/NonnaLogo";
import { ThemeToggle } from "@/components/layout/header/ThemeToggle";
import {
  guideCopy,
  guideLocales,
  guideSlugs,
  isGuideLocale,
  isGuideSlug,
  transferGuides,
} from "@/lib/content/transfer-guides";
import { SEO_CONFIG } from "@/lib/seo/config/base";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo/generators/metadata";
import { SourceServices } from "../_components/SourceServices";

type PageProps = { params: Promise<{ locale: string; guide: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return guideLocales.flatMap(locale => guideSlugs.map(guide => ({ locale, guide })));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, guide } = await params;
  if (!isGuideLocale(locale) || !isGuideSlug(guide)) notFound();
  const content = transferGuides[locale][guide];
  return generateSEOMetadata({
    locale,
    availableLocales: guideLocales,
    pathname: `/${guide}`,
    title: content.title,
    description: content.description,
  });
}

const linkClass =
  "underline decoration-indigo-300 underline-offset-4 hover:text-indigo-600 dark:hover:text-indigo-300";

export default async function TransferGuidePage({ params }: PageProps) {
  const { locale, guide } = await params;
  if (!isGuideLocale(locale) || !isGuideSlug(guide)) notFound();
  setRequestLocale(locale);
  const content = transferGuides[locale][guide];
  const copy = guideCopy[locale];
  const reverse =
    guide === "spotify-to-apple-music" ? "apple-music-to-spotify" : "spotify-to-apple-music";
  const url = `${SEO_CONFIG.brand.url}/${locale}/${guide}`;
  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${url}#webpage`,
      url,
      name: content.title,
      description: content.description,
      inLanguage: locale,
      isPartOf: { "@id": `${SEO_CONFIG.brand.url}#website` },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: copy.home,
          item: `${SEO_CONFIG.brand.url}/${locale}`,
        },
        { "@type": "ListItem", position: 2, name: content.title, item: url },
      ],
    },
  ];

  return (
    <div className="min-h-dvh text-zinc-800 dark:text-stone-200">
      <header className="border-b border-indigo-200/40 dark:border-indigo-800/30">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-4">
          <a
            href={`/${locale}`}
            className="flex items-center gap-2 font-black uppercase italic"
            aria-label={`Nonna.fm — ${copy.home}`}
          >
            <NonnaLogo size={30} />
            nonna.fm
          </a>
          <div className="flex items-center gap-5">
            <nav aria-label={copy.languages} className="flex gap-3 text-sm">
              {guideLocales.map(language => (
                <a
                  key={language}
                  href={`/${language}/${guide}`}
                  hrefLang={language}
                  lang={language}
                  aria-current={locale === language ? "page" : undefined}
                  className={linkClass}
                >
                  {language === "en" ? "English" : "Français"}
                </a>
              ))}
            </nav>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 pb-16">
        <nav
          aria-label={locale === "en" ? "Breadcrumb" : "Fil d’Ariane"}
          className="py-6 text-sm text-zinc-600 dark:text-stone-400"
        >
          <a href={`/${locale}`} className={linkClass}>
            {copy.home}
          </a>
          <span aria-hidden="true" className="px-3">
            /
          </span>
          <span>
            {content.sourceName} → {content.targetName}
          </span>
        </nav>

        <section className="grid items-center gap-10 pb-16 pt-4 lg:grid-cols-[1.6fr_1fr] lg:gap-16">
          <div>
            <p className="mb-5 text-sm font-semibold text-indigo-700 dark:text-indigo-300">
              {copy.eyebrow}
            </p>
            <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              {content.title}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-zinc-600 dark:text-stone-300">
              {content.intro}
            </p>
            <a href="#steps" className={`mt-6 inline-block font-medium ${linkClass}`}>
              {copy.steps} ↓
            </a>
          </div>
          <div className="rounded-3xl border border-indigo-200 bg-white/70 p-6 text-center shadow-sm dark:border-indigo-800/50 dark:bg-indigo-950/50">
            <h2 className="text-xl font-semibold">{copy.start}</h2>
            <SourceServices onlyService={content.source} />
            <p className="text-sm text-zinc-600 dark:text-stone-400">
              {copy.next} {content.targetName}.
            </p>
            <noscript>
              <p className="mt-4 text-sm">{copy.js}</p>
            </noscript>
          </div>
        </section>

        <div className="max-w-3xl space-y-14">
          <section>
            <h2 className="mb-5 text-2xl font-semibold">{copy.requirements}</h2>
            <ul className="list-disc space-y-3 pl-5 text-lg leading-relaxed text-zinc-600 dark:text-stone-300">
              {content.requirements.map(item => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          {/* biome-ignore lint/correctness/useUniqueElementIds: One page instance; stable public fragment link. */}
          <section id="steps" className="scroll-mt-6">
            <h2 className="mb-8 text-3xl font-semibold">{copy.steps}</h2>
            <ol className="space-y-8">
              {content.steps.map((step, index) => (
                <li key={step.title} className="flex gap-5">
                  <span
                    className="flex size-9 shrink-0 items-center justify-center rounded-full bg-indigo-100 font-semibold text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-200"
                    aria-hidden="true"
                  >
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="mb-2 text-xl font-semibold">{step.title}</h3>
                    <p className="leading-relaxed text-zinc-600 dark:text-stone-300">{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section>
            <h2 className="mb-6 text-3xl font-semibold">{copy.supported}</h2>
            <dl className="divide-y divide-indigo-200/50 rounded-2xl border border-indigo-200/50 bg-white/50 px-6 dark:divide-indigo-800/40 dark:border-indigo-800/40 dark:bg-indigo-950/30">
              {content.items.map(item => (
                <div key={item.name} className="py-5">
                  <dt className="mb-2 font-semibold">{item.name}</dt>
                  <dd className="leading-relaxed text-zinc-600 dark:text-stone-300">
                    {item.detail}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          {/* biome-ignore lint/correctness/useUniqueElementIds: One page instance; stable public fragment link. */}
          <section id="limits" className="scroll-mt-6">
            <h2 className="mb-5 text-3xl font-semibold">{copy.limits}</h2>
            <p className="mb-4 leading-relaxed text-zinc-600 dark:text-stone-300">
              {copy.limitText}
            </p>
            <p className="leading-relaxed text-zinc-600 dark:text-stone-300">{copy.resetText}</p>
          </section>

          <section>
            <h2 className="mb-6 text-3xl font-semibold">{copy.faq}</h2>
            <div className="space-y-7">
              {content.questions.map(item => (
                <div key={item.question}>
                  <h3 className="mb-2 text-xl font-semibold">{item.question}</h3>
                  <p className="leading-relaxed text-zinc-600 dark:text-stone-300">{item.answer}</p>
                </div>
              ))}
            </div>
            {content.source === "spotify" && (
              <a
                className={`mt-5 inline-block ${linkClass}`}
                href={`https://support.apple.com/${locale === "fr" ? "fr-fr" : "en-us"}/118249`}
              >
                {copy.appleHelp} ↗
              </a>
            )}
          </section>

          <section className="rounded-3xl bg-indigo-100/60 p-7 dark:bg-indigo-950/70">
            <h2 className="mb-4 text-2xl font-semibold">{copy.trust}</h2>
            <p className="mb-4 leading-relaxed text-zinc-600 dark:text-stone-300">
              {copy.trustText}
            </p>
            <p className="leading-relaxed text-zinc-600 dark:text-stone-300">{copy.ownerText}</p>
            <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3">
              <a href={SEO_CONFIG.social.support} className={linkClass}>
                {copy.support}
              </a>
              <a href={SEO_CONFIG.social.github} className={linkClass}>
                {copy.code}
              </a>
            </div>
          </section>

          <nav
            aria-label={copy.related}
            className="border-t border-indigo-200/50 pt-8 dark:border-indigo-800/40"
          >
            <p className="mb-3 text-sm text-zinc-600 dark:text-stone-400">{copy.related}</p>
            <a href={`/${locale}/${reverse}`} className={`text-xl font-semibold ${linkClass}`}>
              {transferGuides[locale][reverse].title} →
            </a>
          </nav>
        </div>
      </main>

      <footer className="border-t border-indigo-200/40 px-5 py-7 dark:border-indigo-800/30">
        <div className="mx-auto flex max-w-6xl flex-wrap gap-x-6 gap-y-3 text-sm">
          <a href={`/${locale}`} className={linkClass}>
            Nonna.fm
          </a>
          <a href={`${SEO_CONFIG.social.github}/blob/main/PRIVACY.md`} className={linkClass}>
            {copy.privacy}
          </a>
          <a href={`${SEO_CONFIG.social.github}/blob/main/TERMS.md`} className={linkClass}>
            {copy.terms}
          </a>
          <a href={SEO_CONFIG.social.support} className={linkClass}>
            {copy.support}
          </a>
        </div>
      </footer>
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD escapes HTML delimiters.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas).replace(/</g, "\\u003c") }}
      />
    </div>
  );
}
