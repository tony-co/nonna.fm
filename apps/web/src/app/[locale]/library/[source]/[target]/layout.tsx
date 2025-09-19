import type { Metadata } from "next";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { TransferButton } from "@/components/shared/TransferButton";
import { ItemTitleProvider } from "@/contexts/ItemTitleContext";
import { LibraryProvider } from "@/contexts/LibraryContext";
import { TransferProvider } from "@/contexts/TransferContext";
import type { Locale } from "@/lib/seo";
import {
  generateMetadata as generateSEOMetadata,
  generateServiceTransferBreadcrumbs,
  ServiceTransferStructuredData,
} from "@/lib/seo";
import type { MusicService } from "@/types";
import { LibraryClientContent } from "./_components/LibraryClientContent";

interface LibraryLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    locale: string;
    source: string;
    target: string;
  }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; source: string; target: string }>;
}): Promise<Metadata> {
  const { locale, source, target } = await params;

  return generateSEOMetadata({
    locale: locale as Locale,
    pathname: `/library/${source}/${target}`,
    params: { source, target },
  });
}

export default async function LibraryLayout({ children, params }: LibraryLayoutProps) {
  // Next.js 15 async params handling
  const { locale, source, target } = await params;

  // Type assertion for MusicService
  const sourceService = source as MusicService;
  const targetService = target as MusicService;

  // Generate breadcrumbs for structured data
  const breadcrumbs = generateServiceTransferBreadcrumbs(locale as Locale, source, target);

  return (
    <LibraryProvider>
      <TransferProvider>
        <ItemTitleProvider>
          {/*
            Main page grid layout:
            - Row 1: Header (fixed height, fixed position)
            - Row 2: Content (takes remaining space, handles its own scrolling)
            - Row 3: Footer (fixed height, fixed position)
            Ensures header/footer are fixed and only content area scrolls.
          */}
          <div className="grid h-[100dvh] grid-rows-[auto_1fr_auto] overflow-hidden">
            {/* Header: Fixed at the top */}
            <header className="sticky top-0 z-50 h-auto">
              <Header />
            </header>

            {/* Content Area: Takes remaining height with a single scrollable container */}
            <div className="h-full min-w-0 overflow-hidden">
              <LibraryClientContent source={sourceService} _target={targetService}>
                {children}
              </LibraryClientContent>
            </div>

            {/* Footer: Fixed at the bottom */}
            <Footer>
              <TransferButton />
            </Footer>
          </div>

          {/* SEO Structured Data */}
          <ServiceTransferStructuredData
            locale={locale as Locale}
            source={source}
            target={target}
            breadcrumbs={breadcrumbs}
          />
        </ItemTitleProvider>
      </TransferProvider>
    </LibraryProvider>
  );
}
