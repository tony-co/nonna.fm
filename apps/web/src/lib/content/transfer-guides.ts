import { FREE_TIER_LIMIT } from "@/lib/constants";

export const guideLocales = ["en", "fr"] as const;
export const guideSlugs = ["spotify-to-apple-music", "apple-music-to-spotify"] as const;
export type GuideLocale = (typeof guideLocales)[number];
export type GuideSlug = (typeof guideSlugs)[number];

export function isGuideLocale(locale: string): locale is GuideLocale {
  return guideLocales.some(value => value === locale);
}

export function isGuideSlug(slug: string): slug is GuideSlug {
  return guideSlugs.some(value => value === slug);
}

type TransferGuide = {
  source: "spotify" | "apple";
  sourceName: string;
  targetName: string;
  title: string;
  description: string;
  intro: string;
  requirements: string[];
  steps: { title: string; text: string }[];
  items: { name: string; detail: string }[];
  questions: { question: string; answer: string }[];
};

export const transferGuides: Record<GuideLocale, Record<GuideSlug, TransferGuide>> = {
  en: {
    "spotify-to-apple-music": {
      source: "spotify",
      sourceName: "Spotify",
      targetName: "Apple Music",
      title: "Transfer Spotify playlists to Apple Music for free",
      description:
        "Move Spotify playlists, liked songs and albums to Apple Music. Review matches before copying, keep your originals, and use Nonna.fm's free daily allowance.",
      intro:
        "Bring your Spotify collection to Apple Music with Nonna.fm, an open-source web app. Connect both accounts, choose your music, and review the matches before you copy anything.",
      requirements: [
        "Access to the Spotify account that holds your music.",
        "An Apple Music subscription and access to the destination account.",
        "A browser with JavaScript enabled. Keep the transfer page open until it finishes.",
      ],
      steps: [
        {
          title: "Connect Spotify, then Apple Music",
          text: "Start with the Spotify button on this page. Read the permission information and sign in through Spotify. On the destination screen, choose Apple Music and authorize access to your library.",
        },
        {
          title: "Choose playlists, liked songs or albums",
          text: "Open the relevant section of your Spotify library in Nonna. Select the items you want to copy. Open a playlist to load its tracks and review the selection before transferring.",
        },
        {
          title: "Check the Apple Music matches",
          text: "Review the proposed songs and albums. Look out for live recordings, remasters and explicit or clean editions. Change a match or skip an item if the suggested version is not the one you want.",
        },
        {
          title: "Start the transfer and check your library",
          text: "Select Start transfer. Leave this page open while Nonna adds the matched items to Apple Music. Review the result and check your Apple Music library before retrying any failed items.",
        },
      ],
      items: [
        {
          name: "Playlists",
          detail:
            "Selected matched tracks are copied into a new Apple Music playlist using the source playlist's name.",
        },
        {
          name: "Liked songs",
          detail:
            "Matched Spotify liked songs are added to your Apple Music library. Nonna does not mark them as Apple Music Favorites.",
        },
        {
          name: "Saved albums",
          detail:
            "Matched albums are added to your Apple Music library. Availability and editions depend on the destination catalog.",
        },
      ],
      questions: [
        {
          question: "Will my Spotify playlists be deleted?",
          answer:
            "No. Nonna copies matched music to Apple Music without deleting the original playlists, liked songs or albums in Spotify.",
        },
        {
          question: "Can I transfer Spotify liked songs to Apple Music?",
          answer:
            "Yes. Select Liked Songs in Nonna, review the matches and start the transfer. The songs are added to your Apple Music library; they are not automatically added to its Favorite Songs playlist.",
        },
        {
          question: "Does this transfer my downloaded audio files?",
          answer:
            "No. Nonna matches music against the Apple Music catalog and adds the matched items to your library. It does not upload audio files or move offline downloads. You can download available music again in Apple Music.",
        },
        {
          question: "Why are some songs missing or different?",
          answer:
            "Catalogs vary by country and service. Local files, unavailable releases and different editions may have no suitable match. Review the proposed version and skip items that do not match. A transfer cannot guarantee that every song is available.",
        },
        {
          question: "Does Apple Music also offer a transfer tool?",
          answer:
            "Yes. Apple Music offers its own import option through a third-party service, with availability and supported content varying. Nonna is another option with public source code and a workflow for reviewing matches before copying. You can also use Nonna to transfer in the other direction.",
        },
      ],
    },
    "apple-music-to-spotify": {
      source: "apple",
      sourceName: "Apple Music",
      targetName: "Spotify",
      title: "Transfer Apple Music playlists to Spotify for free",
      description:
        "Move Apple Music playlists, library songs and albums to Spotify. Check matches before transferring with Nonna.fm, a free, open-source web app.",
      intro:
        "Take your Apple Music collection to Spotify with Nonna.fm. Copy playlists, library songs and saved albums from your browser, with a chance to review the Spotify matches before you transfer.",
      requirements: [
        "Access to your Apple Music account and an active Apple Music subscription.",
        "Access to the Spotify account where you want to save your music.",
        "A browser with JavaScript enabled. Keep the transfer page open until it finishes.",
      ],
      steps: [
        {
          title: "Connect Apple Music, then Spotify",
          text: "Start with the Apple Music button on this page and authorize access through Apple. Choose Spotify as your destination and approve the permissions to create playlists and save music.",
        },
        {
          title: "Select the music to bring with you",
          text: "Browse your Apple Music playlists, songs and albums in Nonna. Select a playlist and open it to load its tracks, or choose individual items from the songs and albums sections.",
        },
        {
          title: "Review the Spotify versions",
          text: "Check the matched title, artist and release. A remaster or live recording may differ from the version in your Apple Music library. Adjust the match or skip the item before copying.",
        },
        {
          title: "Copy the selection to Spotify",
          text: "Choose Start transfer and keep the browser page open. After the transfer finishes, review the result and open Spotify to check the new playlists and saved music.",
        },
      ],
      items: [
        {
          name: "Playlists",
          detail:
            "Selected matched tracks are added to a new Spotify playlist using the source playlist's name.",
        },
        {
          name: "Library songs",
          detail:
            "Matched songs from your Apple Music library are saved to Spotify's Liked Songs. The songs section is not limited to Apple Music Favorites.",
        },
        {
          name: "Saved albums",
          detail:
            "Matched albums are saved to your Spotify library. The edition available on Spotify may differ from the original.",
        },
      ],
      questions: [
        {
          question: "Will my Apple Music library stay intact?",
          answer:
            "Yes. Nonna adds matched music to Spotify without deleting the original Apple Music collection. Your continued access to Apple Music remains subject to Apple's subscription terms.",
        },
        {
          question: "Where do my Apple Music songs appear in Spotify?",
          answer:
            "Songs copied from the library songs section appear in Spotify's Liked Songs. Tracks copied as a playlist appear in a newly created Spotify playlist.",
        },
        {
          question: "Can I move uploaded songs or purchased audio files?",
          answer:
            "Nonna can transfer an item only when it finds a suitable match in Spotify's catalog. It does not upload your audio files. An uploaded or purchased recording may be unavailable on Spotify.",
        },
        {
          question: "Will the two libraries stay in sync?",
          answer:
            "No. Each transfer copies the selection you make at that time. Future playlist changes are not automatically synchronized. Review the destination before running the same transfer again, as another run can create another playlist.",
        },
        {
          question: "Can I transfer back to Apple Music later?",
          answer:
            "Yes. Start a new transfer with Spotify as the source and Apple Music as the destination. Review the new matches, since catalogs and availability can change.",
        },
      ],
    },
  },
  fr: {
    "spotify-to-apple-music": {
      source: "spotify",
      sourceName: "Spotify",
      targetName: "Apple Music",
      title: "Transférer ses playlists Spotify vers Apple Music gratuitement",
      description:
        "Transférez playlists, titres favoris et albums de Spotify vers Apple Music. Vérifiez les correspondances et conservez vos originaux avec Nonna.fm, gratuit et open source.",
      intro:
        "Retrouvez votre collection Spotify dans Apple Music avec Nonna.fm, une application web open source. Connectez vos deux comptes, choisissez votre musique et vérifiez les correspondances avant de lancer la copie.",
      requirements: [
        "L’accès au compte Spotify qui contient votre musique.",
        "Un abonnement Apple Music et l’accès au compte de destination.",
        "Un navigateur avec JavaScript activé. Gardez la page ouverte jusqu’à la fin du transfert.",
      ],
      steps: [
        {
          title: "Connectez Spotify, puis Apple Music",
          text: "Commencez avec le bouton Spotify de cette page. Consultez les autorisations et connectez-vous sur Spotify. Sur l’écran de destination, choisissez Apple Music et autorisez l’accès à votre bibliothèque.",
        },
        {
          title: "Choisissez vos playlists, favoris ou albums",
          text: "Ouvrez la section correspondante de votre bibliothèque Spotify dans Nonna. Sélectionnez les éléments à copier. Ouvrez une playlist pour charger ses titres et vérifier votre sélection avant le transfert.",
        },
        {
          title: "Vérifiez les correspondances Apple Music",
          text: "Examinez les titres et albums proposés. Faites attention aux versions live, remasterisées, explicites ou censurées. Modifiez une correspondance ou ignorez un élément si la version proposée ne vous convient pas.",
        },
        {
          title: "Lancez le transfert et vérifiez votre bibliothèque",
          text: "Choisissez Lancer le transfert. Gardez la page ouverte pendant que Nonna ajoute la sélection à Apple Music. Consultez le résultat et votre bibliothèque Apple Music avant de réessayer les éléments en échec.",
        },
      ],
      items: [
        {
          name: "Playlists",
          detail:
            "Les titres sélectionnés et trouvés sont copiés dans une nouvelle playlist Apple Music portant le nom de la playlist d’origine.",
        },
        {
          name: "Titres favoris",
          detail:
            "Les favoris Spotify trouvés sont ajoutés à votre bibliothèque Apple Music. Nonna ne les marque pas comme favoris dans Apple Music.",
        },
        {
          name: "Albums enregistrés",
          detail:
            "Les albums trouvés sont ajoutés à votre bibliothèque Apple Music. Les éditions disponibles dépendent du catalogue de destination.",
        },
      ],
      questions: [
        {
          question: "Mes playlists Spotify seront-elles supprimées ?",
          answer:
            "Non. Nonna copie la musique trouvée vers Apple Music sans supprimer vos playlists, titres favoris ou albums d’origine dans Spotify.",
        },
        {
          question: "Puis-je transférer mes titres favoris Spotify ?",
          answer:
            "Oui. Ouvrez Titres favoris dans Nonna, vérifiez les correspondances et lancez le transfert. Les morceaux sont ajoutés à votre bibliothèque Apple Music, mais pas automatiquement à sa playlist de favoris.",
        },
        {
          question: "Mes fichiers audio téléchargés sont-ils transférés ?",
          answer:
            "Non. Nonna recherche des correspondances dans le catalogue Apple Music et les ajoute à votre bibliothèque. L’application n’envoie pas de fichiers audio et ne déplace pas les téléchargements hors ligne. Vous pouvez télécharger à nouveau les titres disponibles dans Apple Music.",
        },
        {
          question: "Pourquoi certains titres manquent-ils ou sont-ils différents ?",
          answer:
            "Les catalogues varient selon le pays et le service. Un fichier local, une sortie indisponible ou une édition différente peut ne pas avoir de correspondance. Vérifiez la version proposée et ignorez les résultats inadaptés. La disponibilité de chaque titre n’est pas garantie.",
        },
        {
          question: "Apple Music propose-t-il aussi un outil de transfert ?",
          answer:
            "Oui. Apple Music propose une fonction d’import via un service tiers, dont la disponibilité et le contenu pris en charge varient. Nonna offre une autre possibilité, avec un code source public et la vérification des correspondances avant la copie. Nonna permet aussi le transfert dans l’autre sens.",
        },
      ],
    },
    "apple-music-to-spotify": {
      source: "apple",
      sourceName: "Apple Music",
      targetName: "Spotify",
      title: "Transférer ses playlists Apple Music vers Spotify gratuitement",
      description:
        "Transférez playlists, morceaux et albums Apple Music vers Spotify. Vérifiez les correspondances avant la copie avec Nonna.fm, une application gratuite et open source.",
      intro:
        "Emportez votre collection Apple Music sur Spotify avec Nonna.fm. Copiez vos playlists, morceaux et albums depuis votre navigateur, en vérifiant les correspondances Spotify avant de lancer le transfert.",
      requirements: [
        "L’accès à votre compte Apple Music et un abonnement Apple Music actif.",
        "L’accès au compte Spotify dans lequel vous souhaitez enregistrer votre musique.",
        "Un navigateur avec JavaScript activé. Gardez la page ouverte jusqu’à la fin du transfert.",
      ],
      steps: [
        {
          title: "Connectez Apple Music, puis Spotify",
          text: "Commencez avec le bouton Apple Music de cette page et autorisez l’accès via Apple. Choisissez Spotify comme destination, puis autorisez la création de playlists et l’enregistrement de musique.",
        },
        {
          title: "Sélectionnez la musique à emporter",
          text: "Parcourez vos playlists, morceaux et albums Apple Music dans Nonna. Ouvrez une playlist pour charger ses titres ou choisissez des éléments dans les sections des morceaux et des albums.",
        },
        {
          title: "Vérifiez les versions sur Spotify",
          text: "Contrôlez le titre, l’artiste et l’édition proposés. Une version live ou remasterisée peut différer de celle de votre bibliothèque Apple Music. Modifiez la correspondance ou ignorez l’élément avant la copie.",
        },
        {
          title: "Copiez votre sélection vers Spotify",
          text: "Choisissez Lancer le transfert et gardez la page ouverte. Une fois le transfert terminé, consultez le résultat et vérifiez vos nouvelles playlists et votre musique enregistrée dans Spotify.",
        },
      ],
      items: [
        {
          name: "Playlists",
          detail:
            "Les titres sélectionnés et trouvés sont ajoutés à une nouvelle playlist Spotify portant le nom de la playlist d’origine.",
        },
        {
          name: "Morceaux de la bibliothèque",
          detail:
            "Les morceaux Apple Music trouvés sont enregistrés dans les Titres likés de Spotify. La section des morceaux ne se limite pas aux favoris Apple Music.",
        },
        {
          name: "Albums enregistrés",
          detail:
            "Les albums trouvés sont enregistrés dans votre bibliothèque Spotify. L’édition disponible peut différer de celle d’origine.",
        },
      ],
      questions: [
        {
          question: "Ma bibliothèque Apple Music restera-t-elle intacte ?",
          answer:
            "Oui. Nonna ajoute les correspondances à Spotify sans supprimer votre collection Apple Music. Votre accès à Apple Music reste soumis aux conditions d’abonnement d’Apple.",
        },
        {
          question: "Où retrouver mes morceaux Apple Music dans Spotify ?",
          answer:
            "Les morceaux copiés depuis la section des morceaux de la bibliothèque apparaissent dans les Titres likés de Spotify. Les titres copiés en tant que playlist se retrouvent dans une nouvelle playlist Spotify.",
        },
        {
          question: "Puis-je déplacer mes fichiers importés ou achetés ?",
          answer:
            "Nonna peut copier un élément uniquement si une correspondance adaptée existe dans le catalogue Spotify. L’application n’envoie pas vos fichiers audio. Un enregistrement importé ou acheté peut être indisponible sur Spotify.",
        },
        {
          question: "Les deux bibliothèques restent-elles synchronisées ?",
          answer:
            "Non. Chaque transfert copie votre sélection à cet instant. Les modifications futures ne sont pas synchronisées automatiquement. Vérifiez la destination avant de répéter un transfert : une nouvelle exécution peut créer une autre playlist.",
        },
        {
          question: "Puis-je revenir vers Apple Music plus tard ?",
          answer:
            "Oui. Lancez un nouveau transfert avec Spotify comme source et Apple Music comme destination. Vérifiez à nouveau les correspondances, car les catalogues et la disponibilité peuvent évoluer.",
        },
      ],
    },
  },
};

export const guideCopy = {
  en: {
    home: "Home",
    eyebrow: "Free · Open source · In your browser",
    start: "Start your transfer",
    next: "Then connect",
    requirements: "Before you start",
    steps: "How to transfer your music",
    supported: "What gets transferred?",
    limits: "How the free allowance works",
    faq: "Questions before you switch",
    related: "Going the other way?",
    guideLinks: "Choose your transfer guide",
    languages: "Guide language",
    trust: "Your accounts, your choice",
    support: "Get help on GitHub",
    code: "Read the source code",
    privacy: "Privacy policy",
    terms: "Terms",
    appleHelp: "Apple’s transfer instructions",
    limitText: `Nonna includes up to ${FREE_TIER_LIMIT} successfully added items per destination account in a 24-hour window. Each playlist track, saved song or saved album counts as one item. A 100-track playlist uses 100 transfers, not one. Copying the same song through two playlists counts twice.`,
    resetText:
      "The window starts when your first successful transfer is recorded and resets 24 hours later, rather than at midnight. Check the remaining allowance and reset countdown in the app. If your selection exceeds it, choose fewer items or wait for the reset. Your music-service subscriptions are separate.",
    trustText:
      "Sign in through Spotify and Apple’s authorization screens; you do not enter your music-service password into Nonna. Nonna reads the source library and adds your selected matches to the destination. You can revoke access in your music service’s account settings.",
    ownerText:
      "Nonna.fm is an independent, open-source project by Tony Cosentino. It is not affiliated with Spotify or Apple. Report a problem or inspect the implementation on GitHub.",
    js: "Enable JavaScript to connect your accounts and transfer music. You can read this guide without it.",
  },
  fr: {
    home: "Accueil",
    eyebrow: "Gratuit · Open source · Dans votre navigateur",
    start: "Commencer le transfert",
    next: "Connectez ensuite",
    requirements: "Avant de commencer",
    steps: "Comment transférer votre musique",
    supported: "Quels éléments sont transférés ?",
    limits: "Comment fonctionne la limite gratuite",
    faq: "Questions avant de changer de service",
    related: "Vous faites le chemin inverse ?",
    guideLinks: "Choisissez votre guide de transfert",
    languages: "Langue du guide",
    trust: "Vos comptes, votre choix",
    support: "Obtenir de l’aide sur GitHub",
    code: "Consulter le code source",
    privacy: "Confidentialité",
    terms: "Conditions",
    appleHelp: "Les instructions de transfert d’Apple",
    limitText: `Nonna inclut jusqu’à ${FREE_TIER_LIMIT} éléments ajoutés avec succès par compte de destination sur une période de 24 heures. Chaque titre d’une playlist, morceau enregistré ou album enregistré compte pour un élément. Une playlist de 100 titres utilise 100 transferts, et non un seul. Copier le même morceau via deux playlists compte deux fois.`,
    resetText:
      "La période commence lorsque votre premier transfert réussi est enregistré et se réinitialise 24 heures plus tard, et non à minuit. L’application affiche le nombre de transferts restants et le compte à rebours. Si votre sélection dépasse la limite, réduisez-la ou attendez la réinitialisation. Les abonnements aux services musicaux restent séparés.",
    trustText:
      "Connectez-vous sur les écrans d’autorisation de Spotify et d’Apple : vous ne saisissez pas le mot de passe de votre service musical dans Nonna. Nonna lit la bibliothèque source et ajoute les correspondances choisies à la destination. Vous pouvez révoquer l’accès dans les paramètres de votre service musical.",
    ownerText:
      "Nonna.fm est un projet indépendant et open source de Tony Cosentino, sans affiliation avec Spotify ou Apple. Vous pouvez signaler un problème ou consulter le fonctionnement de l’application sur GitHub.",
    js: "Activez JavaScript pour connecter vos comptes et transférer votre musique. Ce guide reste lisible sans JavaScript.",
  },
} as const;
