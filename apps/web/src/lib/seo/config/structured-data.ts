/**
 * Structured Data Schemas for Nonna.fm
 * JSON-LD schema configurations for enhanced search results
 */

import type { Locale } from "./base";
import { SEO_CONFIG } from "./base";
import type {
  Organization,
  SoftwareApplication,
  WebSite,
  Service,
  BreadcrumbList,
  FAQPage,
  WithContext,
} from "schema-dts";

// Organization Schema
export const getOrganizationSchema = (locale: Locale): WithContext<Organization> => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SEO_CONFIG.brand.url}#organization`,
  name: SEO_CONFIG.brand.name,
  alternateName: "Nonna FM",
  url: SEO_CONFIG.brand.url,
  logo: {
    "@type": "ImageObject",
    "@id": `${SEO_CONFIG.brand.url}#logo`,
    url: `${SEO_CONFIG.brand.url}${SEO_CONFIG.brand.logo}`,
    contentUrl: `${SEO_CONFIG.brand.url}${SEO_CONFIG.brand.logo}`,
    width: "512",
    height: "512",
    caption: SEO_CONFIG.brand.name,
  },
  image: {
    "@id": `${SEO_CONFIG.brand.url}#logo`,
  },
  description: getLocalizedDescription(locale),
  foundingDate: SEO_CONFIG.company.foundingDate,
  sameAs: [
    `https://twitter.com/${SEO_CONFIG.social.twitter.replace("@", "")}`,
    SEO_CONFIG.social.github,
  ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    url: SEO_CONFIG.social.support,
    availableLanguage: SEO_CONFIG.supportedLocales,
  },
});

// SoftwareApplication Schema
export const getSoftwareApplicationSchema = (locale: Locale): WithContext<SoftwareApplication> => ({
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "@id": `${SEO_CONFIG.brand.url}#softwareapplication`,
  name: SEO_CONFIG.brand.name,
  alternateName: "Nonna FM Music Transfer",
  description: getLocalizedDescription(locale),
  url: SEO_CONFIG.brand.url,
  image: `${SEO_CONFIG.brand.url}${SEO_CONFIG.brand.logo}`,
  screenshot: `${SEO_CONFIG.brand.url}/images/app-screenshot.png`,
  applicationCategory: SEO_CONFIG.company.applicationCategory,
  operatingSystem: SEO_CONFIG.company.operatingSystem,
  publisher: {
    "@id": `${SEO_CONFIG.brand.url}#organization`,
  },
  offers: [
    {
      "@type": "Offer",
      "@id": `${SEO_CONFIG.brand.url}#offer-free`,
      name: SEO_CONFIG.company.offers.freeTier.name,
      description: SEO_CONFIG.company.offers.freeTier.description,
      price: SEO_CONFIG.company.offers.freeTier.price,
      priceCurrency: SEO_CONFIG.company.offers.freeTier.priceCurrency,
      availability: "https://schema.org/InStock",
      validFrom: "2024-01-01",
    },
    {
      "@type": "Offer",
      "@id": `${SEO_CONFIG.brand.url}#offer-premium`,
      name: SEO_CONFIG.company.offers.premiumTier.name,
      description: SEO_CONFIG.company.offers.premiumTier.description,
      price: SEO_CONFIG.company.offers.premiumTier.price,
      priceCurrency: SEO_CONFIG.company.offers.premiumTier.priceCurrency,
      availability: "https://schema.org/InStock",
      validFrom: "2024-01-01",
    },
  ],
  featureList: getLocalizedFeatures(locale),
  softwareRequirements: "Web Browser, Internet Connection",
  softwareVersion: "1.0.0",
  datePublished: "2024-01-01",
  dateModified: new Date().toISOString().split("T")[0],
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: 4.8,
    reviewCount: 1250,
    bestRating: 5,
    worstRating: 1,
  },
});

// WebSite Schema with Search Action
export const getWebSiteSchema = (locale: Locale): WithContext<WebSite> => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SEO_CONFIG.brand.url}#website`,
  name: SEO_CONFIG.brand.name,
  alternateName: "Nonna FM",
  description: getLocalizedDescription(locale),
  url: SEO_CONFIG.brand.url,
  publisher: {
    "@id": `${SEO_CONFIG.brand.url}#organization`,
  },
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SEO_CONFIG.brand.url}/${locale}/search?q={search_term_string}`,
    },
  },
  inLanguage: SEO_CONFIG.supportedLocales,
  copyrightYear: 2024,
  copyrightHolder: {
    "@id": `${SEO_CONFIG.brand.url}#organization`,
  },
});

// Service Schema for Music Transfer
export const getServiceSchema = (
  source: string,
  target: string,
  locale: Locale
): WithContext<Service> => ({
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": `${SEO_CONFIG.brand.url}/${locale}/library/${source}/${target}#service`,
  name: getServiceTransferName(source, target, locale),
  description: getServiceTransferDescription(source, target, locale),
  provider: {
    "@id": `${SEO_CONFIG.brand.url}#organization`,
  },
  serviceType: "Music Transfer Service",
  areaServed: "Worldwide",
  availableChannel: {
    "@type": "ServiceChannel",
    serviceUrl: `${SEO_CONFIG.brand.url}/${locale}/library/${source}/${target}`,
    availableLanguage: SEO_CONFIG.supportedLocales,
  },
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    description: "Free music transfer service",
  },
});

// BreadcrumbList Schema Generator
export const getBreadcrumbSchema = (
  breadcrumbs: Array<{ name: string; url: string }>
): WithContext<BreadcrumbList> => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: breadcrumbs.map((breadcrumb, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: breadcrumb.name,
    item: breadcrumb.url,
  })),
});

// FAQ Schema for Common Questions
export const getFAQSchema = (locale: Locale): WithContext<FAQPage> => {
  const faqs = getFAQByLocale(locale);
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${SEO_CONFIG.brand.url}/${locale}#faq`,
    mainEntity: faqs.map(faq => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
};

// Helper Functions
function getLocalizedDescription(locale: Locale): string {
  const descriptions = {
    en: "Transfer your music library between streaming services seamlessly. Move playlists, albums, and liked songs from Spotify to Apple Music, YouTube Music, Deezer, and more.",
    es: "Transfiere tu biblioteca musical entre servicios de streaming sin problemas. Mueve listas de reproducción, álbumes y canciones favoritas de Spotify a Apple Music, YouTube Music, Deezer y más.",
    fr: "Transférez votre bibliothèque musicale entre les services de streaming en toute simplicité. Déplacez des playlists, albums et titres favoris de Spotify vers Apple Music, YouTube Music, Deezer et plus.",
    de: "Übertragen Sie Ihre Musikbibliothek nahtlos zwischen Streaming-Diensten. Verschieben Sie Playlists, Alben und Lieblingslieder von Spotify zu Apple Music, YouTube Music, Deezer und mehr.",
    pt: "Transfira sua biblioteca musical entre serviços de streaming perfeitamente. Mova playlists, álbuns e músicas curtidas do Spotify para Apple Music, YouTube Music, Deezer e mais.",
    it: "Trasferisci la tua libreria musicale tra servizi streaming senza problemi. Sposta playlist, album e brani preferiti da Spotify ad Apple Music, YouTube Music, Deezer e altro.",
    ja: "ストリーミングサービス間で音楽ライブラリをシームレスに転送。SpotifyからApple Music、YouTube Music、Deezerなどにプレイリスト、アルバム、お気に入り楽曲を移動。",
  };
  return descriptions[locale];
}

function getLocalizedFeatures(locale: Locale): string[] {
  const features = {
    en: [
      "Transfer playlists between music streaming services",
      "Move liked songs and albums",
      "Support for Spotify, Apple Music, YouTube Music, Deezer, TIDAL",
      "Free daily transfers with premium options",
      "Secure and private transfers",
      "Bulk transfer capabilities",
      "Cross-platform compatibility",
    ],
    es: [
      "Transferir listas entre servicios de streaming musical",
      "Mover canciones favoritas y álbumes",
      "Soporte para Spotify, Apple Music, YouTube Music, Deezer, TIDAL",
      "Transferencias diarias gratuitas con opciones premium",
      "Transferencias seguras y privadas",
      "Capacidades de transferencia masiva",
      "Compatibilidad multiplataforma",
    ],
    fr: [
      "Transférer playlists entre services streaming musicaux",
      "Déplacer titres favoris et albums",
      "Support pour Spotify, Apple Music, YouTube Music, Deezer, TIDAL",
      "Transferts quotidiens gratuits avec options premium",
      "Transferts sécurisés et privés",
      "Capacités de transfert en masse",
      "Compatibilité multiplateforme",
    ],
    de: [
      "Playlists zwischen Musik-Streaming-Diensten übertragen",
      "Lieblingslieder und Alben verschieben",
      "Unterstützung für Spotify, Apple Music, YouTube Music, Deezer, TIDAL",
      "Tägliche kostenlose Übertragungen mit Premium-Optionen",
      "Sichere und private Übertragungen",
      "Massenübertragungsfähigkeiten",
      "Plattformübergreifende Kompatibilität",
    ],
    pt: [
      "Transferir playlists entre serviços streaming musical",
      "Mover músicas curtidas e álbuns",
      "Suporte para Spotify, Apple Music, YouTube Music, Deezer, TIDAL",
      "Transferências diárias gratuitas com opções premium",
      "Transferências seguras e privadas",
      "Capacidades de transferência em massa",
      "Compatibilidade multiplataforma",
    ],
    it: [
      "Trasferire playlist tra servizi streaming musicali",
      "Spostare brani preferiti e album",
      "Supporto per Spotify, Apple Music, YouTube Music, Deezer, TIDAL",
      "Trasferimenti quotidiani gratuiti con opzioni premium",
      "Trasferimenti sicuri e privati",
      "Capacità di trasferimento di massa",
      "Compatibilità multipiattaforma",
    ],
    ja: [
      "音楽ストリーミングサービス間でプレイリスト転送",
      "お気に入り楽曲とアルバムを移動",
      "Spotify、Apple Music、YouTube Music、Deezer、TIDALをサポート",
      "プレミアムオプション付き無料日次転送",
      "安全でプライベートな転送",
      "一括転送機能",
      "クロスプラットフォーム対応",
    ],
  };
  return features[locale];
}

function getServiceTransferName(source: string, target: string, locale: Locale): string {
  const serviceNames = {
    spotify: "Spotify",
    apple: "Apple Music",
    youtube: "YouTube Music",
    deezer: "Deezer",
    tidal: "TIDAL",
  };

  const templates = {
    en: `Transfer from ${serviceNames[source as keyof typeof serviceNames]} to ${serviceNames[target as keyof typeof serviceNames]}`,
    es: `Transferir de ${serviceNames[source as keyof typeof serviceNames]} a ${serviceNames[target as keyof typeof serviceNames]}`,
    fr: `Transférer de ${serviceNames[source as keyof typeof serviceNames]} vers ${serviceNames[target as keyof typeof serviceNames]}`,
    de: `Übertragen von ${serviceNames[source as keyof typeof serviceNames]} zu ${serviceNames[target as keyof typeof serviceNames]}`,
    pt: `Transferir de ${serviceNames[source as keyof typeof serviceNames]} para ${serviceNames[target as keyof typeof serviceNames]}`,
    it: `Trasferire da ${serviceNames[source as keyof typeof serviceNames]} a ${serviceNames[target as keyof typeof serviceNames]}`,
    ja: `${serviceNames[source as keyof typeof serviceNames]}から${serviceNames[target as keyof typeof serviceNames]}へ転送`,
  };

  return templates[locale] || templates.en;
}

function getServiceTransferDescription(source: string, target: string, locale: Locale): string {
  const descriptions = {
    en: `Seamlessly transfer your music library, playlists, albums, and liked songs from ${source} to ${target}. Fast, secure, and free.`,
    es: `Transfiere sin problemas tu biblioteca musical, listas de reproducción, álbumes y canciones favoritas de ${source} a ${target}. Rápido, seguro y gratuito.`,
    fr: `Transférez facilement votre bibliothèque musicale, playlists, albums et titres favoris de ${source} vers ${target}. Rapide, sécurisé et gratuit.`,
    de: `Übertragen Sie nahtlos Ihre Musikbibliothek, Playlists, Alben und Lieblingslieder von ${source} zu ${target}. Schnell, sicher und kostenlos.`,
    pt: `Transfira perfeitamente sua biblioteca musical, playlists, álbuns e músicas curtidas do ${source} para ${target}. Rápido, seguro e gratuito.`,
    it: `Trasferisci senza problemi la tua libreria musicale, playlist, album e brani preferiti da ${source} a ${target}. Veloce, sicuro e gratuito.`,
    ja: `${source}から${target}へ音楽ライブラリ、プレイリスト、アルバム、お気に入り楽曲をシームレスに転送。高速、安全、無料。`,
  };

  return descriptions[locale] || descriptions.en;
}

function getFAQByLocale(locale: Locale): Array<{ question: string; answer: string }> {
  const faqs = {
    en: [
      {
        question: "How do I transfer my Spotify playlists to Apple Music?",
        answer:
          "Simply connect both your Spotify and Apple Music accounts, select the playlists you want to transfer, and click transfer. The process is automated and takes just a few minutes.",
      },
      {
        question: "Is the music transfer service free?",
        answer:
          "Yes! We offer 500 free transfers daily. For higher limits, you can upgrade to our premium plan with 5,000+ daily transfers.",
      },
      {
        question: "Which music streaming services are supported?",
        answer:
          "We support Spotify, Apple Music, YouTube Music, Deezer, TIDAL, Amazon Music, and Pandora with more services coming soon.",
      },
      {
        question: "Is my data secure during transfer?",
        answer:
          "Absolutely. We use industry-standard encryption and never store your music data permanently. Your privacy and security are our top priorities.",
      },
    ],
    es: [
      {
        question: "¿Cómo transfiero mis listas de Spotify a Apple Music?",
        answer:
          "Simplemente conecta tus cuentas de Spotify y Apple Music, selecciona las listas que quieres transferir, y haz clic en transferir. El proceso es automatizado y toma solo unos minutos.",
      },
      {
        question: "¿El servicio de transferencia musical es gratuito?",
        answer:
          "¡Sí! Ofrecemos 500 transferencias gratuitas diarias. Para límites más altos, puedes actualizar a nuestro plan premium con 5,000+ transferencias diarias.",
      },
      {
        question: "¿Qué servicios de streaming musical son compatibles?",
        answer:
          "Soportamos Spotify, Apple Music, YouTube Music, Deezer, TIDAL, Amazon Music y Pandora con más servicios próximamente.",
      },
      {
        question: "¿Mis datos están seguros durante la transferencia?",
        answer:
          "Absolutamente. Usamos encriptación estándar de la industria y nunca almacenamos tus datos musicales permanentemente. Tu privacidad y seguridad son nuestras prioridades principales.",
      },
    ],
    fr: [
      {
        question: "Comment transférer mes playlists Spotify vers Apple Music?",
        answer:
          "Connectez simplement vos comptes Spotify et Apple Music, sélectionnez les playlists que vous souhaitez transférer, et cliquez sur transférer. Le processus est automatisé et ne prend que quelques minutes.",
      },
      {
        question: "Le service de transfert musical est-il gratuit?",
        answer:
          "Oui! Nous offrons 500 transferts gratuits quotidiens. Pour des limites plus élevées, vous pouvez passer à notre plan premium avec 5,000+ transferts quotidiens.",
      },
      {
        question: "Quels services de streaming musical sont supportés?",
        answer:
          "Nous supportons Spotify, Apple Music, YouTube Music, Deezer, TIDAL, Amazon Music et Pandora avec d'autres services à venir bientôt.",
      },
      {
        question: "Mes données sont-elles sécurisées pendant le transfert?",
        answer:
          "Absolument. Nous utilisons un chiffrement standard de l'industrie et ne stockons jamais vos données musicales de façon permanente. Votre confidentialité et sécurité sont nos priorités principales.",
      },
    ],
    de: [
      {
        question: "Wie übertrage ich meine Spotify-Playlists zu Apple Music?",
        answer:
          "Verbinden Sie einfach sowohl Ihr Spotify- als auch Ihr Apple Music-Konto, wählen Sie die Playlists aus, die Sie übertragen möchten, und klicken Sie auf übertragen. Der Prozess ist automatisiert und dauert nur wenige Minuten.",
      },
      {
        question: "Ist der Musik-Übertragungsservice kostenlos?",
        answer:
          "Ja! Wir bieten 500 kostenlose Übertragungen täglich. Für höhere Limits können Sie zu unserem Premium-Plan mit 5,000+ täglichen Übertragungen upgraden.",
      },
      {
        question: "Welche Musik-Streaming-Services werden unterstützt?",
        answer:
          "Wir unterstützen Spotify, Apple Music, YouTube Music, Deezer, TIDAL, Amazon Music und Pandora mit weiteren Services in Kürze.",
      },
      {
        question: "Sind meine Daten während der Übertragung sicher?",
        answer:
          "Absolut. Wir verwenden branchenübliche Verschlüsselung und speichern niemals Ihre Musikdaten dauerhaft. Ihre Privatsphäre und Sicherheit sind unsere obersten Prioritäten.",
      },
    ],
    pt: [
      {
        question: "Como transfiro minhas playlists do Spotify para o Apple Music?",
        answer:
          "Simplesmente conecte suas contas do Spotify e Apple Music, selecione as playlists que deseja transferir, e clique em transferir. O processo é automatizado e leva apenas alguns minutos.",
      },
      {
        question: "O serviço de transferência musical é gratuito?",
        answer:
          "Sim! Oferecemos 500 transferências gratuitas diárias. Para limites maiores, você pode fazer upgrade para nosso plano premium com 5,000+ transferências diárias.",
      },
      {
        question: "Quais serviços de streaming musical são suportados?",
        answer:
          "Suportamos Spotify, Apple Music, YouTube Music, Deezer, TIDAL, Amazon Music e Pandora com mais serviços chegando em breve.",
      },
      {
        question: "Meus dados estão seguros durante a transferência?",
        answer:
          "Absolutamente. Usamos criptografia padrão da indústria e nunca armazenamos seus dados musicais permanentemente. Sua privacidade e segurança são nossas principais prioridades.",
      },
    ],
    it: [
      {
        question: "Come trasferisco le mie playlist da Spotify ad Apple Music?",
        answer:
          "Connetti semplicemente entrambi i tuoi account Spotify e Apple Music, seleziona le playlist che vuoi trasferire, e clicca su trasferisci. Il processo è automatizzato e richiede solo pochi minuti.",
      },
      {
        question: "Il servizio di trasferimento musicale è gratuito?",
        answer:
          "Sì! Offriamo 500 trasferimenti gratuiti giornalieri. Per limiti più alti, puoi fare l'upgrade al nostro piano premium con 5,000+ trasferimenti giornalieri.",
      },
      {
        question: "Quali servizi di streaming musicale sono supportati?",
        answer:
          "Supportiamo Spotify, Apple Music, YouTube Music, Deezer, TIDAL, Amazon Music e Pandora con altri servizi in arrivo presto.",
      },
      {
        question: "I miei dati sono sicuri durante il trasferimento?",
        answer:
          "Assolutamente. Utilizziamo crittografia standard dell'industria e non memorizziamo mai i tuoi dati musicali permanentemente. La tua privacy e sicurezza sono le nostre priorità principali.",
      },
    ],
    ja: [
      {
        question: "SpotifyからApple Musicにプレイリストを転送するには？",
        answer:
          "SpotifyとApple Musicの両方のアカウントを接続し、転送したいプレイリストを選択して、転送をクリックするだけです。プロセスは自動化されており、数分で完了します。",
      },
      {
        question: "音楽転送サービスは無料ですか？",
        answer:
          "はい！毎日500回の無料転送を提供しています。より高い制限については、5,000回以上の日次転送があるプレミアムプランにアップグレードできます。",
      },
      {
        question: "どの音楽ストリーミングサービスがサポートされていますか？",
        answer:
          "Spotify、Apple Music、YouTube Music、Deezer、TIDAL、Amazon Music、Pandoraをサポートしており、さらに多くのサービスが近日追加予定です。",
      },
      {
        question: "転送中にデータは安全ですか？",
        answer:
          "もちろんです。業界標準の暗号化を使用し、音楽データを永続的に保存することはありません。プライバシーとセキュリティが最優先事項です。",
      },
    ],
  };

  return faqs[locale] || faqs.en;
}
