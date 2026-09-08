import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Suspense } from "react";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { AudioEqualizer } from "@/components/shared/AudioEqualizer";
import { routing } from "@/i18n/routing";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo/generators/metadata";
import { HomepageStructuredData } from "@/lib/seo/generators/structured-data";
import { HomeGuide } from "./_components/HomeGuide";
import { HomeAuthState, SourceServices } from "./_components/SourceServices";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "HomePage" });
  return generateSEOMetadata({
    locale,
    pathname: "/",
    title: t("metaTitle"),
    description: t("description"),
  });
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "HomePage" });
  const tAccessibility = await getTranslations({ locale, namespace: "Accessibility" });

  return (
    <div className="grid h-[100dvh] grid-rows-[auto_1fr_auto] overflow-hidden">
      <header className="sticky top-0 z-50 h-auto">
        <Header />
      </header>

      <main className="overflow-auto">
        <div className="relative">
          <div className="mx-auto max-w-7xl px-4 py-12">
            <div className="mx-auto max-w-4xl text-center">
              <div className="mb-2">
                <h1
                  className="mb-4 bg-gradient-to-br from-indigo-500 to-purple-600 bg-clip-text text-5xl font-bold tracking-tight text-transparent lg:text-7xl dark:from-stone-50 dark:to-indigo-600"
                  style={{
                    contain: "content",
                  }}
                >
                  {t("title")}
                </h1>
                <p
                  className="mx-auto text-xl leading-relaxed text-zinc-800 lg:text-2xl dark:text-indigo-100"
                  style={{
                    contain: "content",
                    textRendering: "optimizeLegibility",
                  }}
                >
                  {t.rich("subtitle", {
                    strong: chunks => <strong>{chunks}</strong>,
                  })}
                </p>
              </div>

              <Suspense fallback={null}>
                <HomeAuthState />
              </Suspense>

              <div className="mb-22">
                <AudioEqualizer className="opacity-90" />
              </div>

              <SourceServices />
            </div>
          </div>

          {/* Features Section */}
          <div className="relative mx-auto max-w-7xl px-4 py-20">
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 lg:grid-cols-2">
              <div className="rounded-3xl border border-indigo-200/50 bg-indigo-100 p-10 shadow-lg transition-all duration-200 hover:shadow-xl dark:border-indigo-800/30 dark:bg-indigo-950/70">
                <div className="mb-8 flex h-16 w-16 transform items-center justify-center rounded-2xl bg-indigo-200 shadow-sm transition-transform duration-200 hover:scale-110 dark:bg-indigo-900/70">
                  <span
                    className="text-4xl drop-shadow-md filter"
                    role="img"
                    aria-label={tAccessibility("moneyWithWings")}
                  >
                    💸
                  </span>
                </div>
                <h3 className="mb-4 text-2xl font-semibold text-zinc-800 dark:text-stone-200">
                  {t("features.freeplan.title")}
                </h3>
                <p className="text-lg text-zinc-600 dark:text-stone-400">
                  {t.rich("features.freeplan.description", {
                    strong: chunks => <strong>{chunks}</strong>,
                    br: () => <br />,
                  })}
                </p>
              </div>
              <div className="rounded-3xl border border-indigo-200/50 bg-indigo-100 p-10 shadow-lg transition-all duration-200 hover:shadow-xl dark:border-indigo-800/30 dark:bg-indigo-950/70">
                <div className="mb-8 flex h-16 w-16 transform items-center justify-center rounded-2xl bg-indigo-200 shadow-sm transition-transform duration-200 hover:scale-110 dark:bg-indigo-900/70">
                  <span
                    className="text-4xl drop-shadow-md filter"
                    role="img"
                    aria-label={tAccessibility("shieldWithLock")}
                  >
                    🔐
                  </span>
                </div>
                <h3 className="mb-4 text-2xl font-semibold text-zinc-800 dark:text-stone-200">
                  {t("features.secure.title")}
                </h3>
                <p className="text-lg text-zinc-600 dark:text-stone-400">
                  {t.rich("features.secure.description", {
                    br: () => <br />,
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>

        <HomeGuide locale={locale} />
        <HomepageStructuredData locale={locale} description={t("description")} />
      </main>

      <Footer />
    </div>
  );
}
