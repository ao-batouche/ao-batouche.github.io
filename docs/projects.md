# Maintaining projects

Project content lives in `_projects/`; the index is `_pages/projects.md`.

Set `recent: true` and a numeric `recent_order` in a project's front matter to
feature it in the Recent group. Set `category` to Research, Software, or
Hackathons. Recent is a highlight group: featured projects also appear in their
category, sorted by `importance`. Lower `recent_order` values appear first in
Recent. Remove `recent: true` to stop highlighting a project.

Recent cards use `role` and `field` for context, optional `visual` for a logo or
schematic (`ferrygl`, `lemonade`, or `semantic-router`), and optional `links` with
`label` and `url` fields for additional resources. An `img` works when no
`visual` is set. Keep contribution descriptions and linked PR statuses aligned
with their sources.

Official logo sources, screenshot capture details, and generated illustration
prompts are recorded in `assets/img/projects/media-sources.md`.
Use `image_fit: contain` for artwork that must stay fully visible, such as the
HistoEncoder announcement poster, rather than cropping it to the card shape.

Links to separately deployed sites on the same domain, such as ferryGL's docs,
use `rel="external"` (`external: true` in card links). The indexability audit
excludes these absolute links from checks against this site's generated files.
