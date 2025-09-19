/**
 * Breadcrumb Generation and Management
 * Creates breadcrumb navigation with schema markup support
 */

import type { Locale } from "../config/base";
import { SEO_CONFIG } from "../config/base";
import { generateLocalizedPath } from "../utils/hreflang";

export interface BreadcrumbItem {
  name: string;
  url: string;
  position?: number;
}

export interface BreadcrumbOptions {
  locale: Locale;
  pathname: string;
  params?: {
    source?: string;
    target?: string;
    id?: string;
  };
  customItems?: BreadcrumbItem[];
}

/**
 * Generate breadcrumb trail for any page
 */
export function generateBreadcrumbs(options: BreadcrumbOptions): BreadcrumbItem[] {
  const { locale, pathname, params, customItems } = options;
  const breadcrumbs: BreadcrumbItem[] = [];

  // Always start with home
  breadcrumbs.push({
    name: getLocalizedText("home", locale),
    url: `${SEO_CONFIG.brand.url}${generateLocalizedPath("/", locale)}`,
    position: 1,
  });

  // If custom items provided, use them
  if (customItems && customItems.length > 0) {
    customItems.forEach((item, index) => {
      breadcrumbs.push({
        ...item,
        position: index + 2, // Start after home
      });
    });
    return breadcrumbs;
  }

  // Parse pathname and generate breadcrumbs
  const pathSegments = pathname.split("/").filter(Boolean);

  // Remove locale from path segments if present
  const cleanSegments = pathSegments[0] === locale ? pathSegments.slice(1) : pathSegments;

  // Build breadcrumbs based on URL structure
  cleanSegments.forEach((segment, index) => {
    const currentPath = `/${cleanSegments.slice(0, index + 1).join("/")}`;
    const localizedPath = generateLocalizedPath(currentPath, locale);

    let name = "";
    const url = `${SEO_CONFIG.brand.url}${localizedPath}`;

    // Generate appropriate name based on segment
    switch (segment) {
      case "source":
        name = getLocalizedText("selectSource", locale);
        break;

      case "library":
        name = getLocalizedText("library", locale);
        break;

      case "liked":
        name = getLocalizedText("likedSongs", locale);
        break;

      case "albums":
        name = getLocalizedText("albums", locale);
        break;

      case "playlists":
        name = getLocalizedText("playlists", locale);
        break;

      default:
        // Handle dynamic segments (source/target services, IDs)
        if (params?.source && segment === params.source) {
          name = getServiceName(params.source);
        } else if (params?.target && segment === params.target) {
          name = getServiceName(params.target);
        } else if (segment === "playlist" && params?.id) {
          name = getLocalizedText("playlist", locale);
        } else {
          // Capitalize and clean segment
          name = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");
        }
    }

    if (name) {
      breadcrumbs.push({
        name,
        url,
        position: index + 2, // Start after home
      });
    }
  });

  return breadcrumbs;
}

/**
 * Generate breadcrumbs for service transfer pages
 */
export function generateServiceTransferBreadcrumbs(
  locale: Locale,
  source: string,
  target: string,
  pageType?: "liked" | "albums" | "playlists",
  playlistId?: string
): BreadcrumbItem[] {
  const breadcrumbs: BreadcrumbItem[] = [];

  // Home
  breadcrumbs.push({
    name: getLocalizedText("home", locale),
    url: `${SEO_CONFIG.brand.url}${generateLocalizedPath("/", locale)}`,
    position: 1,
  });

  // Library
  const libraryPath = generateLocalizedPath(`/library/${source}/${target}`, locale);
  breadcrumbs.push({
    name: getLocalizedText("library", locale),
    url: `${SEO_CONFIG.brand.url}${libraryPath}`,
    position: 2,
  });

  // Service transfer (Source → Target)
  const transferName = getLocalizedText("transferFromTo", locale, {
    source: getServiceName(source),
    target: getServiceName(target),
  });
  breadcrumbs.push({
    name: transferName,
    url: `${SEO_CONFIG.brand.url}${libraryPath}`,
    position: 3,
  });

  // Page type (liked, albums, etc.)
  if (pageType) {
    const pageTypePath = generateLocalizedPath(`/library/${source}/${target}/${pageType}`, locale);
    let pageTypeName = "";

    switch (pageType) {
      case "liked":
        pageTypeName = getLocalizedText("likedSongs", locale);
        break;
      case "albums":
        pageTypeName = getLocalizedText("albums", locale);
        break;
      case "playlists":
        pageTypeName = getLocalizedText("playlists", locale);
        break;
    }

    if (pageTypeName) {
      breadcrumbs.push({
        name: pageTypeName,
        url: `${SEO_CONFIG.brand.url}${pageTypePath}`,
        position: 4,
      });
    }
  }

  // Individual playlist
  if (playlistId && pageType === "playlists") {
    const playlistPath = generateLocalizedPath(
      `/library/${source}/${target}/playlist/${playlistId}`,
      locale
    );
    breadcrumbs.push({
      name: getLocalizedText("playlist", locale),
      url: `${SEO_CONFIG.brand.url}${playlistPath}`,
      position: breadcrumbs.length + 1,
    });
  }

  return breadcrumbs;
}

/**
 * Get localized text for breadcrumb items
 */
function getLocalizedText(key: string, locale: Locale, params?: Record<string, string>): string {
  const texts: Record<string, Record<Locale, string>> = {
    home: {
      en: "Home",
      es: "Inicio",
      fr: "Accueil",
      de: "Startseite",
      pt: "Início",
      it: "Home",
      ja: "ホーム",
    },
    selectSource: {
      en: "Select Source",
      es: "Seleccionar Origen",
      fr: "Sélectionner Source",
      de: "Quelle Auswählen",
      pt: "Selecionar Origem",
      it: "Seleziona Sorgente",
      ja: "ソース選択",
    },
    library: {
      en: "Library",
      es: "Biblioteca",
      fr: "Bibliothèque",
      de: "Bibliothek",
      pt: "Biblioteca",
      it: "Libreria",
      ja: "ライブラリ",
    },
    likedSongs: {
      en: "Liked Songs",
      es: "Canciones Favoritas",
      fr: "Titres Favoris",
      de: "Lieblingslieder",
      pt: "Músicas Curtidas",
      it: "Brani Preferiti",
      ja: "お気に入り楽曲",
    },
    albums: {
      en: "Albums",
      es: "Álbumes",
      fr: "Albums",
      de: "Alben",
      pt: "Álbuns",
      it: "Album",
      ja: "アルバム",
    },
    playlists: {
      en: "Playlists",
      es: "Listas de Reproducción",
      fr: "Playlists",
      de: "Playlists",
      pt: "Playlists",
      it: "Playlist",
      ja: "プレイリスト",
    },
    playlist: {
      en: "Playlist",
      es: "Lista de Reproducción",
      fr: "Playlist",
      de: "Playlist",
      pt: "Playlist",
      it: "Playlist",
      ja: "プレイリスト",
    },
    transferFromTo: {
      en: "Transfer from {source} to {target}",
      es: "Transferir de {source} a {target}",
      fr: "Transférer de {source} vers {target}",
      de: "Übertragen von {source} zu {target}",
      pt: "Transferir de {source} para {target}",
      it: "Trasferire da {source} a {target}",
      ja: "{source}から{target}へ転送",
    },
  };

  let text = texts[key]?.[locale] || texts[key]?.en || key;

  // Replace parameters if provided
  if (params) {
    Object.entries(params).forEach(([param, value]) => {
      text = text.replace(`{${param}}`, value);
    });
  }

  return text;
}

/**
 * Get service display name
 */
function getServiceName(service: string): string {
  const serviceNames: Record<string, string> = {
    spotify: "Spotify",
    apple: "Apple Music",
    youtube: "YouTube Music",
    deezer: "Deezer",
    tidal: "TIDAL",
    amazon: "Amazon Music",
    pandora: "Pandora",
  };

  return serviceNames[service] || service.charAt(0).toUpperCase() + service.slice(1);
}

/**
 * Format breadcrumbs for display in UI
 */
export function formatBreadcrumbsForDisplay(breadcrumbs: BreadcrumbItem[]): BreadcrumbItem[] {
  return breadcrumbs.map((item, index) => ({
    ...item,
    position: index + 1,
  }));
}

/**
 * Generate breadcrumb JSON-LD for a specific page
 */
export function generateBreadcrumbJsonLd(breadcrumbs: BreadcrumbItem[]): {
  "@context": string;
  "@type": string;
  itemListElement: Array<{ "@type": string; position: number; name: string; item: string }>;
} {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((breadcrumb, index) => ({
      "@type": "ListItem",
      position: breadcrumb.position || index + 1,
      name: breadcrumb.name,
      item: breadcrumb.url,
    })),
  };
}
