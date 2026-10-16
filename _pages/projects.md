---
layout: projects
title: Projects
permalink: /projects/
description: Explore Oussama Batouche's recent work, including ferryGL, Lemonade contributions, and Semantic Router, alongside research, software, and hackathon projects.
intro: Recent work in AI systems and open source, alongside research, software, and hackathon projects.
nav: true
nav_order: 3
masonry: false
display_categories: [Recent, Research, Software, Hackathons]
horizontal: false
---

{% assign recent_projects = site.projects | where: "recent", true | sort: "recent_order" %}
<div class="projects projects-index">
  <nav class="project-navigation" aria-label="Project groups">
    {% for category in page.display_categories %}
      {% if category == "Recent" %}
        {% assign group_projects = recent_projects %}
      {% else %}
        {% assign group_projects = site.projects | where: "category", category %}
      {% endif %}
      {% if group_projects.size > 0 %}
      <a class="project-navigation-link{% if category == 'Recent' %} project-navigation-link--recent{% endif %}" href="#{{ category | slugify }}">{{ category }} <span class="project-count">{{ group_projects.size }}</span></a>
      {% endif %}
    {% endfor %}
  </nav>

  {% for category in page.display_categories %}
    {% if category == "Recent" %}
      {% assign sorted_projects = recent_projects %}
      {% assign is_recent = true %}
    {% else %}
      {% assign sorted_projects = site.projects | where: "category", category | sort: "importance" %}
      {% assign is_recent = false %}
    {% endif %}
    {% if sorted_projects.size > 0 %}
    <section class="project-section{% if is_recent %} project-section--recent{% endif %}" aria-labelledby="{{ category | slugify }}">
      <header class="project-section-header">
        <h2 id="{{ category | slugify }}">{{ category }} <span class="project-count">{{ sorted_projects.size }}</span></h2>
        <p>{% case category %}{% when 'Recent' %}What I’ve been building and contributing to lately.{% when 'Research' %}AI, medical imaging, and questions worth investigating.{% when 'Software' %}Tools and applications built for real-world needs.{% when 'Hackathons' %}Ideas turned into working prototypes, together.{% endcase %}</p>
      </header>
      <div class="grid{% if is_recent %} grid--recent{% endif %}">
        {% for project in sorted_projects %}
          {% include projects.html recent=is_recent %}
        {% endfor %}
      </div>
    </section>
    {% endif %}
  {% endfor %}

  {% include institution_marquee.html items=site.data.project_entities label="Entities I worked with" aria_label="Entities I worked with" %}
</div>
