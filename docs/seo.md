# Web SEO

The public search surface is the homepage in seven languages: `/en`, `/fr`,
`/es`, `/pt`, `/it`, `/de`, and `/ja`. Transfer sessions and OAuth callbacks
are application screens and must not be indexed.

## Baseline, September 8, 2026

Search Console for the `nonna.fm` domain reported:

- June 7 to September 6: 3 clicks, 17 impressions, 17.6% CTR, average position 4.1.
- All three clicks went to `/en`; the page report showed 14 impressions for
  `/en` and 6 for `/fr`. Page-level impressions can overlap and should not be
  summed to reproduce the property total.
- The only disclosed query was `nonna music` (one impression, no clicks).
  The volume is too low to draw conclusions about non-brand keyword demand.
- Page indexing, last updated September 4: 2 indexed URLs and 22 excluded
  URLs (4 soft 404, 3 redirects, 13 crawled but not indexed, 2 discovered but
  not indexed).
- Soft 404 examples were obsolete library routes, including
  `/ja/library/amazon/tidal` and `/en/library/tidal/apple`. Crawled but not
  indexed examples included `/es`, `/it`, `/pt`, and obsolete library routes.
- The sitemap index was read successfully on September 7 and reported seven
  discovered pages.
- URL Inspection for `/fr` (last crawl August 20) confirmed that the page
  was indexed despite declaring `/en` as canonical: Google selected `/fr`.
  It also detected a review snippet from the unsubstantiated rating markup.

Production HTTP inspection found an empty homepage loading boundary in the
initial HTML, English metadata across locales, and a canonical URL pointing
all translated homepages to `/en`. These are technical defects; the reports
alone do not establish how much each defect contributed to low traffic.

## Rendering and indexing rules

- Each homepage is statically rendered with its translated heading, service
  choices, transfer instructions and FAQs in the initial HTML.
- Authentication errors read the query string in a small client component
  inside Suspense. Public content must stay outside that loading boundary.
- Language controls read query parameters when clicked so they do not turn
  the header into a client rendering bailout.
- Every homepage has one self-referential canonical, localized title and
  description, reciprocal language alternates, and `/en` as `x-default`.
- The locale layout defaults to `noindex, follow`; each public page opts in
  explicitly. Library pages also declare `noindex`, and private screens do
  not inherit homepage canonical links or structured data.
- Robots rules allow search crawlers to read those noindex tags and fetch
  rendering assets. API endpoints are excluded except the public OG image.
- Sitemap URLs and language alternates match the public routes. Omit
  `lastmod` until an actual content modification date is maintained; a
  request or regeneration timestamp is not a content update.
- Homepage JSON-LD describes the public web app and its repository. Do not
  add ratings, paid offers, screenshots, search actions or service support
  that cannot be verified in the public product.
- Public copy reflects Spotify and Apple Music availability. Update the
  translated copy alongside production service availability or free limits.

## Verification

Run `pnpm build`, `pnpm test`, `pnpm biome:ci`, and
`pnpm --filter web test:e2e`. The SEO browser suite parses the actual HTTP
responses for every sitemap locale, checks canonical and language links,
checks private-page indexing rules, and navigates with JavaScript disabled.
It also checks static assets, trailing-slash redirects and obsolete URLs.

## After deployment

1. Inspect the live `/en`, `/fr`, `/es`, `/it`, and `/pt` URLs in Search
   Console. Confirm content is rendered, indexing is allowed, and each
   user-declared canonical matches the inspected locale.
2. Request indexing for the corrected homepages after the production checks
   pass. Confirm the sitemap remains successful and contains seven pages.
3. Inspect obsolete library examples and confirm a real 404 response. For
   supported library routes, confirm the noindex directive. Then validate
   relevant Page indexing fixes; redirects are expected exclusions.
4. Record the deployment date and compare clicks, impressions, indexed
   homepages, excluded-page reasons, and brand versus non-brand queries
   weekly for four weeks. Google-selected canonicals and indexing may take
   time to change after recrawling.
5. Use new query evidence to decide whether dedicated transfer guides are
   useful. Add routes only with useful, accurate content, internal links and
   matching sitemap entries. Technical repairs do not guarantee rankings.

References: [JavaScript SEO](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics),
[localized pages](https://developers.google.com/search/docs/specialty/international/localized-versions),
[noindex](https://developers.google.com/search/docs/crawling-indexing/block-indexing),
[sitemap dates](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap),
[structured data policies](https://developers.google.com/search/docs/appearance/structured-data/sd-policies).
