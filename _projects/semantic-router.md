---
layout: page
title: Semantic Router
description: I worked on the core router for F-Secure and AMD Silo AI’s agentic AI demo, directing requests across local, private, and cloud models.
importance: 3
category: Software
recent: true
recent_order: 3
role: Core router development
field: Applied AI
visual: semantic-router
links:
  - label: AMD announcement
    url: https://newsroom.amd.com/news/f-secure-amd-silo-ai-help-secure-agentic-ai-journeys/
tags: [Agentic AI, Model routing, Privacy]
---

[← All projects]({{ '/projects/' | relative_url }})
{: .project-back }

{% include project_visual.html visual=page.visual %}

I worked on the **core router** for the agentic AI project demonstrated by **F-Secure and AMD Silo AI**. The project explores how to route requests across local, private, and cloud AI models while keeping consumers’ digital journeys safe and private.

## Choosing where inference runs

The routing approach considers data sensitivity, cost, model capability, and performance to decide where a request should be processed and which model should handle it. A routine interaction can stay close to the user, while a more sensitive or demanding step can follow a different route.

The demonstration combines this routing with F-Secure’s trust assessment. Each step of a journey is evaluated in context: a trusted website can still contain untrusted reviews, hidden instructions, or sensitive checkout information. Lemonade provides the local AI serving layer in the architecture.

F-Secure plans to use the approach in TrustPath. The [AMD announcement](https://newsroom.amd.com/news/f-secure-amd-silo-ai-help-secure-agentic-ai-journeys/), published on 14 September 2026, describes the collaboration and its agentic shopping example.
