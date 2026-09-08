#!/usr/bin/env node
// Run against a built, locally served site. Reports and screenshots stay outside
// the published site. CHROME_CHANNEL=chrome uses an existing Chrome installation.
const { chromium } = require('playwright');
const AxeBuilder = require('@axe-core/playwright').default;
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');

const base = process.argv[2] || 'http://127.0.0.1:8080';
const output = path.resolve(process.argv[3] || 'audit-results');
const widths = [320, 375, 600, 768, 1024, 1440];

(async () => {
  fs.mkdirSync(output, {recursive: true});
  const sitemap = await (await fetch(base + '/sitemap.xml')).text();
  const routes = [...new Set([...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => new URL(match[1]).pathname).concat(['/about/', '/404.html']))];
  assert(routes.length > 2, 'Expected a populated sitemap');
  const browser = await chromium.launch({headless: true, ...(process.env.CHROME_CHANNEL ? {channel: process.env.CHROME_CHANNEL} : {})});
  const context = await browser.newContext({reducedMotion: 'reduce', colorScheme: 'light'});
  const page = await context.newPage();
  const failures = [];
  const networkWarnings = new Set();
  const checks = [];
  let route = '';
  page.on('pageerror', error => failures.push({route, type: 'javascript', message: error.message}));
  page.on('response', response => {
    if (response.status() >= 400 && response.url().startsWith(base)) failures.push({route, type: 'local-resource', url: response.url(), status: response.status()});
  });
  page.on('requestfailed', request => {
    if (request.failure()?.errorText !== 'net::ERR_ABORTED') networkWarnings.add(request.url());
  });
  try {
    for (route of routes) {
      await page.setViewportSize({width: 375, height: 900});
      await page.goto(base + route, {waitUntil: 'domcontentloaded', timeout: 45000});
      // Trigger below-the-fold lazy images before checking their source files.
      await page.evaluate(async () => {
        for (let y = 0; y < document.documentElement.scrollHeight; y += 750) {
          scrollTo(0, y);
          await new Promise(resolve => setTimeout(resolve, 60));
        }
        scrollTo(0, 0);
      });
      await page.waitForFunction(() => typeof window.jQuery === 'function');
      await page.waitForTimeout(250);
      for (const theme of ['light', 'dark']) {
        await page.evaluate(theme => setTheme(theme, false), theme);
        for (const width of widths) {
          await page.setViewportSize({width, height: 900});
          await page.waitForTimeout(100);
          const result = await page.evaluate(() => {
            const overflow = [...document.querySelectorAll('main *, #navbar *')].filter(el => {
              const rect = el.getBoundingClientRect();
              if (!rect.width || !rect.height || el.closest('.institution-marquee, [hidden], pre, .giscus, .giscus-frame')) return false;
              return rect.right > innerWidth + 2 || rect.left < -2;
            }).map(el => ({tag: el.tagName, className: el.className, text: el.textContent.trim().slice(0,80)})).slice(0,8);
            return {
              width: innerWidth, scrollWidth: document.documentElement.scrollWidth, overflow,
              brokenImages: [...document.images].filter(el => el.complete && !el.naturalWidth).map(el => el.currentSrc || el.src),
            };
          });
          checks.push({route, theme, ...result});
          if (result.scrollWidth > width + 2 || result.overflow.length || result.brokenImages.length) failures.push({route, theme, type: 'layout', ...result});
          if (width === 375) {
            const axe = await new AxeBuilder({page}).setLegacyMode().options({iframes:false}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
            for (const violation of axe.violations) failures.push({route, theme, type: 'accessibility', id: violation.id, impact: violation.impact, nodes: violation.nodes.map(n=>({target:n.target, summary:n.failureSummary}))});
          }
          if (['/', '/projects/', '/publications/', '/cv/', '/talks/'].includes(route) && (width === 375 || (width === 1440 && theme === 'light'))) {
            await page.screenshot({path: path.join(output, `${route.replaceAll('/','_')}-${theme}-${width}.png`), fullPage: true});
          }
        }
      }
      console.log('Checked ' + route);
    }

    // Real user interactions in addition to rendered-page checks.
    route = '/talks/';
    await page.goto(base + route, {waitUntil:'domcontentloaded'});
    const photoCard = page.locator('.talk-card').filter({has:page.locator('.talk-card-media--photo')}).first();
    const photoMedia = photoCard.locator('.talk-card-media--photo');
    await page.emulateMedia({reducedMotion:'no-preference'});
    assert.equal(await photoMedia.evaluate(el => getComputedStyle(el, '::after').transitionDuration), '1s', 'Photo overlay should fade over one second');
    assert.equal(await photoMedia.evaluate(el => getComputedStyle(el, '::after').pointerEvents), 'none', 'Overlay must not intercept card clicks');
    await page.emulateMedia({reducedMotion:'reduce'});
    await photoCard.locator('.talk-card-body').hover();
    await page.waitForFunction(() => getComputedStyle(document.querySelector('.talk-card-media--photo'), '::after').opacity === '0');
    await page.mouse.move(0, 0);
    await page.waitForFunction(() => getComputedStyle(document.querySelector('.talk-card-media--photo'), '::after').opacity === '1');
    const dates = await page.locator('.talk-card').evaluateAll(cards => cards.map(card => card.dataset.talkDate));
    assert(dates.length >= 8, 'Expected existing talks, conference presentations and ONCOSYS 2022');
    assert.deepEqual(dates, [...dates].sort().reverse(), 'Talk cards must run newest to oldest');
    for (const label of await page.locator('.talk-card-date').all()) {
      assert.match((await label.textContent()).trim(), /^\d{4}$/, 'Year-only dates must not imply a month or day');
    }
    for (const slug of ['eau-2023', 'eau-baltic-2024', 'healthinf-2024', 'oncosys-2022']) {
      const link = page.locator('.talk-card-link[href="/talks/' + slug + '/"]');
      assert.equal(await link.count(), 1, 'Expected one card per conference talk');
      await link.focus();
      await page.keyboard.press('Enter');
      await page.waitForURL('**/talks/' + slug + '/');
      if (slug === 'oncosys-2022') {
        assert.equal((await page.locator('.talk-detail-award').textContent()).trim(), '2nd best poster');
        assert((await page.locator('.talk-detail-photo img').getAttribute('src')).endsWith('/talks/oncosys-2022.jpg'));
      } else {
        assert(await page.locator('#related-research').isVisible());
        assert(await page.locator('.talk-publications .title a').count() > 0);
      }
      await page.locator('.talk-back').click();
      await page.waitForURL('**/talks/');
    }
    route = '/publications/';
    await page.setViewportSize({width: 375, height: 780});
    await page.goto(base + route, {waitUntil: 'domcontentloaded'});
    await page.locator('.navbar-toggler').click();
    await page.waitForFunction(() => document.querySelector('#navbarNav').classList.contains('show'));
    assert.equal(await page.locator('.navbar-toggler').getAttribute('aria-expanded'), 'true');
    await page.keyboard.press('Escape');
    await page.waitForFunction(() => !document.querySelector('#navbarNav').classList.contains('show'));
    await page.locator('.navbar-toggler').click();
    const themeBefore = await page.locator('html').getAttribute('data-theme');
    await page.locator('#light-toggle').click();
    assert.notEqual(await page.locator('html').getAttribute('data-theme'), themeBefore);
    const chosenTheme = await page.locator('html').getAttribute('data-theme');
    await page.reload({waitUntil:'domcontentloaded'});
    assert.equal(await page.locator('html').getAttribute('data-theme'), chosenTheme);
    const abstract = page.locator('#Batouche2026JPI button.abstract');
    await abstract.focus();
    await page.keyboard.press('Enter');
    assert.equal(await page.locator('#Batouche2026JPI-abstract').isVisible(), true);
    await page.locator('#Batouche2026JPI button.bibtex').focus();
    await page.keyboard.press('Space');
    assert.equal(await page.locator('#Batouche2026JPI-bibtex').isVisible(), true);
    assert.equal(await page.locator('#Batouche2026JPI-abstract').isVisible(), false);
    assert.equal(await page.locator('#Batouche2026JPI .title a').getAttribute('href'), 'https://doi.org/10.1016/j.jpi.2026.100715');
    assert(!/google_scholar_(id|citations|updated)/.test(await page.locator('#Batouche2026JPI-bibtex').textContent()), 'Display metadata must stay out of exported BibTeX');
    const scholarBadges = page.locator('.scholar-citations');
    const scholarBadgeCount = await scholarBadges.count();
    for (const badge of await scholarBadges.all()) {
      const link = badge.locator('a.scholar-citation-badge');
      assert(await link.isVisible());
      const countText = (await link.locator('strong').textContent()).trim();
      assert.match(countText, /^\d+ citations?$/);
      const count = Number.parseInt(countText, 10);
      assert.equal(countText, `${count} ${count === 1 ? 'citation' : 'citations'}`);
      const url = new URL(await link.getAttribute('href'));
      assert.equal(url.origin, 'https://scholar.google.com');
      assert.equal(url.searchParams.get('view_op'), 'view_citation');
      assert(url.searchParams.get('citation_for_view').startsWith(url.searchParams.get('user') + ':'));
      assert.match(await badge.locator('time').getAttribute('datetime'), /^\d{4}-\d{2}-\d{2}$/);
      assert((await link.boundingBox()).height >= 44, 'Scholar link must have a touch-friendly target');
      const info = badge.locator('.scholar-info-button');
      const tooltip = badge.locator('[role="tooltip"]');
      const cardBox = await badge.boundingBox();
      const infoBox = await info.boundingBox();
      assert(infoBox.x >= cardBox.x && infoBox.x + infoBox.width <= cardBox.x + cardBox.width, 'Information button must be inside the citation card');
      assert.equal((await tooltip.textContent()).trim(), 'Checked ' + (await tooltip.locator('time').textContent()).trim(), 'Tooltip should contain only the check date');
      assert.equal(await tooltip.isVisible(), false, 'Check date should be hidden initially');
      await info.hover();
      assert(await tooltip.isVisible(), 'Hover reveals the check date');
      await tooltip.hover();
      assert(await tooltip.isVisible(), 'Tooltip stays open while hovered');
      await page.keyboard.press('Escape');
      assert.equal(await tooltip.isVisible(), false, 'Escape dismisses the tooltip');
      await page.mouse.move(0, 0);
      await info.focus();
      assert(await tooltip.isVisible(), 'Keyboard focus reveals the check date');
      await page.keyboard.press('Escape');
      assert.equal(await tooltip.isVisible(), false);
      await info.click();
      assert(await tooltip.isVisible(), 'Click or tap reveals the check date');
      await info.click();
      assert.equal(await tooltip.isVisible(), false, 'A second click or tap dismisses the check date');
    }

    route = '/blog/nine-ways-make-model-smaller-faster/';
    await page.goto(base + route, {waitUntil:'domcontentloaded'});
    const parameters = page.locator('[data-stat="params"]');
    const baseline = await parameters.textContent();
    await page.locator('[data-action="distilled"][data-value="true"]').click();
    assert.notEqual(await parameters.textContent(), baseline);
    await page.locator('[data-control="reset"]').click();
    assert.equal(await parameters.textContent(), baseline);

    // The project grid remains usable even if scripts are disabled.
    await page.goto(base + '/projects/', {waitUntil:'domcontentloaded'});
    const projectCount = await page.locator('.grid-item').count();
    assert(projectCount > 0, 'Expected project cards');
    const noJs = await browser.newContext({javaScriptEnabled:false, viewport:{width:320,height:800}});
    const staticPage = await noJs.newPage();
    await staticPage.goto(base + '/projects/', {waitUntil:'domcontentloaded'});
    assert.equal(await staticPage.locator('.grid-item').count(), projectCount);
    assert(await staticPage.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 2));
    await staticPage.goto(base + '/publications/', {waitUntil:'domcontentloaded'});
    assert.equal(await staticPage.locator('.scholar-citation-badge').count(), scholarBadgeCount, 'Scholar badges must render without JavaScript');
    for (const badge of await staticPage.locator('.scholar-citation-badge').all()) assert(await badge.isVisible());
    assert(await staticPage.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 2));
    await noJs.close();

    // Storage restrictions must not disable theme controls or comments.
    const restricted = await browser.newContext();
    await restricted.addInitScript(() => {
      Storage.prototype.getItem = () => { throw new Error('Storage unavailable'); };
      Storage.prototype.setItem = () => { throw new Error('Storage unavailable'); };
    });
    const restrictedPage = await restricted.newPage();
    restrictedPage.on('pageerror', error => failures.push({type:'restricted-storage',message:error.message}));
    await restrictedPage.goto(base + route, {waitUntil:'domcontentloaded'});
    await restrictedPage.locator('#light-toggle').click();
    assert.equal(await restrictedPage.locator('#giscus_fallback').isVisible(), true);
    await restricted.close();
  } catch (error) {
    failures.push({route, type:'interaction', message:error.stack});
  } finally {
    fs.writeFileSync(path.join(output, 'report.json'), JSON.stringify({pages:routes.length, viewports:widths, checks, failures, networkWarnings:[...networkWarnings]}, null, 2));
    await browser.close();
  }
  console.log(JSON.stringify({pages:routes.length, layoutChecks:checks.length, failures:failures.length, networkWarnings:networkWarnings.size, report:path.join(output,'report.json')}));
  if (failures.length) process.exitCode = 1;
})();
