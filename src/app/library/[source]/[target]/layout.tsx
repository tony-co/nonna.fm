import { Header } from "@/components/layout/Header";
import { LibraryClientContent } from "./_components/LibraryClientContent";
import { MusicService } from "@/types/services";
import { Footer } from "@/components/layout/Footer";

interface LibraryLayoutProps {
  children: React.ReactNode;
  params: {
    source: MusicService;
    target: MusicService;
  };
}

export default function LibraryLayout({
  children,
  params: { source, target },
}: LibraryLayoutProps) {
  return (
    <>
      <Header />
      <div className="flex min-h-screen flex-col">
        <main className="container mx-auto flex-grow pt-4">
          <div className="h-full">
            <LibraryClientContent source={source} _target={target}>
              {children}
            </LibraryClientContent>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}
