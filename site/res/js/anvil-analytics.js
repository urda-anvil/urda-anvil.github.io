/*
 * Cloudflare Web Analytics beacon. anvil.urda.com is unproxied GitHub Pages,
 * so Cloudflare can't auto-inject it; this is the manual route, wrapped here
 * instead of pasted into every page so the token lives in one place.
 */
(() => {
  const token = '51b0135ed50e469ea4c6a24182db6efc';
  if (!['http:', 'https:'].includes(location.protocol)) return;
  if (document.querySelector('script[data-cf-beacon]')) return;

  const beacon = document.createElement('script');
  beacon.type = 'module';
  beacon.src = 'https://static.cloudflareinsights.com/beacon.min.js';
  beacon.setAttribute('data-cf-beacon', JSON.stringify({ token }));
  document.head.appendChild(beacon);
})();
