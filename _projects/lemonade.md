---
layout: page
title: Lemonade
description: My contributions to local AI serving span LLM-based model routing, context-window handling, and a simpler way to add models from the Router Builder.
importance: 2
category: Software
recent: true
recent_order: 2
role: Contributor
field: Open-source AI
visual: lemonade
github: https://github.com/lemonade-sdk/lemonade
links:
  - label: My pull requests
    url: https://github.com/lemonade-sdk/lemonade/pulls?q=is%3Apr+author%3Aao-batouche
tags: [C++, LLM routing, React]
link_label: Explore contributions
---

[← All projects]({{ '/projects/' | relative_url }})
{: .project-back }

{% include project_visual.html visual=page.visual %}

[Lemonade](https://github.com/lemonade-sdk/lemonade) is an open-source local AI server that runs models on a PC’s CPU, GPU, and NPU and exposes familiar APIs for applications. My contributions focus on how requests reach the right model and how developers configure that routing.

## LLM-based model selection

**[PR #2698](https://github.com/lemonade-sdk/lemonade/pull/2698) · Merged**

I implemented an LLM classifier that selects a model from a set of candidates and explains its choice. A compact router configuration expands into Lemonade’s existing policy engine, so it uses the same rules and decision format as other routing strategies.

The implementation validates structured responses, falls back to the default model when the reply is invalid, bounds the router invocation, and records the selected model and rationale in the decision trace. I added C++ tests and a live end-to-end test for the routing path.

## Routing within context limits

**[PR #3339](https://github.com/lemonade-sdk/lemonade/pull/3339) · Open**

I developed a change that estimates a request’s token footprint before dispatch and skips models whose context windows are too small. It also adds bounded rerouting when a backend rejects a request for exceeding its context limit, with tests for the capacity checks and fallback behavior.

This addresses conversations failing because the router selects a model that cannot fit the request.

## Adding models inside the Router Builder

**[PR #3445](https://github.com/lemonade-sdk/lemonade/pull/3445) · Open**

I added a model-registration flow directly to the Router Builder. Users can register a model manually or import its JSON configuration, then have it selected as a candidate once the server reports it. They can do this without leaving the builder or losing an in-progress configuration.

Pull request statuses checked on 16 October 2026. The linked PRs show their current status.
{: .caption }
