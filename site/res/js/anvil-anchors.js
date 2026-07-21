/*
 * anvil-anchors.js
 *
 * Any h2/h3 that already carries an id gets a small "#" permalink appended,
 * revealed on hover/focus (styled in anvil-core.css). The id itself is
 * static markup, so #fragment links keep working even if this script fails
 * to load; this just adds the visible, clickable affordance.
 */
document.addEventListener('DOMContentLoaded', () => {
  for (const heading of document.querySelectorAll('main h2[id], main h3[id]')) {
    const link = document.createElement('a');
    link.className = 'heading-anchor';
    link.href = '#' + heading.id;
    link.textContent = '#';
    link.setAttribute('aria-label', 'Link to this section');
    heading.append(link);
  }
});
