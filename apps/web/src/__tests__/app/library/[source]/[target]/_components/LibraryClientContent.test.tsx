import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { LibraryClientContent } from "@/app/[locale]/library/[source]/[target]/_components/LibraryClientContent";
import { LibraryProvider } from "@/contexts/LibraryContext";

const { fetchLibrary, setShowTitle } = vi.hoisted(() => ({
  fetchLibrary: vi.fn(),
  setShowTitle: vi.fn(),
}));
vi.mock("next/navigation", () => ({ usePathname: () => "/library/spotify/apple/liked" }));
vi.mock("@/contexts/ItemTitleContext", () => ({ useItemTitle: () => ({ setShowTitle }) }));
vi.mock("@/lib/services/factory", () => ({
  musicServiceFactory: { getProvider: () => ({ fetchUserLibrary: fetchLibrary }) },
}));
vi.mock("@/lib/musicApi", () => ({ fetchPlaylistTracks: vi.fn() }));
vi.mock("@/lib/services/apple/api", () => ({ authorizeAppleMusic: vi.fn() }));
vi.mock("@/components/layout/Sidebar", () => ({
  LibrarySidebar: () => <div>Library sidebar</div>,
}));
vi.mock("@/components/shared/LoadingOverlay", () => ({
  LoadingOverlay: () => <div>Loading library</div>,
}));

function renderLibrary() {
  return render(
    <LibraryProvider>
      <LibraryClientContent source="spotify" _target="apple">
        <h1>Library content</h1>
      </LibraryClientContent>
    </LibraryProvider>
  );
}

beforeEach(() => {
  fetchLibrary.mockReset();
});
describe("library initialization", () => {
  it("renders a successfully loaded empty library without refetching", async () => {
    fetchLibrary.mockResolvedValue({ likedSongs: [], albums: [], playlists: [] });
    renderLibrary();
    expect(await screen.findByText("Library content")).toBeInTheDocument();
    await waitFor(() => expect(screen.queryByText("Loading library")).not.toBeInTheDocument());
    expect(fetchLibrary).toHaveBeenCalledTimes(1);
  });
  it("renders errors without retrying indefinitely", async () => {
    fetchLibrary.mockRejectedValue(new Error("Provider unavailable"));
    renderLibrary();
    expect(await screen.findByText("Error: Provider unavailable")).toBeInTheDocument();
    expect(fetchLibrary).toHaveBeenCalledTimes(1);
  });
});
