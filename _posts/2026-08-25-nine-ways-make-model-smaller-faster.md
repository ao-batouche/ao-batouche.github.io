---
title: "Nine ways of saying ‘make the model smaller and faster’"
description: "An interactive guide to model distillation, pruning, healing, fine-tuning, quantization, sparse runtimes, and three related inference techniques."
author: Oussama Batouche
tags:
  - model compression
  - LLMs
  - inference
---

Model optimization terms often sound interchangeable, but they change different parts of the system and make different trade-offs. This interactive figure keeps one model and one set of readouts on screen so you can see what each technique actually changes.

{% include model_compression_figure.html %}

The estimates are deliberately simplified. Real results depend on the model architecture, hardware, kernels, calibration data, sequence length, and workload. The useful part is the direction of each trade-off—not the benchmark value itself.
