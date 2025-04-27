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
  // Properly await params in Next.js 15
  const { source, target } = await params;

  return (
    <LibraryProvider>
      <TransferProvider>
        {/* Provide item title context to all children */}
        <ItemTitleProvider>
          {/* Main container using CSS Grid for layout */}
          {/* Rows: Header (auto), Main Content (1fr), Footer (auto) */}
          <div className="grid h-screen grid-rows-[auto_1fr_auto]">
            {/* Header: Placed in the first grid row */}
            {/* NOTE: Removed fixed positioning, grid handles placement. Added z-index for potential overlaps. */}
            <header className="bg-background z-50">
              {/* Header content maintains its own height */}
              <Header />
            </header>

            {/* Main Content Area: Takes remaining space (1fr row). */}
            {/* Apply container styles here to constrain LibraryClientContent */}
            {/* NOTE: Added container mx-auto px-0 (or adjust px as needed) */}
            {/* NOTE: Added h-full to ensure the container fills the grid row height */}
            <div className="relative h-full overflow-hidden">
              {/* This inner div now acts as the container for the library content */}
              <div className="container mx-auto h-full px-0">
                {" "}
                {/* Adjust px-* if needed, e.g., px-4 sm:px-6 lg:px-8 */}
                {/* LibraryClientContent renders sidebar and main content within the container */}
                <LibraryClientContent source={source} _target={target}>
                  {children}
                </LibraryClientContent>
              </div>
            </div>

            {/* Footer: Placed in the last grid row */}
            {/* NOTE: Removed fixed positioning. Grid handles placement. */}
            <footer className="bg-background z-40">
              {/* Footer content maintains its own height */}
              <Footer>
                <div className="container mx-auto flex h-16 items-center justify-between">
                  <TransferButton />
                </div>
              </Footer>
            </footer>
          </div>
        </ItemTitleProvider>
      </TransferProvider>
    </LibraryProvider>
  );
}
