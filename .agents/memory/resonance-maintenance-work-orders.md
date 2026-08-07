---
name: Resonance repository maintenance work orders
description: How to handle "integrate, do not create/rewrite" maintenance work orders on the Resonance docs repo, and an architect false-positive to expect.
---

# Repository maintenance work orders (integrate-only)

When a Work Order says integrate new canon into EXISTING docs and "do NOT rewrite / shorten / remove / duplicate," the safe pattern is **strictly additive**:

- When expanding an existing bullet list or section, keep every original bullet/sentence **verbatim** and append only the genuinely net-new items. Do NOT reword existing bullets into near-synonyms, even to tidy them — that reads as a rewrite/removal and fails review.
- Accept mild redundancy over rewriting. If a new required item is a near-synonym of an existing one (e.g. "off-duty presentation" vs an existing "civilian presentation"), prefer skipping the duplicate OR adding only the truly new concept, rather than replacing the old wording.
- **Why:** an architect review failed WO017 because the presentation-profile bullet list in docs/15_Canon_Rules.md had its existing bullets reworded/replaced rather than only appended to. Fix was to restore originals and add net-new bullets only.

**How to apply:** for any "expand this section" maintenance order, diff mentally against the original; every original token must survive.

# Architect includeGitDiff false positive: attached_assets pastes

`architect({includeGitDiff:true})` surfaces the whole working-tree diff, which includes untracked `attached_assets/Pasted-*.txt` files the user dropped in earlier sessions. The architect may flag one as a newly added "document" violating a no-new-docs rule.

- This is a **false positive** for the GitHub deliverable: pushes to this repo go through the Git Data API with an **explicit file list**, so `attached_assets/` is never committed to GitHub main (the source of truth). No action needed beyond confirming your push file list.
