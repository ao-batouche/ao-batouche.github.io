---
title: "Nine ways of saying ‘make the model smaller and faster’"
description: "An interactive guide to model distillation, pruning, healing, fine-tuning, quantisation, kernel optimisation, and the inference concepts behind their trade-offs."
author: Oussama Batouche
og_image: /assets/img/blog/nine-ways-make-model-smaller-faster-thumbnail.png
og_image_alt: "Make the model smaller and faster: an illustrated model-compression overview [Oussama Batouche]"
tags:
  - model compression
  - LLMs
  - inference
giscus_comments: true
---

Model optimization terms often sound interchangeable, but they change different parts of the system and make different trade-offs. This interactive figure keeps one model and one set of readouts on screen so you can see what each technique actually changes.

{% include model_compression_figure.html %}

The estimates are deliberately simplified. Real results depend on the model architecture, hardware, kernels, calibration data, sequence length, and workload. The useful part is the direction of each trade-off—not the benchmark value itself.
