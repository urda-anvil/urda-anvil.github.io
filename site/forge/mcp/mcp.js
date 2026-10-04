/* Page data renderer. Shared navigation and presentation live in Anvil core. */
(() => {
  function chip(label, kind) {
    const element = document.createElement("span");
    element.className = "chip caps " + kind + "-chip " + label;
    element.textContent = label;
    return element;
  }

  // Count every documented tool and identify the usable subset.
  function toolCount(server) {
    const all = server.categories
      ? server.categories.flatMap((cat) => cat.tools)
      : server.tools;
    const usable = all.filter((t) => t.permission !== "deny").length;
    const label = all.length + (all.length === 1 ? " tool" : " tools");
    return usable === all.length ? label : label + ", " + usable + " usable";
  }

  // Build a `.kv` table (Tool / Type / Permission / Description) from a
  // tools array. Each tool carries its own type and permission.
  function buildToolTable(tools, caption) {
    const table = document.createElement("table");
    table.className = "kv";
    const captionElement = table.createCaption();
    captionElement.className = "visually-hidden";
    captionElement.textContent = caption;
    const thead = table.createTHead();
    thead.innerHTML =
      '<tr><th scope="col">Tool</th><th scope="col">Type</th>' +
      '<th scope="col">Permission</th><th scope="col">Description</th></tr>';
    const tbody = document.createElement("tbody");
    for (const tool of tools) {
      const tr = document.createElement("tr");

      const nameCell = document.createElement("td");
      const code = document.createElement("code");
      code.textContent = tool.name;
      nameCell.appendChild(code);
      tr.appendChild(nameCell);

      const typeCell = document.createElement("td");
      for (const t of tool.type.split(", ")) {
        typeCell.appendChild(chip(t, "type"));
      }
      tr.appendChild(typeCell);

      const permCell = document.createElement("td");
      permCell.appendChild(chip(tool.permission, "permission"));
      tr.appendChild(permCell);

      const descCell = document.createElement("td");
      descCell.textContent = tool.desc;
      tr.appendChild(descCell);

      tbody.appendChild(tr);
    }
    table.appendChild(tbody);
    return table;
  }

  // Overview: one nav card per server, anchor-linking to its section below.
  const cards = document.getElementById("server-cards");
  for (const server of SERVERS) {
    const card = document.createElement("a");
    card.className = "nav-card";
    card.href = "#" + server.id;

    const title = document.createElement("p");
    title.className = "card-title";
    title.textContent = server.name;
    const arrow = document.createElement("span");
    arrow.className = "arrow";
    arrow.setAttribute("aria-hidden", "true");
    arrow.textContent = "→";
    title.appendChild(arrow);
    card.appendChild(title);

    const desc = document.createElement("p");
    desc.className = "card-desc";
    desc.textContent = server.blurb;
    card.appendChild(desc);

    const meta = document.createElement("p");
    meta.className = "card-meta";
    meta.textContent = toolCount(server);
    card.appendChild(meta);

    cards.appendChild(card);
  }

  // Slugged fragment ids, same idiom the bookmarks page uses.
  function slug(text) {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }

  // Detail: one section per server, each with its prefix, reference, and tool table.
  // Ids sit on the headings rather than the sections so both the rail and
  // anvil-anchors.js have something to point at.
  const root = document.getElementById("server-detail");
  for (const server of SERVERS) {
    const sec = document.createElement("section");
    sec.className = "section server";

    const h2 = document.createElement("h2");
    h2.id = server.id;
    h2.textContent = server.name;
    sec.appendChild(h2);

    const meta = document.createElement("p");
    meta.className = "meta-row";
    const prefix = document.createElement("code");
    prefix.textContent = server.prefix;
    meta.appendChild(prefix);
    const ref = document.createElement("a");
    ref.href = server.ref.url;
    ref.target = "_blank";
    ref.rel = "noopener noreferrer";
    ref.textContent = server.ref.label + " ↗";
    meta.appendChild(ref);
    sec.appendChild(meta);

    if (server.desc) {
      const p = document.createElement("p");
      p.textContent = server.desc;
      sec.appendChild(p);
    }

    if (server.categories) {
      for (const cat of server.categories) {
        const h3 = document.createElement("h3");
        h3.id = server.id + "-" + slug(cat.heading);
        h3.textContent = cat.heading;
        sec.appendChild(h3);

        if (cat.note) {
          const note = document.createElement("p");
          note.textContent = cat.note;
          sec.appendChild(note);
        }

        sec.appendChild(
          buildToolTable(
            cat.tools,
            server.name + " " + cat.heading + " tools, with the type and permission each carries.",
          ),
        );
      }
    } else {
      sec.appendChild(
        buildToolTable(
          server.tools,
          server.name + " tools, with the type and permission each carries.",
        ),
      );
    }

    root.appendChild(sec);
  }
})();
