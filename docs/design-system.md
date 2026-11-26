# Anvil design system

This document describes the shared CSS and scripts under `site/res/`.
Read it before you change a page layout, a component, or a core script.
The [styleguide](https://anvil.urda.com/styleguide/) shows each component on one page.

## Core assets

Consumers can copy these assets without edits to their implementations.
Load only the optional scripts that a page needs.

| Asset under `site/res/` | Contract                                               |
| ----------------------- | ------------------------------------------------------ |
| `css/anvil-core.css`    | Shared tokens, layout, typography, and components      |
| `js/anvil-anchors.js`   | Permalinks for `main h2[id]` and `main h3[id]`         |
| `js/anvil-pagerail.js`  | Authored or automatic outlines, with scroll tracking   |
| `js/anvil-content.js`   | Lazy plain-text disclosure content                     |
| `js/prism.js`           | Vendored highlighting and copy controls                |
| `js/anvil-copy.js`      | Copy button for `pre.codeblock` on pages without Prism |
| `js/anvil-analytics.js` | Optional analytics for anvil.urda.com                  |

The core CSS does not fetch fonts, images, or other stylesheets.
The scripts use classic script tags, so they also work without a module server.
Load them with `defer`, after any page renderer that creates their target elements.

```html
<link rel="stylesheet" href="/res/css/anvil-core.css">
<script src="/res/js/prism.js" defer></script>
<script src="/res/js/anvil-anchors.js" defer></script>
<script src="/res/js/anvil-pagerail.js" defer></script>
```

These scripts initialize the current document once.
They do not observe later application mutations.

Copy core assets from the same reviewed commit.
Record that commit in the consumer repository's existing vendor documentation.
Sync a script together with the stylesheet when the script uses new classes, such as `anvil-content.js` and `.disclosure`.
Do not copy the site-specific catalog renderers or page riders as core assets.

## Ownership and cascade

Reusable presentation belongs in `anvil-core.css`.
Page stylesheets contain domain-specific accents, content widths, and exceptional spacing.

Catalog data stays in the Bookmarks and MCP HTML files.
Their adjacent scripts render the domain data, so those catalogs require JavaScript.
Core builds their outlines from the resulting headings.

Navigation and footer markup remain static and consistent across pages.
This preserves navigation without JavaScript and avoids a runtime template dependency.
Page titles, metadata, content, and relative paths remain page-owned.

Tokens live in the unlayered `:root` rule.
Components live in `@layer anvil`, after the reserved `vendor` layer.
A page rider remains unlayered and overrides normal core declarations.

Import third-party CSS into the vendor layer:

```css
@import url("vendor-lib.css") layer(vendor);
```

Defaults for links and section prose use `:where()`.
Their zero specificity lets a component class override them.
A default still wins over an inherited value and over a browser default.
A component must declare each property that it needs, such as a link underline or a text color.
Keep that constraint when you modify these defaults.

## Tokens and components

The `:root` rule is the canonical token list.
Component accents such as `--chip`, `--mk`, and `--rail` have local fallbacks or draw nothing when unset.
They are inputs to components, rather than global theme tokens.

The [styleguide](https://anvil.urda.com/styleguide/) demonstrates the shared components.
Give a scroll region an accessible label and `tabindex="0"` when needed.

## Page outlines

An authored `.pagerail` can contain ordinary fragment links.
`anvil-pagerail.js` tracks valid targets and maintains one current entry per rail.

For automatic entries, place the rail and `.railed` content inside `.withpagerail`:

```html
<div class="withpagerail">
  <nav class="pagerail" aria-label="On this page" data-pagerail="auto">
    <p class="pagerail-title">On this page</p>
    <ul><li><a class="totop" href="#top">Overview</a></li></ul>
  </nav>
  <div class="railed">
    <h2 id="details">Details</h2>
    <h3 id="example">Example</h3>
  </div>
</div>
```

Automatic rails preserve the authored top entry and derive other entries from `h2[id]` and `h3[id]`.
Each rail link requires an existing target on the page, such as `id="top"` for the top entry.
A child heading becomes an indented entry.
Permalink symbols and chips do not enter the labels.
A heading can supply `data-rail-label`, `data-rail-ruled`, or `data-rail-dotted`.
Dotted entries use the heading's inherited `--rail` accent.

## Code and disclosures

The vendored Prism 1.29.0 bundle includes JSON, Bash, and TOML grammars.
It includes Toolbar, Show Language, and Copy to Clipboard plugins.
The bundle header records its upstream sources and license attribution.
Core supplies the token theme and toolbar styles.

```html
<pre class="codeblock"><code class="language-json">{"enabled": true}</code></pre>
```

Use `language-none` for plain text.
Add `.compact` to place the toolbar beside a short code block.
Set `data-toolbar-order="copy-to-clipboard"` when no language label is needed.

Load `anvil-content.js` for a disclosure that fetches its source on first open:

```html
<details class="disclosure" data-src="raw/example.md">
  <summary>Show the document</summary>
  <pre class="codeblock" data-toolbar-order="copy-to-clipboard"><code>Open <a href="raw/example.md">the source file</a> if the document does not load.</code></pre>
</details>
```

A failed fetch retains the fallback link.

Keep Prism grammars and plugins at the same version when you update the bundle.
Add a styleguide sample for each new grammar.

## Analytics

The public Cloudflare beacon token lives in `anvil-analytics.js` and nowhere else.
A page that loads the script sends a beacon:

```html
<script src="res/js/anvil-analytics.js" defer></script>
```

Omit the script when analytics is unwanted.
The script skips `file://` pages and avoids duplicate beacon elements.
