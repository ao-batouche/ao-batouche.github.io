# Personal website

[www.OussamaBatouche.com](https://oussamabatouche.com/)

## Build and preview

This is a Jekyll site. Use Ruby 3.2 or newer, Bundler, and ImageMagick, or the
existing Docker configuration:

```sh
docker compose up
```

The preview is available at `http://localhost:8080`. A production build and the
same SEO/link audit used by deployment can be run with:

```sh
JEKYLL_ENV=production bundle exec jekyll build --lsi
bundle exec ruby bin/audit-indexability _site
```

The audit checks canonical URLs, the sitemap, unique page titles/descriptions,
JSON-LD, headings, image alternatives, and local links, fragments, and assets.

## Browser checks

With the preview running:

```sh
npm ci
npx playwright install chromium
npm run audit:browser -- http://localhost:8080
```

Alternatively, set `CHROME_CHANNEL=chrome` to use an installed Google Chrome.
The audit covers every sitemap page at 320, 375, 600, 768, 1024, and 1440 pixels
in light and dark mode, plus menu, theme persistence, keyboard publication
controls, the interactive article, and storage restrictions. Reports and selected
screenshots are saved in `audit-results/` (ignored by Git and Jekyll).

Accessibility checks cover the site's own content. Third-party frame interiors
are not under this site's control; failed external requests are reported
separately. Inspect the responsive screenshots alongside the automated checks.

## Content

- Biography: `_pages/home.md` and `_pages/about.md`; keep `_config.yml` metadata aligned.
- Publications: `_bibliography/papers.bib`; journal badges: `_data/venues.yml`.
- News: `_news/`; use `inline: true` for short announcements.
- CV: `_data/cv.yml` and the downloadable `assets/pdf/Batouche_CV.pdf`.
- Projects and articles: `_projects/` and `_posts/`.
- Conference talk pages: `_talks/`. The Talks archive also includes existing
  news entries marked `talk: true`, sorted by `date` from newest to oldest.

### Updating Google Scholar citation counts

Edit the publication's entry in `_bibliography/papers.bib`. For example,
HistoEncoder (`Batouche2026JPI`) has:

```bibtex
  google_scholar_id = {UeHWp8X0CEIC},
  google_scholar_citations = {7},
  google_scholar_updated = {2026-09-08},
```

After checking the paper on Google Scholar, update `google_scholar_citations`
to the whole-number count and `google_scholar_updated` to the check date
(`YYYY-MM-DD`). Keep `google_scholar_id` unchanged. Save and rebuild/redeploy
the site as usual; the Docker preview normally rebuilds on save.

For another paper, open its title on your Scholar profile and copy the suffix
after the colon in the URL's `citation_for_view=PROFILE_ID:PUBLICATION_ID`
parameter (`%3A` is an encoded colon). Use that suffix as `google_scholar_id`.
The profile ID is already configured as `scholar_userid` in `_config.yml`.

All three fields are required to show the badge. An explicit count of `0`
displays zero citations; a missing, blank, negative, or malformed count hides
it. Remove the fields to hide one paper's badge, or set
`enable_publication_badges.google_scholar: false` in `_config.yml` to hide all
Scholar badges (restart Jekyll after changing configuration).

These are manual snapshots, not automatically refreshed counts. Hover over the
small information button inside a badge to see the check date. Keyboard focus
also reveals it; on touch screens, tap the button. Press Escape, tap again, or
tap outside to dismiss it. The badge links to the exact Scholar record and works without JavaScript,
an API key, or an external badge service. The fields are hidden from the displayed
BibTeX citation; the publication's DOI and journal details remain independent.
Scholar and Dimensions cover different records: do not add their counts together.
The EHR paper's Scholar count is shown on the HEALTHINF proceedings entry only,
not repeated on its separate arXiv entry. Only add verified counts; a blank
Scholar count is not automatically treated as zero.

Run `bundle exec ruby bin/test-scholar-citations` to check zero/singular counts,
missing metadata, the visibility toggle, and BibTeX filtering. The browser audit
also checks rendered Scholar links, touch targets, and JavaScript-free display.

### Talk pages and photos

For a talk photo, add the file under `assets/img/talks/` and set `image` to its
path (for example `assets/img/talks/eau-2023.jpg`) and `image_alt` to a meaningful
description. Optional `image_position` (for example `right bottom`) controls the
card crop without editing the original photo. Leave `image` blank to show the styled photo placeholder on both
the card and detail page. Optional `photo_source` and `photo_credit` fields add
a source link below the photo. The HEALTHINF 2024 photo is from Oussama's own
LinkedIn conference post, linked on the talk page.

Talk metadata uses `event_short`, `location`, `talk_type`, and `talk_summary`
for cards; `event_dates` is the human-readable date or conference date range.
`publication_keys` lists keys from `papers.bib` to render the associated papers
or abstracts without duplicating their bibliographic data.

When only a talk's year is known, set `date_precision: year` and use January 1
of that year as the internal `date` sorting value. Cards and detail pages will
show only the year, without claiming an exact day or month. Once confirmed,
update `date` and `event_dates`, remove `date_precision`, and add `location`.
Leave `location` absent until known; it is optional.

Short announcements and legacy pages deliberately use `noindex` and stay out
of the sitemap. Do not publish the theme's sample resume or demo assets.
Core jQuery and MDB styles are served locally at their existing versions. Inter
and Source Serif 4 use the Latin variable-font files from Fontsource 5.3.0; their
SIL Open Font License files are included in `assets/fonts/`.

Icon fonts use small, checked-in subsets; the original full fonts remain as
automatic fallbacks for future icons. To regenerate the subsets with FontTools
and Brotli installed, run these from the repository root (normal builds do not
need these tools):

```sh
pyftsubset assets/webfonts/fa-solid-900.woff2 --unicodes=U+0023,U+F0E0,U+F133,U+F185,U+F186,U+F1C1,U+F328,U+F46C --flavor=woff2 --output-file=assets/webfonts/fa-solid-site.woff2 --name-IDs='*'
pyftsubset assets/webfonts/fa-brands-400.woff2 --unicodes=U+F08C,U+F09B --flavor=woff2 --output-file=assets/webfonts/fa-brands-site.woff2 --name-IDs='*'
pyftsubset assets/fonts/academicons.woff --unicodes=U+E95E,U+E9D4,U+E9D9 --flavor=woff2 --output-file=assets/fonts/academicons-site.woff2 --name-IDs='*'
```
