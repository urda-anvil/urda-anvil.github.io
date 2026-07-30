/*
 * anvil-analytics.js
 *
 * Cloudflare Web Analytics beacon. anvil.urda.com is unproxied GitHub Pages,
 * so Cloudflare can't auto-inject it; this is the manual route, wrapped here
 * instead of pasted into every page so the token lives in one place per repo.
 *
 * Shared asset: authored in urda-anvil.github.io, copied downstream unmodified.
 */
const beacon = document.createElement('script');

beacon.type = 'module';
beacon.src = 'https://static.cloudflareinsights.com/beacon.min.js';
beacon.setAttribute('data-cf-beacon', '{"token": "51b0135ed50e469ea4c6a24182db6efc"}');

document.head.appendChild(beacon);
