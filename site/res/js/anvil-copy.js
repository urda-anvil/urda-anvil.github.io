/*
 * anvil-copy.js
 *
 * Adds a "Copy" button to every pre.codeblock that Prism did not already
 * wrap. The button reuses the Prism toolbar markup and class names, so the
 * core .code-toolbar styles in anvil-core.css apply with no CSS change.
 * Pages that load prism.js keep the Prism button; this script skips them.
 */
(() => {
  const LABELS = {
    'copy': 'Copy',
    'copy-success': 'Copied!',
    'copy-error': 'Press Ctrl+C to copy',
  };
  const RESET_MS = 5000;

  // A visually hidden live region. Screen readers announce whatever text
  // lands in it, so every click gets a spoken result, not just a color.
  let status = null;

  function createStatusRegion() {
    status = document.createElement('div');
    status.className = 'visually-hidden';
    status.setAttribute('role', 'status');
    document.body.appendChild(status);
  }

  function announce(message) {
    // Clear first, then refill on the next tick. A live region only speaks
    // when its content changes, so a repeated message would stay silent.
    status.textContent = '';
    setTimeout(() => { status.textContent = message; }, 50);
  }

  function setState(button, state) {
    button.firstChild.textContent = LABELS[state];
    button.setAttribute('data-copy-state', state);
  }

  function selectText(node) {
    const range = document.createRange();
    range.selectNodeContents(node);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  }

  function attach(pre) {
    const wrapper = document.createElement('div');
    wrapper.className = 'code-toolbar';
    pre.parentNode.insertBefore(wrapper, pre);
    wrapper.appendChild(pre);

    const toolbar = document.createElement('div');
    toolbar.className = 'toolbar';
    const item = document.createElement('div');
    item.className = 'toolbar-item';
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'copy-to-clipboard-button';
    button.appendChild(document.createElement('span'));
    setState(button, 'copy');

    item.appendChild(button);
    toolbar.appendChild(item);
    wrapper.appendChild(toolbar);

    let timer = null;
    button.addEventListener('click', () => {
      const text = pre.textContent;
      const done = (state) => {
        setState(button, state);
        announce(state === 'copy-success' ? 'Copied to clipboard' : 'Copy failed');
        if (state === 'copy-error') selectText(pre);
        clearTimeout(timer);
        timer = setTimeout(() => setState(button, 'copy'), RESET_MS);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(
          () => done('copy-success'),
          () => done('copy-error'),
        );
      } else {
        done('copy-error');
      }
    });
  }

  function init() {
    createStatusRegion();
    for (const pre of document.querySelectorAll('pre.codeblock')) {
      if (pre.parentElement.classList.contains('code-toolbar')) continue;
      attach(pre);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
