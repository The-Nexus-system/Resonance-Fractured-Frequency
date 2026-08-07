---
name: Resonance canon rule promotion
description: How to handle explicit CANON RULE blocks that appear inside chapter Work Orders.
---

# Promoting Work Order CANON RULE blocks to global canon

When a chapter Work Order contains an explicitly-labeled CANON RULE (or "## Canon Rule") block, promote it to the master list at `docs/15_Canon_Rules.md` as a `## ` rule, and also restate it inside the chapter doc under a distinct `### ` heading (chapter restatements are explanatory, not a second source of truth — the master doc governs wording).

**But first check for an existing equivalent rule.** If the new rule duplicates or heavily overlaps an existing one, do NOT add a second competing rule — merge the new wording/list into the existing rule instead. Example: Work Order 006's "Knowledge must always produce action" duplicated the existing "Knowledge Must Always Change Something" (both ended "If knowledge changes nothing, it should not exist."); they were merged into the single existing rule (expanded to say "Knowledge must always produce action" and to carry the union of both lists).

Merging can mean BROADENING an existing narrower rule and renaming its heading, when the new rule is a superset. Example: the dictated "Everything Has an Acoustic Identity" rule (every object/creature/environment/vehicle/tool/clothing/building/technology has one; silence too; closed-eyes principle; audio never decorative) subsumed the old "## Every Location Has an Acoustic Identity" — so that heading was renamed to "## Everything Has an Acoustic Identity" and the two original location sentences kept inside as a specific application. When broadening near a sibling rule (here "## Silence Is a Deliberate Storytelling Tool"), reference it, don't duplicate or fold it in. If you rename a `## ` rule heading, grep the repo for the old heading text (usually only self-referenced in docs/15) before renaming.

**Why:** the project spine is single-source-of-truth with NO competing files/rules. Two near-identical rules cause interpretive drift. The architect flags this; catch it before it ships.

**How to apply:** before adding a `## ` rule, grep `docs/15_Canon_Rules.md` for the rule's key nouns/closing line. If a match exists, merge; otherwise add. Record the promotion (or reconciliation) in `docs/11_Decision_Log.md`.
