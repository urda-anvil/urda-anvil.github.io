# anvil.urda.com - Website

[![Deploy Anvil Website](https://github.com/urda-anvil/urda-anvil.github.io/actions/workflows/deploy.yaml/badge.svg?branch=master)](https://github.com/urda-anvil/urda-anvil.github.io/actions/workflows/deploy.yaml)

## What this repo is

Urda Anvil is the collection of tools, settings, prompts, and software that
blend into one workbench for building better software with LLMs.

This repo is the source for the live [anvil.urda.com](https://anvil.urda.com) site. The
CSS is organized as a portable core design system plus optional page riders.
Core contains the shared tokens and generic components and can be consumed by
other repos; page-specific rules remain beside the page that owns them.

## Local development

Static HTML, no build step. Open `site/index.html` directly in a browser
(everything uses relative paths, so it also works straight off `file://`, with
no server needed). GitHub Pages serves `site/` verbatim on every push to
`master`.

Two caveats on `file://`: a directory-style link (like `balancing-the-anvil/`)
shows a file listing instead of auto-opening its `index.html`, and
`404.html` uses root-absolute paths, so it only renders correctly when
actually served.

## The CSS model

Every page loads `site/res/css/anvil-core.css`, the one shared design
system. Tokens and every primitive used across the site's pages live here.

A page that genuinely diverges ships a small "rider" stylesheet next to its
own `index.html` (e.g. `site/balancing-the-anvil/balancing-the-anvil.css`),
loaded after core. It adds only page-specific variants and narrowly scoped
overrides without duplicating core primitives. A rule graduates from rider to
core only when a second page needs it.

`anvil-core.css` wraps everything below its tokens in a named CSS layer
(`@layer anvil`), and a page's rider is deliberately left unlayered. Per the
cascade layers spec, unlayered CSS always beats layered CSS, so a rider
keeps winning on any shared class regardless of load order or specificity -
the same "page sheet wins" behavior as before, just guaranteed rather than
incidental. See "Importing third-party CSS" below for why the layer exists.

## Design tokens

The shared vocabulary, defined once in `:root` in `anvil-core.css`:

- Surfaces: `--bg`, `--panel`, `--panel-bar`, `--screen`, `--border`
- Text: `--ink`, `--muted`
- Forge accent: `--ember`
- Shape: `--radius`
- Status line palette: `--sl-green`, `--sl-yellow`, `--sl-red`, `--sl-cyan`,
  `--sl-blue`, `--sl-gray`, `--sl-white`
- Type: `--mono`, `--sans`

`:root` in `anvil-core.css` is the canonical list; if a token isn't declared
there, it isn't part of the system.

## Primitives

Top nav, hero + tagline, `.page-head`, `.btn`, `.hint` callout, nav cards,
`.section`, the `.kv` reference table, `.codeblock`, `.chip`, `.datatable`
and its status marks/legend, and the footer all live in `anvil-core.css`. A
styleguide page renders every one of them once and is the live catalog and
visual regression check: if a change to core still looks right there, the
contract holds. It lives at `site/styleguide/` and serves, unlinked, at
`/styleguide/`.

One idiom worth calling out: `.chip` takes a single `--chip` accent custom
property and derives its text color, fill, and ring from it via `color-mix`.
Set `--chip` (as a class or inline style) rather than styling a chip variant
directly.

## Code highlighting

`.codeblock` content is highlighted by `site/res/js/prism.js`, a vendored,
locally-hosted build of [Prism](https://prismjs.com) (MIT license). It ships
no bundled theme; the colors come from `anvil-core.css`, which maps Prism's
token classes (`.token.property`, `.token.string`, `.token.keyword`, and so
on) to the design tokens above. That mapping is keyed to token type, not to
any one language, so every grammar the bundle carries is already styled.

Tag highlighted code `<code class="language-xxx">` and load the script from
the relative path appropriate to the page: `res/js/prism.js` from
`site/index.html`, or `../res/js/prism.js` from a page one directory below
`site/`. With JS disabled, the block still renders as plain monospace, same as
before Prism runs.

Currently supported: `json`, `bash` (aliases: `sh`, `shell`) - `site/balancing-the-anvil/`
uses the latter for its example. To add another language, append the
same-version `prism-<lang>.min.js` component (from
`unpkg.com/prismjs@<version>/components/`) to `site/res/js/prism.js` and add
a `<code class="language-<lang>">` block to try it. No CSS changes are
needed since the theme is language-agnostic.

## Importing third-party CSS

If a page ever needs an external stylesheet or a vendored library, import it
into the `vendor` layer so it can never win a specificity fight against core:

```html
<style>@import url("vendor-lib.css") layer(vendor);</style>
```

`anvil-core.css` declares `@layer vendor, anvil;` up front and puts its own
rules in `anvil`, a layer declared after `vendor` - so `anvil` always wins
over anything loaded into `vendor`, and a page rider (unlayered) wins over
both. No specificity tuning or `!important` needed either way.

## If another org subsite wants to match

Everything here is one repo for one site; there's no copy-and-sync ritual to
maintain. If another `urda-anvil` org project ever wants its own pages to
look like this one, the simplest path is to link the deployed stylesheet
directly:

```html
<link rel="stylesheet" href="https://anvil.urda.com/res/css/anvil-core.css">
```

That always reflects whatever is live on `anvil.urda.com`, with nothing to
re-copy or fall out of sync.
