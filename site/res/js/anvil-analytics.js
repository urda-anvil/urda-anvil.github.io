/*
 * Optional Cloudflare Web Analytics adapter. Each site supplies its public
 * beacon token through data-token on this script element. No token means
 * no beacon. This module does not contain Anvil's site configuration.
 */
(() => {
  const token = document.currentScript?.dataset.token;
  if (!token || !['http:', 'https:'].includes(location.protocol)) return;
  if (document.querySelector('script[data-cf-beacon]')) return;

  const beacon = document.createElement('script');
  beacon.type = 'module';
  beacon.src = 'https://static.cloudflareinsights.com/beacon.min.js';
  beacon.setAttribute('data-cf-beacon', JSON.stringify({ token }));
  document.head.appendChild(beacon);
})();
