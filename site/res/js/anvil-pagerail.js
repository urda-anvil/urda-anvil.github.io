/*
 * Page outlines and scroll tracking. Authored rails work without generation.
 * data-pagerail="auto" derives entries from .railed h2/h3 headings in the same
 * .withpagerail. Load after page renderers. Existing top links remain intact.
 */
(() => {
  function buildRail(rail) {
    if (rail.dataset.pagerail !== 'auto') return;
    const content = rail.closest('.withpagerail')?.querySelector('.railed');
    if (!content) return;
    const list = rail.querySelector('ul') || rail.appendChild(document.createElement('ul'));
    // Preserve the authored top link. Headings supply every other entry.
    for (const item of [...list.children]) {
      if (!item.querySelector('.totop')) item.remove();
    }
    for (const heading of content.querySelectorAll('h2[id], h3[id]')) {
      const label = heading.cloneNode(true);
      for (const extra of label.querySelectorAll('.heading-anchor, .chip')) extra.remove();
      const item = document.createElement('li');
      const link = document.createElement('a');
      link.href = '#' + encodeURIComponent(heading.id);
      link.textContent = heading.dataset.railLabel || label.textContent.trim();
      if (heading.tagName === 'H3') link.classList.add('sub');
      if (heading.hasAttribute('data-rail-ruled')) item.classList.add('ruled');
      if (heading.hasAttribute('data-rail-dotted')) {
        link.classList.add('dotted');
        link.style.setProperty('--rail', getComputedStyle(heading).getPropertyValue('--rail'));
      }
      item.append(link);
      list.append(item);
    }
  }

  function initRail(rail) {
    if (rail.dataset.railReady) return;
    rail.dataset.railReady = 'true';
    buildRail(rail);
    const railLinks = [];
    for (const a of rail.querySelectorAll('a[href^="#"]')) {
      let id;
      try { id = decodeURIComponent(a.hash.slice(1)); } catch { continue; }
      const target = document.getElementById(id);
      if (target) railLinks.push({ a, target });
    }
    if (railLinks.length === 0) return;
    for (const link of rail.querySelectorAll('a.on, a[aria-current]')) {
      link.classList.remove('on');
      link.removeAttribute('aria-current');
    }

    // Light the last heading to pass the trigger line. Tracking position rather
    // than intersection keeps a section taller than the viewport lit for as
    // long as it is on screen.
    let currentLink = null;

    // The trigger line sits on the rail's own top line, except over the last
    // screen of scroll: there it slides down to the bottom of the viewport.
    // Headings near the end of the page can never scroll up to the top line,
    // so without the slide the rail would skip straight past them to the last
    // entry; with it, each one still lights in turn.
    function triggerLine() {
      const value = parseFloat(getComputedStyle(rail).getPropertyValue('--pagerail-top'));
      const railTop = Number.isFinite(value) ? value : 24;
      const topLine = railTop + 8;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const slideLength = Math.min(window.innerHeight, maxScroll);
      const remaining = Math.max(0, maxScroll - window.scrollY);
      if (slideLength <= 0 || remaining >= slideLength) return topLine;
      const progress = 1 - remaining / slideLength;   // 0 where the slide starts, 1 at the bottom
      return topLine + progress * (window.innerHeight - topLine);
    }

    // A clicked rail link wins over position tracking until the reader scrolls
    // again. Without the hold, a heading near the end of the page (which can
    // never reach the top line) lands under the slid trigger line, and the rail
    // lights a later entry instead of the one clicked.
    let pinnedLink = null;
    let restY = null;             // where the click's own scroll came to rest
    let settleTimer = 0;
    const SETTLE_MS = 150;        // no scroll events for this long means the click's scroll is done

    function syncRail() {
      let active = pinnedLink;
      if (!active) {
        const line = triggerLine();
        active = railLinks[0];
        for (const link of railLinks) {
          if (link.target && link.target.getBoundingClientRect().top <= line) {
            active = link;
          }
        }
      }
      if (active === currentLink) return;
      if (currentLink) {
        currentLink.a.classList.remove('on');
        currentLink.a.removeAttribute('aria-current');
      }
      active.a.classList.add('on');
      active.a.setAttribute('aria-current', 'true');
      currentLink = active;
    }

    function waitForRest() {
      clearTimeout(settleTimer);
      settleTimer = setTimeout(() => { restY = window.scrollY; }, SETTLE_MS);
    }

    function pin(link) {
      pinnedLink = link;
      restY = null;
      waitForRest();
      syncRail();
    }

    rail.addEventListener('click', (event) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = railLinks.find((l) => l.a === event.target.closest('a'));
      if (link) pin(link);
    });

    let railTicking = false;
    window.addEventListener('scroll', () => {
      if (pinnedLink) {
        // still the click's own scroll: keep the hold and restart the wait
        if (restY === null) {
          waitForRest();
          return;
        }
        // at rest where the click left it: keep the hold
        if (Math.abs(window.scrollY - restY) < 2) return;
        // the reader scrolled again: hand back to position tracking
        pinnedLink = null;
      }
      if (railTicking) return;
      railTicking = true;
      requestAnimationFrame(() => {
        syncRail();
        railTicking = false;
      });
    }, { passive: true });
    window.addEventListener('resize', syncRail, { passive: true });

    window.addEventListener('hashchange', () => {
      const link = railLinks.find((entry) => entry.a.hash === window.location.hash);
      if (link) pin(link);
      else { pinnedLink = null; syncRail(); }
    });

    // A page opened on a #fragment (e.g. a shared permalink) holds that entry
    // the same way a click does.
    const hashLink = railLinks.find((l) => l.a.hash === window.location.hash);
    if (window.location.hash && hashLink) {
      pin(hashLink);
    } else {
      syncRail();
    }
  }

  function init() {
    for (const rail of document.querySelectorAll('.pagerail')) initRail(rail);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
