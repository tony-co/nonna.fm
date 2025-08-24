/**
 * Locale-Specific Keywords for Music Transfer SEO
 * Comprehensive keyword targeting for all supported locales
 */

import type { Locale } from "./base";

export const LOCALE_KEYWORDS: Record<
  Locale,
  {
    // Primary Keywords
    primary: string[];
    // Service Transfer Keywords
    serviceTransfer: string[];
    // Action Keywords
    actions: string[];
    // Feature Keywords
    features: string[];
    // Long-tail Keywords
    longTail: string[];
  }
> = {
  en: {
    primary: [
      "music transfer",
      "playlist transfer",
      "streaming transfer",
      "music migration",
      "playlist migration",
    ],
    serviceTransfer: [
      "Spotify to Apple Music",
      "Apple Music to Spotify",
      "Spotify to YouTube Music",
      "YouTube Music to Spotify",
      "Deezer to Spotify",
      "Spotify to Deezer",
      "TIDAL to Spotify",
      "Amazon Music to Spotify",
    ],
    actions: [
      "transfer playlists",
      "move music library",
      "import playlists",
      "export music",
      "sync music",
      "convert playlists",
      "switch streaming service",
    ],
    features: [
      "free music transfer",
      "bulk playlist transfer",
      "liked songs transfer",
      "album transfer",
      "instant music transfer",
      "secure music migration",
      "cross-platform transfer",
    ],
    longTail: [
      "how to transfer Spotify playlists to Apple Music",
      "move music from Spotify to YouTube Music",
      "free playlist transfer tool",
      "migrate music library between streaming services",
      "best music transfer app",
      "transfer liked songs from Spotify",
    ],
  },

  es: {
    primary: [
      "transferir música",
      "transferir listas de reproducción",
      "migración musical",
      "cambio de plataforma musical",
      "mover música",
    ],
    serviceTransfer: [
      "Spotify a Apple Music",
      "Apple Music a Spotify",
      "Spotify a YouTube Music",
      "YouTube Music a Spotify",
      "Deezer a Spotify",
      "Spotify a Deezer",
      "TIDAL a Spotify",
      "Amazon Music a Spotify",
    ],
    actions: [
      "transferir listas de reproducción",
      "mover biblioteca musical",
      "importar listas",
      "exportar música",
      "sincronizar música",
      "convertir listas",
      "cambiar servicio streaming",
    ],
    features: [
      "transferir música gratis",
      "transferencia masiva listas",
      "transferir canciones favoritas",
      "transferir álbumes",
      "transferencia instantánea",
      "migración segura música",
      "transferencia multiplataforma",
    ],
    longTail: [
      "cómo transferir listas de Spotify a Apple Music",
      "mover música de Spotify a YouTube Music",
      "herramienta gratis transferir listas",
      "migrar biblioteca musical entre servicios",
      "mejor app transferir música",
      "transferir canciones favoritas Spotify",
    ],
  },

  fr: {
    primary: [
      "transfert musique",
      "transfert playlist",
      "migration musicale",
      "changement plateforme musicale",
      "déplacer musique",
    ],
    serviceTransfer: [
      "Spotify vers Apple Music",
      "Apple Music vers Spotify",
      "Spotify vers YouTube Music",
      "YouTube Music vers Spotify",
      "Deezer vers Spotify",
      "Spotify vers Deezer",
      "TIDAL vers Spotify",
      "Amazon Music vers Spotify",
    ],
    actions: [
      "transférer playlists",
      "déplacer bibliothèque musicale",
      "importer playlists",
      "exporter musique",
      "synchroniser musique",
      "convertir playlists",
      "changer service streaming",
    ],
    features: [
      "transfert musique gratuit",
      "transfert massif playlist",
      "transférer titres favoris",
      "transfert albums",
      "transfert instantané",
      "migration sécurisée musique",
      "transfert multiplateforme",
    ],
    longTail: [
      "comment transférer playlists Spotify vers Apple Music",
      "déplacer musique Spotify vers YouTube Music",
      "outil gratuit transfert playlist",
      "migrer bibliothèque musicale entre services",
      "meilleure app transfert musique",
      "transférer titres favoris Spotify",
    ],
  },

  de: {
    primary: [
      "musik übertragen",
      "playlist übertragen",
      "musik migration",
      "streaming wechsel",
      "musik verschieben",
    ],
    serviceTransfer: [
      "Spotify zu Apple Music",
      "Apple Music zu Spotify",
      "Spotify zu YouTube Music",
      "YouTube Music zu Spotify",
      "Deezer zu Spotify",
      "Spotify zu Deezer",
      "TIDAL zu Spotify",
      "Amazon Music zu Spotify",
    ],
    actions: [
      "playlists übertragen",
      "musikbibliothek verschieben",
      "playlists importieren",
      "musik exportieren",
      "musik synchronisieren",
      "playlists konvertieren",
      "streaming dienst wechseln",
    ],
    features: [
      "kostenlos musik übertragen",
      "massenübertragung playlist",
      "lieblingslieder übertragen",
      "alben übertragen",
      "sofortige übertragung",
      "sichere musik migration",
      "plattformübergreifend",
    ],
    longTail: [
      "wie Spotify playlists zu Apple Music übertragen",
      "musik von Spotify zu YouTube Music verschieben",
      "kostenloses playlist übertragungstool",
      "musikbibliothek zwischen diensten migrieren",
      "beste musik übertragungs app",
      "lieblingssongs von Spotify übertragen",
    ],
  },

  pt: {
    primary: [
      "transferir música",
      "transferir playlist",
      "migração musical",
      "mudança plataforma musical",
      "mover música",
    ],
    serviceTransfer: [
      "Spotify para Apple Music",
      "Apple Music para Spotify",
      "Spotify para YouTube Music",
      "YouTube Music para Spotify",
      "Deezer para Spotify",
      "Spotify para Deezer",
      "TIDAL para Spotify",
      "Amazon Music para Spotify",
    ],
    actions: [
      "transferir playlists",
      "mover biblioteca musical",
      "importar playlists",
      "exportar música",
      "sincronizar música",
      "converter playlists",
      "trocar serviço streaming",
    ],
    features: [
      "transferir música grátis",
      "transferência massiva playlist",
      "transferir músicas curtidas",
      "transferir álbuns",
      "transferência instantânea",
      "migração segura música",
      "transferência multiplataforma",
    ],
    longTail: [
      "como transferir playlists Spotify para Apple Music",
      "mover música Spotify para YouTube Music",
      "ferramenta grátis transferir playlist",
      "migrar biblioteca musical entre serviços",
      "melhor app transferir música",
      "transferir músicas curtidas Spotify",
    ],
  },

  it: {
    primary: [
      "trasferire musica",
      "trasferire playlist",
      "migrazione musicale",
      "cambio piattaforma musicale",
      "spostare musica",
    ],
    serviceTransfer: [
      "Spotify ad Apple Music",
      "Apple Music a Spotify",
      "Spotify a YouTube Music",
      "YouTube Music a Spotify",
      "Deezer a Spotify",
      "Spotify a Deezer",
      "TIDAL a Spotify",
      "Amazon Music a Spotify",
    ],
    actions: [
      "trasferire playlist",
      "spostare libreria musicale",
      "importare playlist",
      "esportare musica",
      "sincronizzare musica",
      "convertire playlist",
      "cambiare servizio streaming",
    ],
    features: [
      "trasferire musica gratis",
      "trasferimento massivo playlist",
      "trasferire brani preferiti",
      "trasferire album",
      "trasferimento istantaneo",
      "migrazione sicura musica",
      "trasferimento multipiattaforma",
    ],
    longTail: [
      "come trasferire playlist Spotify ad Apple Music",
      "spostare musica da Spotify a YouTube Music",
      "strumento gratis trasferire playlist",
      "migrare libreria musicale tra servizi",
      "migliore app trasferire musica",
      "trasferire brani preferiti Spotify",
    ],
  },

  ja: {
    primary: ["音楽転送", "プレイリスト転送", "音楽移行", "ストリーミング転送", "音楽移動"],
    serviceTransfer: [
      "SpotifyからApple Music",
      "Apple MusicからSpotify",
      "SpotifyからYouTube Music",
      "YouTube MusicからSpotify",
      "DeezerからSpotify",
      "SpotifyからDeezer",
      "TIDALからSpotify",
      "Amazon MusicからSpotify",
    ],
    actions: [
      "プレイリスト転送",
      "音楽ライブラリ移動",
      "プレイリストインポート",
      "音楽エクスポート",
      "音楽同期",
      "プレイリスト変換",
      "ストリーミングサービス変更",
    ],
    features: [
      "無料音楽転送",
      "一括プレイリスト転送",
      "お気に入り楽曲転送",
      "アルバム転送",
      "即座転送",
      "安全音楽移行",
      "クロスプラットフォーム転送",
    ],
    longTail: [
      "SpotifyプレイリストをApple Musicに転送する方法",
      "SpotifyからYouTube Musicに音楽移動",
      "無料プレイリスト転送ツール",
      "ストリーミングサービス間音楽ライブラリ移行",
      "最高音楽転送アプリ",
      "Spotifyお気に入り楽曲転送",
    ],
  },
} as const;

// Service-specific keyword generators
export const getServiceTransferKeywords = (
  source: string,
  target: string,
  locale: Locale
): string[] => {
  const serviceNames = {
    spotify: "Spotify",
    apple: "Apple Music",
    youtube: "YouTube Music",
    deezer: "Deezer",
    tidal: "TIDAL",
    amazon: "Amazon Music",
    pandora: "Pandora",
  };

  const sourceService = serviceNames[source as keyof typeof serviceNames] || source;
  const targetService = serviceNames[target as keyof typeof serviceNames] || target;

  const templates = {
    en: [
      `${sourceService} to ${targetService}`,
      `transfer from ${sourceService} to ${targetService}`,
      `migrate ${sourceService} to ${targetService}`,
    ],
    es: [
      `${sourceService} a ${targetService}`,
      `transferir de ${sourceService} a ${targetService}`,
      `migrar ${sourceService} a ${targetService}`,
    ],
    fr: [
      `${sourceService} vers ${targetService}`,
      `transférer de ${sourceService} vers ${targetService}`,
      `migrer ${sourceService} vers ${targetService}`,
    ],
    de: [
      `${sourceService} zu ${targetService}`,
      `übertragen von ${sourceService} zu ${targetService}`,
      `migrieren ${sourceService} zu ${targetService}`,
    ],
    pt: [
      `${sourceService} para ${targetService}`,
      `transferir de ${sourceService} para ${targetService}`,
      `migrar ${sourceService} para ${targetService}`,
    ],
    it: [
      `${sourceService} a ${targetService}`,
      `trasferire da ${sourceService} a ${targetService}`,
      `migrare ${sourceService} a ${targetService}`,
    ],
    ja: [
      `${sourceService}から${targetService}`,
      `${sourceService}から${targetService}へ転送`,
      `${sourceService}から${targetService}へ移行`,
    ],
  };

  return templates[locale] || templates.en;
};
