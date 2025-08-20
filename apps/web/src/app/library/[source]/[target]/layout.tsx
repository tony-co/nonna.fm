import { Header } from "@/components/layout/Header";
import { LibraryClientContent } from "./_components/LibraryClientContent";
import { MusicService } from "@/types";
import { Footer } from "@/components/layout/Footer";
import { TransferButton } from "@/components/shared/TransferButton";
import { LibraryProvider } from "@/contexts/LibraryContext";
import { TransferProvider } from "@/contexts/TransferContext";
import { ItemTitleProvider } from "@/contexts/ItemTitleContext";

interface LibraryLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    source: string;
    target: string;
  }>;
}

export default async function LibraryLayout({ children, params }: LibraryLayoutProps) {
  // Next.js 15 async params handling
  const { source, target } = await params;
  
  // Type assertion for MusicService
  const sourceService = source as MusicService;
  const targetService = target as MusicService;

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
        </ItemTitleProvider>
      </TransferProvider>
    </LibraryProvider>
  );
}
