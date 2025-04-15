# Privacy Policy

_Last Updated: 2025 April 15th_

Welcome to **nonna.fm**, developed by Tony Cosentino ("we," "us," or "our"). By accessing or using our website and application (collectively, "the Service"), you agree to these Privacy Policy and Terms of Use.

## Information We Collect

We respect your privacy and collect only minimal information necessary for the functionality of the Service:

- **OAuth Tokens:** When you connect a third-party music service (like Spotify or Apple Music), we obtain temporary authorization tokens (OAuth tokens) from that service after your explicit approval. These tokens grant our application permission to access your music library data _only_ for the purpose of transferring it as requested. Critically, **these tokens are stored exclusively within your web browser's local storage** on your device and are never transmitted to or stored on our servers. They remain in your browser only for the duration of your active session and are essential for the transfer process.
- **Usage Tracking:** To enforce usage limits and prevent abuse, we store an irreversible cryptographic hash derived from your **target** streaming platform user ID. This hash cannot be used to identify you or access your accounts and is the _only_ piece of user-related data stored on our servers.

## How We Use Your Information

The information collected is used solely for the core functionality of the Service:

- **Music Transfer:** The OAuth tokens stored in your browser are used directly by the application running in your browser to communicate with the APIs of your selected source and target music services. This communication involves reading your music library from the source service and writing it to the target service, as you initiate. Your music library data is processed ephemerally during the transfer and is not stored by us.
- **Usage Limit Enforcement:** The irreversible hash of your target platform user ID is checked on our servers when you initiate a transfer to ensure compliance with any applicable usage limits (e.g., free tier quotas).

## Data Sharing

We are committed to protecting your privacy and **do not share or sell your personal information or music library data** with any third parties, except in the following limited circumstances:

- **Service Providers:** We interact directly with the APIs of the music services you connect (e.g., Spotify, Apple Music) as necessary to perform the music transfer you request. This interaction is governed by the respective privacy policies of those services.
- **Analytics:** As detailed below, we use Vercel Analytics to collect anonymous, aggregated traffic data to help us improve the Service. This data does not include your personal data information.
- **Payment Processors:** For premium subscriptions, payment information is handled directly by secure third-party payment processors. We do not access or store your full payment details.

We do not share the irreversible user ID hash with any external parties.

## Third-Party Integrations

Our Service integrates with:

- Spotify
- Apple Music
- YouTube Music
- Deezer
- Pandora (planned)
- Tidal (planned)
- Amazon Music (planned)

These third-party services have their own privacy policies, and we encourage you to review them:

- [Google Privacy Policy](http://www.google.com/policies/privacy)
- [Spotify Privacy Policy](https://www.spotify.com/legal/privacy-policy/)
- [Apple Music Privacy](https://www.apple.com/legal/privacy/data/en/apple-music/)
- [Deezer Privacy](https://www.deezer.com/legal/personal-datas)

## Data Deletion

You can request deletion of your data at any time by:

1. Emailing us at [contact@nonna.fm](mailto:contact@nonna.fm)
2. Revoking access through respective [platform settings](TERMS.md#integrations)

## Analytics, Cookies, and Ads

We use Vercel Analytics, Google Analytics, and Google Ads to monitor and improve our Service. These services may use cookies to collect anonymous traffic data. Additionally, Google Ads may display advertising within our Service.

## Children's Privacy

Our Service is intended for users aged 13 and older. We do not knowingly collect or solicit information from children under the age of 13.

## Contact

If you have any questions regarding your privacy, please contact us at [contact@nonna.fm](mailto:contact@nonna.fm).
