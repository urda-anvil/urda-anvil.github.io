/*
 * anvil-pagerail.js
 *
 * Scroll-spy for the "On this page" rail (.pagerail, styled in
 * anvil-core.css). The page builds the rail's links from its own data; this
 * script only lights the link for the section in view. Load it with defer:
 * a page's inline end-of-body script has built the rail by the time a
 * deferred script runs.
 */
document.addEventListener('DOMContentLoaded', () => {
  const rail = document.querySelector('.pagerail');
  if (!rail) return;

  const railLinks = [];
  for (const a of rail.querySelectorAll('a[href^="#"]')) {
    railLinks.push({ a, target: document.getElementById(a.hash.slice(1)) });
  }
  if (railLinks.length === 0) return;

  // Light the last heading to pass the trigger line. Tracking position rather
  // than intersection keeps a section taller than the viewport lit for as
  // long as it is on screen.
  const RAIL_TOP = 24;          // matches .pagerail top and the headings' scroll-margin-top
  let currentLink = null;

  // The trigger line sits on the rail's own top line, except over the last
  // screen of scroll: there it slides down to the bottom of the viewport.
  // Headings near the end of the page can never scroll up to the top line,
  // so without the slide the rail would skip straight past them to the last
  // entry; with it, each one still lights in turn.
  function triggerLine() {
    const topLine = RAIL_TOP + 8;
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

  // A page opened on a #fragment (e.g. a shared permalink) holds that entry
  // the same way a click does.
  const hashLink = railLinks.find((l) => l.a.hash === window.location.hash);
  if (window.location.hash && hashLink) {
    pin(hashLink);
  } else {
    syncRail();
  }
});
