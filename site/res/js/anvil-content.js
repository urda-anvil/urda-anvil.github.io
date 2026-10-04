/*
 * Lazy plain-text disclosures. A details[data-src] contains a .codeblock
 * with a fallback link. Fetch only when opened; retain that link on failure.
 * Text stays literal, including line breaks. Prism's toolbar is optional.
 */
(() => {
  function init() {
    for (const details of document.querySelectorAll('details[data-src]')) {
      const code = details.querySelector('.codeblock code');
      if (!code || details.dataset.contentReady) continue;
      details.dataset.contentReady = 'true';
      let loading = false;

      async function loadContent() {
        if (!details.open || details.dataset.loaded || loading) return;
        loading = true;
        details.setAttribute('aria-busy', 'true');
        try {
          const response = await fetch(details.dataset.src);
          if (!response.ok) throw new Error(response.status);
          const text = await response.text();
          const fragment = document.createDocumentFragment();
          const lines = text.split('\n');
          for (const [index, line] of lines.entries()) {
            if (line.startsWith('#')) {
              const heading = document.createElement('span');
              heading.className = 'md-heading';
              heading.textContent = line;
              fragment.append(heading);
            } else {
              fragment.append(line);
            }
            if (index < lines.length - 1) fragment.append('\n');
          }
          code.replaceChildren(fragment);
          details.dataset.loaded = 'true';
          if (window.Prism?.plugins?.toolbar) {
            window.Prism.plugins.toolbar.hook({ element: code, language: 'none' });
          }
        } catch {
          // The fallback remains usable. Closing and reopening retries a failed fetch.
        } finally {
          loading = false;
          details.removeAttribute('aria-busy');
        }
      }

      details.addEventListener('toggle', loadContent);
      loadContent();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
