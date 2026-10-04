/*
 * anvil-local.js
 *
 * file:// has no directory-index behavior, so a clean href like "../"
 * opens a raw directory listing instead of index.html when a page is
 * viewed straight off disk. When (and only when) the page is loaded
 * over file://, rewrite relative directory-style links to point at
 * their index.html. Over http(s) this script does nothing.
 */
(() => {
  if (location.protocol !== 'file:') return;

  function init() {
    for (const anchor of document.querySelectorAll('a[href]')) {
      const href = anchor.getAttribute('href');

      // Skip absolute URLs, root-relative paths, and fragments.
      if (/^([a-z][a-z0-9+.-]*:|\/|#|\?)/i.test(href)) {
        continue;
      }

      // Preserve query strings and fragments after the directory path.
      const suffixIndex = href.search(/[?#]/);
      const path = suffixIndex === -1 ? href : href.slice(0, suffixIndex);
      const suffix = suffixIndex === -1 ? '' : href.slice(suffixIndex);

      if (path === '.' || path === '..' || path.endsWith('/')) {
        anchor.setAttribute('href', path.replace(/\/?$/, '/') + 'index.html' + suffix);
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
