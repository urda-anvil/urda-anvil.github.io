/* Page data renderer. Shared navigation and presentation live in Anvil core. */
(() => {
  // Per-group rail accent, drawn from the shared forge palette in anvil-core.css.
  // Known groups are mapped intentionally; a new group gets a stable palette
  // pick so its rail is still colored without a config change.
  const GROUP_ACCENTS = {
    "Claude": "var(--sl-blue)",
    "Claude Code": "var(--sl-green)",
    "Claude Code - Docs": "var(--sl-cyan)",
    "Claude Models": "var(--sl-red)",
    "Claude Platform Docs": "var(--sl-yellow)",
  };
  const ACCENT_PALETTE = [
    "var(--sl-blue)", "var(--sl-green)", "var(--sl-cyan)",
    "var(--sl-yellow)", "var(--sl-red)", "var(--ember)",
  ];
  function groupAccent(group) {
    if (GROUP_ACCENTS[group]) return GROUP_ACCENTS[group];
    let hash = 0;
    for (let i = 0; i < group.length; i++) hash = (hash * 31 + group.charCodeAt(i)) >>> 0;
    return ACCENT_PALETTE[hash % ACCENT_PALETTE.length];
  }

  // Fragment id for a vendor or group heading, shared by the headings and the
  // page rail so the two can never disagree.
  function slug(text) {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }

  // Render a labeled divider per vendor, then one rail-accented section per
  // group: colored left rail + uppercase header, then compact rows of
  // name / dotted leader / shortened URL. Static.
  const root = document.getElementById("bookmarks");

  VENDORS.forEach((vendorBlock) => {
    const vendorHeading = document.createElement("h2");
    // Vendor colors are brand identity, so they come from the shared .g-*
    // classes in anvil-core.css, the same ones forge/balancing-the-anvil/
    // uses. A vendor without a class falls back to ember.
    vendorHeading.className = "bm-vendor g-" + slug(vendorBlock.vendor);
    // Stable fragment id so anvil-anchors.js can hang a permalink on it.
    vendorHeading.id = slug(vendorBlock.vendor);
    vendorHeading.textContent = vendorBlock.vendor;
    root.appendChild(vendorHeading);

    for (const section of vendorBlock.groups) {
      const group = document.createElement("section");
      group.className = "bm-group";
      group.style.setProperty("--rail", groupAccent(section.group));

      const title = document.createElement("h3");
      title.className = "bm-group-title";
      // Stable fragment id so anvil-anchors.js can hang a permalink on it.
      title.id = slug(section.group);
      title.textContent = section.group;
      title.dataset.railDotted = "";
      title.style.setProperty("--rail", groupAccent(section.group));
      group.appendChild(title);

      const list = document.createElement("ul");
      list.className = "bm-list";

      for (const link of section.links) {
        const li = document.createElement("li");

        // The row itself is the anchor, so the name, the leader, and the
        // visible URL are all one click target rather than the name alone.
        const row = document.createElement("a");
        row.className = "bm-row";
        row.href = link.url;
        row.target = "_blank";          // always open bookmarks in a new tab
        row.rel = "noopener noreferrer";

        const name = document.createElement("span");
        name.className = "bm-name";
        name.textContent = link.title;
        row.appendChild(name);

        const leader = document.createElement("span");
        leader.className = "bm-leader";
        leader.setAttribute("aria-hidden", "true");
        row.appendChild(leader);

        const url = document.createElement("span");
        url.className = "bm-url";
        url.textContent = link.url.replace(/^https?:\/\//, "");
        url.title = link.url;           // the displayed URL is shortened and can ellipsis
        row.appendChild(url);

        li.appendChild(row);
        list.appendChild(li);
      }

      group.appendChild(list);
      root.appendChild(group);
    }
  });
})();
