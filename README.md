# anvil.urda.com

[![Deploy Anvil Website](https://github.com/urda-anvil/urda-anvil.github.io/actions/workflows/deploy.yaml/badge.svg?branch=master)](https://github.com/urda-anvil/urda-anvil.github.io/actions/workflows/deploy.yaml)

Urda Anvil collects tools, settings, prompts, and software for work with LLMs.
This repository serves the site and owns the portable Anvil core assets.

## Local development

Run `make serve` and open `http://localhost:8000/`.
Set another port with `make serve SERVE_PORT=8001`.
The site uses static HTML without a build step.
GitHub Pages publishes `site/` on a push to `master`.

Most pages also work through `file://`.
`anvil-local.js` rewrites relative directory links to their `index.html` files.
It preserves query strings and fragments.
The 404 page requires HTTP because its assets use root-relative paths.
Raw document disclosures require HTTP fetch support and retain direct file links as a fallback.

## Core assets

Consumers can copy these assets without edits to their implementations.
Load only the optional scripts that a page needs.

| Asset under `site/res/` | Contract |
| --- | --- |
| `css/anvil-core.css` | Shared tokens, layout, typography, and components |
| `js/anvil-anchors.js` | Permalinks for `main h2[id]` and `main h3[id]` |
| `js/anvil-local.js` | Relative directory links under `file://` |
| `js/anvil-pagerail.js` | Authored or automatic outlines, with scroll tracking |
| `js/anvil-content.js` | Lazy plain-text disclosure content |
| `js/prism.js` | Vendored highlighting and copy controls |
| `js/anvil-analytics.js` | Optional analytics with an explicit public token |

The core CSS does not fetch fonts, images, or other stylesheets.
Pages select their own image assets, metadata, navigation destinations, and analytics token.
The scripts use classic script tags, so they also work without a module server.
Load them with `defer`, after any page renderer that creates their target elements.

```html
<link rel="stylesheet" href="res/css/anvil-core.css">
<script src="res/js/prism.js" defer></script>
<script src="res/js/anvil-local.js" defer></script>
<script src="res/js/anvil-anchors.js" defer></script>
<script src="res/js/anvil-pagerail.js" defer></script>
```

Use paths relative to the page depth.
These scripts initialize the current document once.
They do not observe later application mutations.
Run a page renderer before them when it creates headings or outline content.

## Ownership and cascade

Reusable presentation belongs in `anvil-core.css`.
Page stylesheets contain domain-specific accents, content widths, and exceptional spacing.
The bookmarks page needs no separate stylesheet.
The MCP rider only maps tool types and permissions to chip colors.
The Rules rider defines its catalog columns, load semantics, and page spacing.
The balancing page retains its pricing and model table layouts.
The styleguide rider contains demonstration furniture.

Catalog data stays in the Bookmarks and MCP HTML files.
Their adjacent scripts render the domain data.
Core builds their outlines from the resulting headings.
The pages no longer maintain separate outline data or builders.

Navigation and footer markup remain static and consistent across pages.
This preserves navigation without JavaScript and avoids a runtime template dependency.
Page titles, metadata, content, and relative paths remain page-owned.

Tokens live in the unlayered `:root` rule.
Components live in `@layer anvil`, after the reserved `vendor` layer.
A page rider remains unlayered and overrides normal core declarations.
This precedence does not describe declarations that use `!important`.

Import third-party CSS into the vendor layer:

```css
@import url("vendor-lib.css") layer(vendor);
```

Defaults for links and section prose use `:where()`.
Their zero specificity lets component classes control their own appearance.
Keep that constraint when you modify these defaults.

## Tokens and components

The `:root` rule is the canonical token list.
It includes surfaces, text, the ember accent, status colors, vendor accents,
font stacks, the corner radius, and `--pagerail-top` in pixels.
Component accents such as `--chip`, `--mk`, and `--rail` have local fallbacks.
They are inputs to components, rather than global theme tokens.

The [styleguide](site/styleguide/index.html) demonstrates the shared components.
It includes navigation, cards, tables, tabs, code, disclosures, bookmark groups,
metadata, chips, outlines, and footer elements.
It supports visual inspection but does not prove compatibility by itself.

Common component contracts:

- `.chip` derives its text, border, and fill from `--chip`.
  `.caps` adds uppercase chip typography.
- `.g-anthropic`, `.g-openai`, `.g-google`, and `.g-jetbrains` supply vendor accents.
  `.vendor-label` uses the inherited accent for text.
- Table rows inherit `--mk` for their marks and borders.
  A `.rowlabel` contains a decorative `.rail` span.
  Existing inline rail backgrounds remain supported.
- `.meta-row`, `.card-meta`, and `.code-label` provide shared metadata styles.
- `.table-scroll` supplies plain horizontal overflow.
  `.datatable-wrap` adds the data table frame.
  Give a scroll region an accessible label and `tabindex="0"` when needed.
- `.bookmark-groups` contains `.bm-vendor` headings and `.bm-group` sections.
  Each `.bm-row` link contains `.bm-name`, `.bm-leader`, and `.bm-url` spans.

## Page outlines

An authored `.pagerail` can contain ordinary fragment links.
`anvil-pagerail.js` tracks valid targets and maintains one current entry per rail.
It supports multiple rails and fragment navigation.

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
The top entry requires an existing `id="top"` target elsewhere on the page.
A child heading becomes an indented entry.
Permalink symbols and chips do not enter the labels.
A heading can supply `data-rail-label`, `data-rail-ruled`, or `data-rail-dotted`.
Dotted entries use the heading's inherited `--rail` accent.
Without JavaScript, the headings and authored links remain usable.

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
Standard blocks reserve space above their text for the toolbar.
Set `data-toolbar-order="copy-to-clipboard"` when no language label is needed.
Prism's `data-prismjs-copy` attributes customize the copy messages.
Use `data-prismjs-copy-error="Copy manually"` on the body for a neutral fallback label.
The plugin selects the code if both clipboard methods fail.
Without JavaScript, code remains readable.

Load `anvil-content.js` for a disclosure that fetches its source on first open:

```html
<details class="disclosure" data-src="raw/example.md">
  <summary>Show the document</summary>
  <pre class="codeblock" data-toolbar-order="copy-to-clipboard"><code>Open <a href="raw/example.md">the source file</a> if the document does not load.</code></pre>
</details>
```

The loader preserves the source text and line breaks.
It treats text as text, rather than HTML, and tints lines that start with `#`.
It attaches the optional Prism toolbar after a successful fetch.
A failed fetch retains the fallback link.
Closing and reopening the disclosure retries the fetch.

Keep Prism grammars and plugins at the same version when you update the bundle.
Add a styleguide sample for each new grammar.

## Analytics

Analytics is optional and has no default token.
Each site must supply its own public Cloudflare beacon token:

```html
<script src="res/js/anvil-analytics.js" data-token="YOUR_PUBLIC_TOKEN" defer></script>
```

Omit the script when analytics is unwanted.
The adapter skips `file://` pages and avoids duplicate beacon elements.
The Anvil pages explicitly retain their existing token.

## Consumer migration

Copy core assets from the same reviewed commit.
Record that commit in the consumer repository's existing vendor documentation.
Do not mix a new stylesheet with an older optional script during a sync.
A direct link to the deployed stylesheet remains possible, but it changes whenever this site deploys.
A copied revision gives consumers a controlled update point.

This revision changes these contracts:

- Analytics requires `data-token`. A consumer without it sends no beacon.
- Generic links in `.wrap` receive the core link style, including table and list links.
- Standard Prism blocks reserve toolbar space above the code.
- Generic section headings use low-specificity defaults, so component headings retain their own styles.
- Vendor classes supply shared accents. Existing inline accent declarations still work.
- The new disclosure module requires its script and the `.disclosure` class.

Consumers can retain authored rails, existing asset paths, and existing component markup.
They can adopt the new components when their page riders duplicate those styles.
Do not copy the site-specific catalog renderers or page riders as core assets.

## Audit findings

The existing Google accent, `#008300`, has 3.67:1 contrast against the panel color, `#11161f`.
Small text uses this accent in vendor labels and group headings.
The palette remains unchanged, but these uses need a text-contrast review.

Bookmarks and the MCP catalog still require JavaScript to render their data.
Their navigation and footer remain static.
Supporting those catalogs without JavaScript would require authored HTML or a generation step.

## Verification

This repository currently defines no formatter, linter, or automated test target.
The deployment workflow uploads the site and does not validate it.
Before a consumer sync, check JavaScript syntax, CSS parsing, assets, fragments,
content preservation, and the optional scripts' behavior.
Inspect the styleguide and real pages at desktop and narrow widths when browser review is available.
DOM tests cannot verify layout, color perception, keyboard behavior in a real browser, or clipboard permissions.
