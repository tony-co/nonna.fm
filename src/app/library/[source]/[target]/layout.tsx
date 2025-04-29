import { Header } from "@/components/layout/Header";
import { LibraryClientContent } from "./_components/LibraryClientContent";
import { MusicService } from "@/types/services";
import { Footer } from "@/components/layout/Footer";
import { TransferButton } from "@/components/shared/TransferButton";
import { LibraryProvider } from "@/contexts/LibraryContext";
import { TransferProvider } from "@/contexts/TransferContext";
import { ItemTitleProvider } from "@/contexts/ItemTitleContext";

interface LibraryLayoutProps {
  children: React.ReactNode;
  params: {
    source: MusicService;
    target: MusicService;
  };
}

export default async function LibraryLayout({ children, params }: LibraryLayoutProps) {
  // Next.js 15 async params handling
  const { source, target } = await params;

  return (
    <LibraryProvider>
      <TransferProvider>
        <ItemTitleProvider>
          {/*
            Main page grid layout:
            - Row 1: Header (auto height, sticky)
            - Row 2: Content (takes remaining space, overflow handled internally)
            - Row 3: Footer (auto height, sticky)
            Ensures header/footer are fixed and content area fills space.
          */}
          <div className="grid h-screen grid-rows-[auto_1fr_auto]">
            {/* Header: Sticky at the top */}
            <header className="sticky top-0 z-50 h-auto">
              <Header />
            </header>

            {/* Content Area: Takes remaining height, contains sidebar/main */}
            {/* overflow-hidden prevents content scroll from affecting sticky header/footer */}
            <div className="min-w-0 overflow-hidden">
              <LibraryClientContent source={source} _target={target}>
                {children}
              </LibraryClientContent>
            </div>

            {/* Footer */}
            <Footer>
              <TransferButton />
            </Footer>
          </div>
        </ItemTitleProvider>
      </TransferProvider>
    </LibraryProvider>
  );
}
