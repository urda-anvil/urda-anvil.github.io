# anvil.urda.com

[![Deploy Anvil Website](https://github.com/urda-anvil/urda-anvil.github.io/actions/workflows/deploy.yaml/badge.svg?branch=master)](https://github.com/urda-anvil/urda-anvil.github.io/actions/workflows/deploy.yaml)

Urda Anvil collects tools, settings, rules, and software for work with LLMs.
This repository serves the site and owns the portable Anvil core assets.

## Local development

Run `make serve` and open `http://localhost:8000/`.
Set another port with `make serve SERVE_PORT=8001`.
The site uses static HTML without a build step.
GitHub Pages publishes `site/` on a push to `master`.

Pages use root-relative paths, so they require HTTP and do not open through `file://`.

## Design system

The shared CSS and scripts live in `site/res/`.
[docs/design-system.md](docs/design-system.md) describes them.
The [styleguide](https://anvil.urda.com/styleguide/) shows each component on one page.

## Copy

These rules keep a page readable for someone who has not seen the anvil before.

- The first sentence of a page says what the page lists. Voice comes after.
- The anvil metaphor lives in titles and the footer quote, not in a lede or a meta description. A lede may explain the page title.
- A note never restates a value the reader can already see beside it.

## Verification

This repository currently defines no formatter, linter, or automated test target.
The deployment workflow uploads the site and does not validate it.
Before a consumer sync, check JavaScript syntax, CSS parsing, assets, fragments,
content preservation, and the optional scripts' behavior.
Inspect the styleguide and real pages at desktop and narrow widths when browser review is available.
DOM tests cannot verify layout, color perception, keyboard behavior in a real browser, or clipboard permissions.
