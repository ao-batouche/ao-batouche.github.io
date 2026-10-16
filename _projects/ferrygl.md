---
layout: page
title: ferryGL
description: I built a Python CLI that brings GitHub issues and pull requests into Linear, keeps their status in sync, and works without repository admin access.
importance: 1
category: Software
recent: true
recent_order: 1
role: Creator
field: Developer tooling
visual: ferrygl
github: https://github.com/ao-batouche/ferryGL
links:
  - label: Documentation
    url: https://oussamabatouche.com/ferryGL/
    external: true
tags: [Python, GitHub, Linear]
---

[← All projects]({{ '/projects/' | relative_url }})
{: .project-back }

{% include project_visual.html visual=page.visual %}

I built **ferryGL** to connect the GitHub repositories I contribute to with the Linear workspace where I plan my work. It works with repositories I can read, even when I cannot install an organization-wide integration.

The command-line tool finds issues and pull requests I am involved in, creates or links the corresponding Linear issues, and updates their status as the GitHub work progresses. An issue and its fixing pull request share one Linear task instead of becoming duplicate work items.

## What I built

- **A GitHub-to-Linear sync workflow:** discover relevant issues and pull requests, match existing Linear tasks, and plan status updates.
- **A preview-first CLI:** inspect the proposed changes before applying them. GitHub access stays read-only.
- **Respect for manual edits:** a Linear status changes only when the corresponding GitHub state changes, so rerunning the tool leaves manual adjustments alone.
- **No background service:** a Python command with no server or database; sync state lives in the metadata of Linear’s GitHub links.

ferryGL is an early-stage, independent open-source project, unaffiliated with GitHub or Linear.

[Source code](https://github.com/ao-batouche/ferryGL) · <a href="https://oussamabatouche.com/ferryGL/" rel="external">Documentation and getting started</a>
