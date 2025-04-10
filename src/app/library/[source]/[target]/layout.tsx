import { Header } from "@/components/layout/Header";
import { LibraryClientContent } from "./_components/LibraryClientContent";
import { MusicService } from "@/types/services";
import { Footer } from "@/components/layout/Footer";
import { TransferButton } from "@/components/shared/TransferButton";
import { LibraryProvider } from "@/contexts/LibraryContext";
import { MatchingProvider } from "@/contexts/MatchingContext";

interface LibraryLayoutProps {
  children: React.ReactNode;
  params: {
    source: MusicService;
    target: MusicService;
  };
}

export default async function LibraryLayout({ children, params }: LibraryLayoutProps) {
  // Properly await params in Next.js 15
  const { source, target } = await params;

  return (
    <LibraryProvider>
      <MatchingProvider>
        <div className="flex h-screen flex-col">
          {/* Fixed Header */}
          <div className="fixed left-0 right-0 top-0 z-50">
            <Header />
          </div>

          {/* Main Content Area */}
          <div className="flex-1 pt-14 sm:pt-16">
            <main className="container mx-auto h-[calc(100vh-8rem)]">
              <LibraryClientContent source={source} _target={target}>
                {children}
              </LibraryClientContent>
            </main>
          </div>

          {/* Fixed Footer */}
          <div className="fixed bottom-0 left-0 right-0 z-40">
            <Footer>
              <TransferButton />
            </Footer>
          </div>
        </div>
      </MatchingProvider>
    </LibraryProvider>
  );
}
