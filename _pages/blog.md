---
layout: page
title: Blog
permalink: /blog/
description: Short notes on AI, statistics, research practice, and engineering.
nav: true
nav_order: 4
---

<div class="blog-index">
  <p class="blog-intro">
    Ideas from research, engineering, science and applied science.
  </p>

  {% if site.posts.size > 0 %}
  <ol class="blog-list">
    {% for post in site.posts %}
      {% assign word_count = post.content | number_of_words %}
      {% assign reading_time = word_count | plus: 179 | divided_by: 180 %}
      <li class="blog-list-item">
        <article>
          <div class="blog-list-meta">
            <time datetime="{{ post.date | date_to_xmlschema }}">{{ post.date | date: "%B %-d, %Y" }}</time>
            <span aria-hidden="true">&middot;</span>
            <span>{{ reading_time }} min read</span>
          </div>
          <h2><a href="{{ post.url | relative_url }}">{{ post.title }}</a></h2>
          <p>{{ post.description | default: post.excerpt | strip_html | normalize_whitespace | truncate: 190 }}</p>
          {% if post.tags and post.tags.size > 0 %}
          <ul class="blog-tags" aria-label="Article topics">
            {% for tag in post.tags %}
            <li>{{ tag }}</li>
            {% endfor %}
          </ul>
          {% endif %}
          <a class="blog-read-link" href="{{ post.url | relative_url }}" aria-label="Read {{ post.title }}">
            Read article <span aria-hidden="true">&rarr;</span>
          </a>
        </article>
      </li>
    {% endfor %}
  </ol>
  {% else %}
  <section class="blog-empty" aria-labelledby="blog-empty-title">
    <span class="blog-empty-mark" aria-hidden="true">&#10022;</span>
    <div>
      <h2 id="blog-empty-title">First article coming soon.</h2>
      <p>New notes will appear here as they are published.</p>
    </div>
  </section>
  {% endif %}
</div>
