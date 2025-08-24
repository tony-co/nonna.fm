/**
 * Dynamic Metadata Generator for Nonna.fm
 * Generates locale-aware metadata for all pages and routes
 */

import type { Metadata } from "next";
import type { Locale } from "../config/base";
import { SEO_CONFIG } from "../config/base";
import { LOCALE_KEYWORDS, getServiceTransferKeywords } from "../config/keywords";
import { generateHreflang } from "../utils/hreflang";
import { generateCanonicalUrl } from "../utils/canonical";

export interface MetadataOptions {
  locale: Locale;
  title?: string;
  description?: string;
  keywords?: string[];
  pathname: string;
  params?: {
    source?: string;
    target?: string;
    id?: string;
  };
  noIndex?: boolean;
  openGraph?: {
    title?: string;
    description?: string;
    image?: string;
    type?: "website" | "article";
  };
}

export function generateMetadata(options: MetadataOptions): Metadata {
  const {
    locale,
    title,
    description,
    keywords = [],
    pathname,
    params,
    noIndex = false,
    openGraph,
  } = options;

  // Generate base metadata
  const baseTitle = title || getDefaultTitle(locale, pathname, params);
  const finalTitle =
    baseTitle === SEO_CONFIG.brand.name
      ? baseTitle
      : `${baseTitle}${SEO_CONFIG.defaults.titleSeparator}${SEO_CONFIG.brand.name}`;

  const finalDescription = description || getDefaultDescription(locale, pathname, params);
  const finalKeywords = [...getDefaultKeywords(locale, pathname, params), ...keywords];

  // Generate URLs
  const canonicalUrl = generateCanonicalUrl(pathname, locale);
  const hreflangs = generateHreflang(pathname);

  // Generate OpenGraph image
  const ogImage = generateOGImage(locale, pathname, params, openGraph?.image);

  const metadata: Metadata = {
    title: finalTitle,
    description: finalDescription,
    keywords: finalKeywords.slice(0, SEO_CONFIG.defaults.keywordsMaxCount).join(", "),

    // Basic Meta Tags
    metadataBase: new URL(SEO_CONFIG.brand.url),
    alternates: {
      canonical: canonicalUrl,
      languages: hreflangs,
    },

    // Robots
    robots: {
      index: !noIndex,
      follow: true,
      googleBot: {
        index: !noIndex,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },

    // OpenGraph
    openGraph: {
      type: openGraph?.type || "website",
      title: openGraph?.title || finalTitle,
      description: openGraph?.description || finalDescription,
      url: canonicalUrl,
      siteName: SEO_CONFIG.brand.name,
      locale: locale,
      alternateLocale: SEO_CONFIG.supportedLocales.filter(l => l !== locale),
      images: [
        {
          url: ogImage,
          width: SEO_CONFIG.defaults.ogImageWidth,
          height: SEO_CONFIG.defaults.ogImageHeight,
          alt: openGraph?.title || finalTitle,
        },
      ],
    },

    // Twitter
    twitter: {
      card: "summary_large_image",
      site: SEO_CONFIG.social.twitter,
      creator: SEO_CONFIG.social.twitter,
      title: openGraph?.title || finalTitle,
      description: openGraph?.description || finalDescription,
      images: [ogImage],
    },

    // Additional Meta Tags
    other: {
      "apple-mobile-web-app-capable": "yes",
      "apple-mobile-web-app-status-bar-style": "default",
      "apple-mobile-web-app-title": SEO_CONFIG.brand.name,
      "application-name": SEO_CONFIG.brand.name,
      "mobile-web-app-capable": "yes",
      "theme-color": "#4F46E5",
      "format-detection": "telephone=no",
      "google-site-verification": process.env.GOOGLE_SITE_VERIFICATION || "",
    },
  };

  return metadata;
}

function getDefaultTitle(
  locale: Locale,
  pathname: string,
  params?: MetadataOptions["params"]
): string {
  const titles = {
    // Homepage
    "": {
      en: "Transfer Music Between Streaming Services",
      es: "Transferir Música Entre Servicios de Streaming",
      fr: "Transférer Musique Entre Services Streaming",
      de: "Musik Zwischen Streaming-Diensten Übertragen",
      pt: "Transferir Música Entre Serviços Streaming",
      it: "Trasferire Musica Tra Servizi Streaming",
      ja: "ストリーミングサービス間で音楽転送",
    },

    // Source Selection
    source: {
      en: "Select Source Music Service",
      es: "Seleccionar Servicio Musical Origen",
      fr: "Sélectionner Service Musical Source",
      de: "Quell-Musik-Service Auswählen",
      pt: "Selecionar Serviço Musical Origem",
      it: "Seleziona Servizio Musicale Sorgente",
      ja: "ソース音楽サービス選択",
    },

    // Library Transfer
    library: {
      en:
        params?.source && params?.target
          ? `Transfer from ${getServiceName(params.source)} to ${getServiceName(params.target)}`
          : "Transfer Music Library",
      es:
        params?.source && params?.target
          ? `Transferir de ${getServiceName(params.source)} a ${getServiceName(params.target)}`
          : "Transferir Biblioteca Musical",
      fr:
        params?.source && params?.target
          ? `Transférer de ${getServiceName(params.source)} vers ${getServiceName(params.target)}`
          : "Transférer Bibliothèque Musicale",
      de:
        params?.source && params?.target
          ? `Übertragen von ${getServiceName(params.source)} zu ${getServiceName(params.target)}`
          : "Musikbibliothek Übertragen",
      pt:
        params?.source && params?.target
          ? `Transferir de ${getServiceName(params.source)} para ${getServiceName(params.target)}`
          : "Transferir Biblioteca Musical",
      it:
        params?.source && params?.target
          ? `Trasferire da ${getServiceName(params.source)} a ${getServiceName(params.target)}`
          : "Trasferire Libreria Musicale",
      ja:
        params?.source && params?.target
          ? `${getServiceName(params.source)}から${getServiceName(params.target)}へ転送`
          : "音楽ライブラリ転送",
    },

    // Liked Songs
    liked: {
      en: "Transfer Liked Songs",
      es: "Transferir Canciones Favoritas",
      fr: "Transférer Titres Favoris",
      de: "Lieblingslieder Übertragen",
      pt: "Transferir Músicas Curtidas",
      it: "Trasferire Brani Preferiti",
      ja: "お気に入り楽曲転送",
    },

    // Albums
    albums: {
      en: "Transfer Albums",
      es: "Transferir Álbumes",
      fr: "Transférer Albums",
      de: "Alben Übertragen",
      pt: "Transferir Álbuns",
      it: "Trasferire Album",
      ja: "アルバム転送",
    },
  };

  const pathKey = pathname.split("/").filter(Boolean).pop() || "";
  const titleSet = titles[pathKey as keyof typeof titles] || titles[""];

  if (typeof titleSet === "object") {
    return titleSet[locale] || titleSet.en;
  }

  return titleSet || SEO_CONFIG.brand.name;
}

function getDefaultDescription(
  locale: Locale,
  pathname: string,
  params?: MetadataOptions["params"]
): string {
  const descriptions = {
    "": {
      en: "Transfer your music library between streaming services seamlessly. Move playlists, albums, and liked songs from Spotify to Apple Music, YouTube Music, Deezer, and more. Free and secure.",
      es: "Transfiere tu biblioteca musical entre servicios de streaming sin problemas. Mueve listas de reproducción, álbumes y canciones favoritas de Spotify a Apple Music, YouTube Music, Deezer y más. Gratis y seguro.",
      fr: "Transférez votre bibliothèque musicale entre les services de streaming en toute simplicité. Déplacez des playlists, albums et titres favoris de Spotify vers Apple Music, YouTube Music, Deezer et plus. Gratuit et sécurisé.",
      de: "Übertragen Sie Ihre Musikbibliothek nahtlos zwischen Streaming-Diensten. Verschieben Sie Playlists, Alben und Lieblingslieder von Spotify zu Apple Music, YouTube Music, Deezer und mehr. Kostenlos und sicher.",
      pt: "Transfira sua biblioteca musical entre serviços de streaming perfeitamente. Mova playlists, álbuns e músicas curtidas do Spotify para Apple Music, YouTube Music, Deezer e mais. Gratuito e seguro.",
      it: "Trasferisci la tua libreria musicale tra servizi streaming senza problemi. Sposta playlist, album e brani preferiti da Spotify ad Apple Music, YouTube Music, Deezer e altro. Gratuito e sicuro.",
      ja: "ストリーミングサービス間で音楽ライブラリをシームレスに転送。SpotifyからApple Music、YouTube Music、Deezerなどにプレイリスト、アルバム、お気に入り楽曲を移動。無料で安全。",
    },

    library: {
      en:
        params?.source && params?.target
          ? `Transfer your music library from ${getServiceName(params.source)} to ${getServiceName(params.target)}. Move playlists, albums, and liked songs quickly and securely.`
          : "Transfer your complete music library between streaming services. Support for playlists, albums, liked songs, and more.",
      es:
        params?.source && params?.target
          ? `Transfiere tu biblioteca musical de ${getServiceName(params.source)} a ${getServiceName(params.target)}. Mueve listas de reproducción, álbumes y canciones favoritas rápida y seguramente.`
          : "Transfiere tu biblioteca musical completa entre servicios de streaming. Soporte para listas de reproducción, álbumes, canciones favoritas y más.",
      fr:
        params?.source && params?.target
          ? `Transférez votre bibliothèque musicale de ${getServiceName(params.source)} vers ${getServiceName(params.target)}. Déplacez playlists, albums et titres favoris rapidement et en sécurité.`
          : "Transférez votre bibliothèque musicale complète entre services de streaming. Support pour playlists, albums, titres favoris et plus.",
      de:
        params?.source && params?.target
          ? `Übertragen Sie Ihre Musikbibliothek von ${getServiceName(params.source)} zu ${getServiceName(params.target)}. Verschieben Sie Playlists, Alben und Lieblingslieder schnell und sicher.`
          : "Übertragen Sie Ihre komplette Musikbibliothek zwischen Streaming-Diensten. Unterstützung für Playlists, Alben, Lieblingslieder und mehr.",
      pt:
        params?.source && params?.target
          ? `Transfira sua biblioteca musical do ${getServiceName(params.source)} para ${getServiceName(params.target)}. Mova playlists, álbuns e músicas curtidas rapidamente e com segurança.`
          : "Transfira sua biblioteca musical completa entre serviços de streaming. Suporte para playlists, álbuns, músicas curtidas e mais.",
      it:
        params?.source && params?.target
          ? `Trasferisci la tua libreria musicale da ${getServiceName(params.source)} a ${getServiceName(params.target)}. Sposta playlist, album e brani preferiti rapidamente e in sicurezza.`
          : "Trasferisci la tua libreria musicale completa tra servizi streaming. Supporto per playlist, album, brani preferiti e altro.",
      ja:
        params?.source && params?.target
          ? `${getServiceName(params.source)}から${getServiceName(params.target)}へ音楽ライブラリを転送。プレイリスト、アルバム、お気に入り楽曲を迅速かつ安全に移動。`
          : "ストリーミングサービス間で完全な音楽ライブラリを転送。プレイリスト、アルバム、お気に入り楽曲などをサポート。",
    },

    source: {
      en: "Choose your destination music streaming service. Connect and transfer your playlists, albums, and liked songs to your preferred platform.",
      es: "Elige tu servicio de streaming musical de destino. Conecta y transfiere tus listas de reproducción, álbumes y canciones favoritas a tu plataforma preferida.",
      fr: "Choisissez votre service de streaming musical de destination. Connectez et transférez vos playlists, albums et titres favoris vers votre plateforme préférée.",
      de: "Wählen Sie Ihren Ziel-Musik-Streaming-Service. Verbinden und übertragen Sie Ihre Playlists, Alben und Lieblingslieder zu Ihrer bevorzugten Plattform.",
      pt: "Escolha seu serviço de streaming musical de destino. Conecte e transfira suas playlists, álbuns e músicas curtidas para sua plataforma preferida.",
      it: "Scegli il tuo servizio streaming musicale di destinazione. Connetti e trasferisci le tue playlist, album e brani preferiti alla tua piattaforma preferita.",
      ja: "宛先音楽ストリーミングサービスを選択。プレイリスト、アルバム、お気に入り楽曲をお好みのプラットフォームに接続して転送。",
    },

    liked: {
      en:
        params?.source && params?.target
          ? `Transfer your liked songs from ${getServiceName(params.source)} to ${getServiceName(params.target)}. Keep your favorite music collection intact across platforms.`
          : "Transfer your liked songs and favorite tracks between music streaming services. Preserve your personal music taste across platforms.",
      es:
        params?.source && params?.target
          ? `Transfiere tus canciones favoritas de ${getServiceName(params.source)} a ${getServiceName(params.target)}. Mantén tu colección de música favorita intacta entre plataformas.`
          : "Transfiere tus canciones favoritas y pistas preferidas entre servicios de streaming musical. Preserva tu gusto musical personal entre plataformas.",
      fr:
        params?.source && params?.target
          ? `Transférez vos titres favoris de ${getServiceName(params.source)} vers ${getServiceName(params.target)}. Gardez votre collection musicale favorite intacte entre plateformes.`
          : "Transférez vos titres favoris et morceaux préférés entre services de streaming musical. Préservez votre goût musical personnel entre plateformes.",
      de:
        params?.source && params?.target
          ? `Übertragen Sie Ihre Lieblingslieder von ${getServiceName(params.source)} zu ${getServiceName(params.target)}. Halten Sie Ihre Lieblingsmusik-Sammlung plattformübergreifend intakt.`
          : "Übertragen Sie Ihre Lieblingslieder und bevorzugten Tracks zwischen Musik-Streaming-Diensten. Bewahren Sie Ihren persönlichen Musikgeschmack plattformübergreifend.",
      pt:
        params?.source && params?.target
          ? `Transfira suas músicas curtidas do ${getServiceName(params.source)} para ${getServiceName(params.target)}. Mantenha sua coleção de música favorita intacta entre plataformas.`
          : "Transfira suas músicas curtidas e faixas favoritas entre serviços de streaming musical. Preserve seu gosto musical pessoal entre plataformas.",
      it:
        params?.source && params?.target
          ? `Trasferisci i tuoi brani preferiti da ${getServiceName(params.source)} a ${getServiceName(params.target)}. Mantieni la tua collezione musicale preferita intatta tra piattaforme.`
          : "Trasferisci i tuoi brani preferiti e tracce favorite tra servizi streaming musicali. Preserva il tuo gusto musicale personale tra piattaforme.",
      ja:
        params?.source && params?.target
          ? `${getServiceName(params.source)}から${getServiceName(params.target)}へお気に入り楽曲を転送。プラットフォーム間でお気に入り音楽コレクションをそのまま維持。`
          : "音楽ストリーミングサービス間でお気に入り楽曲やお気に入りトラックを転送。プラットフォーム間で個人的な音楽の好みを保持。",
    },

    albums: {
      en:
        params?.source && params?.target
          ? `Transfer your album collection from ${getServiceName(params.source)} to ${getServiceName(params.target)}. Move your saved albums and maintain your music library organization.`
          : "Transfer your album collection between music streaming services. Keep your saved albums and music library organization intact.",
      es:
        params?.source && params?.target
          ? `Transfiere tu colección de álbumes de ${getServiceName(params.source)} a ${getServiceName(params.target)}. Mueve tus álbumes guardados y mantén la organización de tu biblioteca musical.`
          : "Transfiere tu colección de álbumes entre servicios de streaming musical. Mantén tus álbumes guardados y la organización de tu biblioteca musical intacta.",
      fr:
        params?.source && params?.target
          ? `Transférez votre collection d'albums de ${getServiceName(params.source)} vers ${getServiceName(params.target)}. Déplacez vos albums sauvegardés et maintenez l'organisation de votre bibliothèque musicale.`
          : "Transférez votre collection d'albums entre services de streaming musical. Gardez vos albums sauvegardés et l'organisation de votre bibliothèque musicale intacte.",
      de:
        params?.source && params?.target
          ? `Übertragen Sie Ihre Alben-Sammlung von ${getServiceName(params.source)} zu ${getServiceName(params.target)}. Verschieben Sie Ihre gespeicherten Alben und behalten Sie Ihre Musikbibliothek-Organisation bei.`
          : "Übertragen Sie Ihre Alben-Sammlung zwischen Musik-Streaming-Diensten. Behalten Sie Ihre gespeicherten Alben und die Organisation Ihrer Musikbibliothek bei.",
      pt:
        params?.source && params?.target
          ? `Transfira sua coleção de álbuns do ${getServiceName(params.source)} para ${getServiceName(params.target)}. Mova seus álbuns salvos e mantenha a organização da sua biblioteca musical.`
          : "Transfira sua coleção de álbuns entre serviços de streaming musical. Mantenha seus álbuns salvos e a organização da sua biblioteca musical intacta.",
      it:
        params?.source && params?.target
          ? `Trasferisci la tua collezione di album da ${getServiceName(params.source)} a ${getServiceName(params.target)}. Sposta i tuoi album salvati e mantieni l'organizzazione della tua libreria musicale.`
          : "Trasferisci la tua collezione di album tra servizi streaming musicali. Mantieni i tuoi album salvati e l'organizzazione della tua libreria musicale intatta.",
      ja:
        params?.source && params?.target
          ? `${getServiceName(params.source)}から${getServiceName(params.target)}へアルバムコレクションを転送。保存されたアルバムを移動し、音楽ライブラリの整理を維持。`
          : "音楽ストリーミングサービス間でアルバムコレクションを転送。保存されたアルバムと音楽ライブラリの整理をそのまま維持。",
    },
  };

  const pathKey = pathname.split("/").filter(Boolean).pop() || "";
  const descriptionSet = descriptions[pathKey as keyof typeof descriptions] || descriptions[""];

  if (typeof descriptionSet === "object") {
    return descriptionSet[locale] || descriptionSet.en;
  }

  return descriptionSet || SEO_CONFIG.brand.description;
}

function getDefaultKeywords(
  locale: Locale,
  pathname: string,
  params?: MetadataOptions["params"]
): string[] {
  const localeKeywords = LOCALE_KEYWORDS[locale];
  const baseKeywords = [...localeKeywords.primary, ...localeKeywords.features];

  // Add service-specific keywords if source/target are provided
  if (params?.source && params?.target) {
    const serviceKeywords = getServiceTransferKeywords(params.source, params.target, locale);
    baseKeywords.push(...serviceKeywords);
  }

  // Add page-specific keywords
  const pathKey = pathname.split("/").filter(Boolean).pop() || "";
  if (pathKey === "liked") {
    baseKeywords.push(
      ...localeKeywords.actions.filter(k => k.includes("liked") || k.includes("favorite"))
    );
  } else if (pathKey === "albums") {
    baseKeywords.push(...localeKeywords.actions.filter(k => k.includes("album")));
  }

  return baseKeywords;
}

function getServiceName(service: string): string {
  const serviceNames = {
    spotify: "Spotify",
    apple: "Apple Music",
    youtube: "YouTube Music",
    deezer: "Deezer",
    tidal: "TIDAL",
    amazon: "Amazon Music",
    pandora: "Pandora",
  };

  return serviceNames[service as keyof typeof serviceNames] || service;
}

function generateOGImage(
  locale: Locale,
  pathname: string,
  params?: MetadataOptions["params"],
  customImage?: string
): string {
  if (customImage) return customImage;

  // Generate dynamic OG images based on content
  const baseUrl = `${SEO_CONFIG.brand.url}/api/og`;
  const searchParams = new URLSearchParams({
    locale,
    path: pathname,
    ...(params?.source && { source: params.source }),
    ...(params?.target && { target: params.target }),
  });

  return `${baseUrl}?${searchParams.toString()}`;
}
