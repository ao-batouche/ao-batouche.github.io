---
layout: page
title: HistoEncoder
description: An open-source foundation model for prostate cancer digital pathology, trained without labels on 48 million tissue tiles.
img: assets/img/projects/histoencoder/announcement.jpg
image_alt: HistoEncoder publication poster from Oussama Batouche’s LinkedIn post, illustrating label-free tissue representation learning and key study findings.
image_fit: contain
importance: 0
category: Research
github: https://github.com/jopo666/HistoEncoder
links:
  - label: Paper
    url: https://doi.org/10.1016/j.jpi.2026.100715
  - label: My announcement
    url: https://www.linkedin.com/posts/oussama-batouche_histoencoder-gpu-ai-activity-7510613179945607168-wN9A
tags: [Foundation models, Digital pathology, Self-supervised learning]
---

[← All projects]({{ '/projects/' | relative_url }})
{: .project-back }

I co-authored **HistoEncoder**, an open-source foundation model for prostate cancer digital pathology. We pre-trained it without labels on **48 million tissue tiles from 1,307 patients**, using DINO self-supervised learning with an XCiT backbone.

## What we found

- **Efficient feature extraction:** in our benchmarks, HistoEncoder achieved comparable Gleason pattern classification performance to larger pan-cancer foundation models while running **3–5× faster**.
- **Learning from limited annotations:** fine-tuning on **four slides** reached performance comparable to a natural-image model fine-tuned on **37**.
- **Large-scale tissue annotation:** clustering the learned features grouped similar tissue morphology, supporting pre-annotation of large datasets.

Histology clusters also carried prognostic information on prostate cancer-specific mortality of a similar magnitude to Gleason grading in internal cross-validation. Adding them to Gleason did not improve prognostic performance in that analysis.

The clinical proof-of-concept analyses ran on a single laptop. Code and model weights are openly available in the [HistoEncoder repository](https://github.com/jopo666/HistoEncoder).

The study is published in the [Journal of Pathology Informatics](https://doi.org/10.1016/j.jpi.2026.100715) (2026). This summary follows [my publication announcement](https://www.linkedin.com/posts/oussama-batouche_histoencoder-gpu-ai-activity-7510613179945607168-wN9A) and the [published abstract](https://pubmed.ncbi.nlm.nih.gov/42859633/).

## Publication announcement

<div class="histoencoder-announcement">
  {% include figure.html path=page.img alt=page.image_alt sizes="(min-width: 650px) 600px, calc(100vw - 30px)" zoomable=true %}
</div>

Original poster from [my LinkedIn post](https://www.linkedin.com/posts/oussama-batouche_histoencoder-gpu-ai-activity-7510613179945607168-wN9A).
{: .caption }
