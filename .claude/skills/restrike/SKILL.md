---
name: restrike
description: |
  Keep the model roster on the anvil site current when a vendor ships. Three
  cases: bump a model to its successor in place, add a new model or variant,
  and retire a model. The prompt is evidence, not a command: prose, one or
  more URLs, a pasted model switcher, or a screenshot. Each run derives the
  model, the vendor, and the action, then verifies the vendor doc page. It
  edits the forge page and the bookmarks page, sweeps for leftovers, stages
  the change, and lists the copies outside this repo.

  Do NOT fire when:
    - The change is to plans, ladders, or cost tables. Those are pricing
      edits.
    - The user wants the riff launchers, the vendor bash file, or the agy-ask
      skill edited. Those live outside this repo. Report them and stop.
    - The prompt has no vendor doc URL for an add or a bump. Ask for one.
    - The user wants a page redesign. This skill edits rows and links only.

  Example dispatches:
    - "/restrike looks like we have anvil updates <switcher> <news url>
      <docs url>" -> bump Gemini Flash from 3.7 to 3.8, effort from the
      switcher.
    - "/restrike openai shipped astra <docs url>" -> add an OpenAI row in
      both tables and a bookmark, then list the launcher as a follow-up.
    - "/restrike drop 3.7 flash, we are on 3.8 now" -> retire the rows and
      the bookmark, then sweep the CSS note and the riff example.
when_to_use:
    - new model on the forge page
    - bump the model on the anvil site
    - add a model row
    - retire a model
    - a vendor shipped a new version
    - looks like we have anvil updates
argument-hint: "<context, urls, pastes, refs>"
disable-model-invocation: true
user-invocable: true
allowed-tools:
    - Read
    - Grep
    - Glob
    - AskUserQuestion
    - WebFetch
    - Edit(/site/forge/balancing-the-anvil/index.html)
    - Edit(/site/forge/balancing-the-anvil/balancing-the-anvil.css)
    - Edit(/site/bookmarks/index.html)
    - Bash(curl:*)
    - Bash(git status:*)
    - Bash(git diff:*)
    - Bash(git add:*)
    - Bash(git log:*)
disallowed-tools:
    - Write
    - NotebookEdit
    - Agent
model: inherit
---

# restrike Claude Skill

A smith restrikes a piece to true it up. This skill restrikes the model
roster on the anvil site when a vendor ships a new model, a new version, or
retires an old one. It edits three files in this repo and nothing else. It
reports the copies that live elsewhere.

The user invokes this skill. It never fires on its own, because it edits
files and stages them. A typed `/restrike` is the go for those edits.

## Input

The prompt is context, not a command. It may hold prose, one or more URLs,
a pasted switcher, a screenshot, a doc excerpt, or a mix. Read all of it as
evidence, then derive three facts.

1. **The model.** The name as the vendor writes it, such as `Gemini 3.8
   Flash` or `GPT-5.7 Astra`. Take it from a doc page when one is present,
   else from the prose.
2. **The vendor.** Match the model to the vendor table. When the name
   matches no vendor, ask.
3. **The action.** One of bump, add, or retire.
   - Bump: the evidence names the new model as the successor of a row that
     already exists on the forge page. A shared family word alone, such as
     `Flash`, is not enough. A new variant such as `Flash Lite` is an add.
   - Add: no existing row is the predecessor.
   - Retire: the prompt says to remove, drop, or retire a model.
   When the evidence supports more than one reading, ask. Do not guess.

When the prompt names no model at all, ask which model shipped. Never invent
one.

## Sources

The prompt usually carries one or more URLs, plus a pasted switcher or a
screenshot at times. Do not expect any one kind. Take every URL, classify
it by host, and pull the facts each kind can give.

| Kind | How to recognize it | What it supplies |
| --- | --- | --- |
| Vendor doc page | Host matches a doc URL pattern in the vendor table | The slug, the model id, the Vendor Default effort, any deprecation note for the predecessor |
| Vendor blog or changelog | The vendor's own host, not a doc path | Whether the predecessor stays supported, and the release date |
| Third-party news | Any other host, such as a news thread | The signal that a model shipped. Skip the fetch |
| Pasted switcher or screenshot | Text or image in the prompt | The harness columns, and the Anvil Target effort the user runs |

Each field has one source. There is no precedence to resolve between kinds.

| Field | Source | Fallback |
| --- | --- | --- |
| Slug and doc href | Vendor doc page | None. Ask for the doc URL |
| Vendor Default | Vendor doc page | None. Ask when the page states no default |
| Anvil Target | Switcher or screenshot | The launcher line in bash_local, read only. Ask on an add with no switcher |
| Harness columns | Switcher or screenshot | The predecessor row on a bump. Ask on an add |
| Predecessor status | Vendor blog or changelog | Replace in place, the precedent on this site |

Rules:

1. An add or a bump needs a vendor doc URL in the prompt. When there is
   none, ask for one. Never derive a slug, never search for one, and never
   build a URL from the pattern alone.
2. A retire needs no doc page. The existing href on the forge page is the
   identity of the model.
3. When the switcher and the launcher line disagree on the Anvil Target,
   report both values and ask. The user decides which side moves.
4. Never add a blog, a changelog, or a news URL to the bookmarks page. That
   page holds doc pages only.
5. The final report carries an evidence table. The site pages carry no
   provenance text.

## Vendor table

Each vendor has fixed constants on both pages. Use these values. Do not
guess a new one.

| Vendor | Doc URL pattern | Rail | Group class | Group label | Bookmarks group | Primary column |
| --- | --- | --- | --- | --- | --- | --- |
| Anthropic | `https://platform.claude.com/docs/en/models/<slug>/overview` | `--rail-anthropic` | `g-anthropic` | `Anthropic / Claude` | `Claude Models` | Claude |
| OpenAI | `https://developers.openai.com/api/docs/models/<slug>` | `--rail-openai` | `g-openai` | `OpenAI / GPT` | `OpenAI Platform Docs` | Codex |
| Google | `https://ai.google.dev/gemini-api/docs/models/<slug>` | `--rail-google` | `g-google` | `Google / Gemini` | `Gemini API Docs` | Antigravity |

The pattern classifies a URL. It does not generate one. The slug comes from
the doc URL in the prompt. Junie is the secondary column for every vendor
unless the row says otherwise.

## Where a model lives in this repo

Every model name appears in these places. A run touches each one that
applies. These three files are the only files this skill edits.

1. **Forge harness table** in `site/forge/balancing-the-anvil/index.html`.
   One row per model. The row label is a link to the doc page. The primary
   cell carries a `marklabel` with the riff launcher name, such as
   `riff-gemini-flash`.
2. **Forge effort table** in the same file. One row per model with three
   cells: Vendor Default, Anvil Target, and Change. The Change cell is one of
   three marks, each with visually hidden text:
   - unchanged: `movemark eq` with `=`.
   - raised: `movemark up` with the entity `&#10138;`.
   - lowered: `movemark down` with the entity `&#10136;`.
3. **Bookmarks link** in `site/bookmarks/index.html`. One entry under the
   vendor's bookmarks group, titled `<Model Name> Model`, with the doc URL.
4. **Riff example code block** at the bottom of the forge page. It names three
   launchers, one per vendor. A retire can leave a stale name here.
5. **CSS min-width note** in `site/forge/balancing-the-anvil/balancing-the-anvil.css`.
   The comment above `.datatable.grid` names the widest `marklabel` and its
   character count. A new launcher name longer than the one named there, or a
   retire of that one, makes the note wrong. Update the comment, and recheck
   the pixel math in it.

## Two couplings outside this repo

State both to the user on every add and on every bump that changes effort.

- **The marklabel names a launcher.** A new harness row implies a new riff
  launcher in the user's bash_local. Ask for the launcher name during an add.
  Do not edit the launcher. List it as a follow-up.
- **Anvil Target mirrors the launcher.** The effort table's Anvil Target
  must equal the effort flag on the launcher line. On a bump, read the
  launcher line in the user's bash_local, read only, and compare. Report a
  mismatch. On an add there is no launcher line yet, so do not look for one.

## Procedure

1. Check the working tree. Run `git status --short` and `git diff` on the
   three target files. When a target file already has changes, stop and
   report them. Do not edit on top of unrelated work.
2. For an add or a bump, verify the doc page. Run `curl -sIL` against the
   doc URL from the prompt. Require a 200 status and no cross-host redirect.
   When the page is missing, stop and report. For a retire, skip this step.
3. For an add or a bump, fetch the Vendor Default with WebFetch. Anthropic
   calls it the default effort. OpenAI calls it the default reasoning effort.
   Google calls it the default thinking level. When the page states no
   default, ask. Do not infer one.
4. Decide the open values. Ask the user with one AskUserQuestion call when
   any of these is open. Batch the questions.
   - Bump: replace the predecessor row in place, or add a row and keep it.
   - Bump or add: the Anvil Target, when no switcher is in the prompt.
   - Add: the riff launcher name for the marklabel, and the harness columns.
   The interview ends the turn that carried the tool grants. The next edit
   may prompt for permission once. That is expected.
5. Edit the pages.
   - Bump: compare every field of the predecessor row against the new
     evidence. Change the name and the href in both forge rows and in the
     bookmarks entry. Change the Vendor Default, the Anvil Target, the Change
     mark, and its hidden text when the evidence moved them. Change the
     harness cells when the switcher moved them.
   - Add: copy the nearest sibling row in each table and the nearest
     bookmark entry, then set the name, the href, the marklabel, the harness
     cells, and the effort cells.
   - Retire: remove both forge rows and the bookmark entry. Then check the
     riff example block and the CSS note for the retired name.
6. Sweep the site for the old name and the old slug with Grep. A bump and a
   retire must leave zero hits under `site/`. An add sweeps for the new name
   and expects exactly the rows it wrote.
7. Sweep the follow-up paths below with Grep, read only. Report each file
   with one status: current, stale, or missing.
8. Run `git diff` and confirm the change is only the lines you meant. Stage
   the edited files with `git add`, by exact path. Then run
   `git diff --cached` and confirm the index holds only those lines.
9. Print the evidence table, the follow-up list, and the commit line. Do not
   run `git commit`.

## Evidence table

End every run with this table. Name the URL or the prompt element each value
came from.

| Field | Written value | Source |
| --- | --- | --- |
| Slug and href | | vendor doc URL |
| Vendor Default | | vendor doc URL |
| Anvil Target | | switcher, screenshot, or launcher line |
| Harness columns | | switcher, screenshot, or predecessor row |

## Commit convention

Match the repo's git log. The three verbs do not overlap.

- Bump and add: `Track <Model Name>`.
- Retire: `Retire <Model Name>`.

## Follow-ups outside this repo

These files also name models. The skill reads them for the sweep in step 7
and never edits them. Reads under the home directory can need a sandbox
grant. When a read is refused, report that and move on.

- `~/.bash_local`: the riff launchers and their comment table.
- `~/dev/urda/anvil/vendor/urda.bash/bash_local_adds.sh`: the source copy of
  the launchers. The live bash_local must match it from the function block
  down.
- `~/.claude/skills/agy-ask/SKILL.md`: the live model tier table.
- `~/dev/urda/anvil/claude/skills/agy-ask/SKILL.md`: the source copy of the
  agy-ask skill. The live copy must match it.

Keep this list current. When the prompt or a swept file names another copy
outside this repo, append that path here in the same change. When a listed
file no longer exists, remove it and say so.

## Refusal rules

- Never derive, search for, or invent a doc URL or a slug. Ask instead.
- Never edit a file outside the three named in this skill. Report and stop.
- Never run `git commit` or `git push`. The user commits.
- Never change plan, ladder, or cost content on the forge page.
- Never edit on top of an unrelated change in a target file.
- Annotation prose on the site states the fact. No metaphors, no punchlines.
