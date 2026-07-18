/*
 * anvil-local.js
 *
 * file:// has no directory-index behavior, so a clean href like "../"
 * opens a raw directory listing instead of index.html when a page is
 * viewed straight off disk. When (and only when) the page is loaded
 * over file://, rewrite relative directory-style links to point at
 * their index.html. Over http(s) this script does nothing.
 */
if (location.protocol === 'file:') {
  document.addEventListener('DOMContentLoaded', () => {
    for (const anchor of document.querySelectorAll('a[href]')) {
      const href = anchor.getAttribute('href');

      // Skip absolute URLs, root-relative paths, and fragments.
      if (/^([a-z]+:|\/|#)/i.test(href)) {
        continue;
      }

      if (href === '.' || href === '..' || href.endsWith('/')) {
        anchor.setAttribute('href', href.replace(/\/?$/, '/') + 'index.html');
      }
    }
  });
}
