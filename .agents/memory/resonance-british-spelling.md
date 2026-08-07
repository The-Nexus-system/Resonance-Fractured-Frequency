---
name: Resonance British English house spelling
description: British English is the house spelling standard for the whole repo; how to convert safely without breaking code terms or the size/prize family.
---

# British English is the Resonance house spelling standard

All documentation in the Resonance repo uses British English spelling (colour, behaviour, organise, recognise, analyse, centre, fibre, catalogue, defence, artefact, jewellery, aluminium, localisation, fulfil, and the -ise/-isation verb families). Write new docs in British English from the outset.

**Why:** The creator adopted British spelling as a project-wide standard and had the entire existing corpus converted. Recorded in the Decision Log ("British English adopted as the house spelling standard").

**How to apply / conversion pitfalls:**
- Code identifiers, file paths, and the reserved `artifacts/` directory name stay unchanged (they live in inline-code spans / are real paths). Skip fenced and inline code when converting.
- There is NO clean rule for `-ize -> -ise`: most convert (synthesize->synthesise, canonization->canonisation, localizable->localisable), but the "size/prize/seize" family must NOT (size, resize, downsize, capsize, prize, seize, maize, baize). "synthesize" literally ends in the letters "size", so a suffix test fails — use a FULL-WORD exclusion set, not `endswith("size")`.
- `.local/convert_spelling.py` does this: curated case-preserving word-list (skips code) + generic `-ize/-yze -> -ise/-yse` backstop with a full-word `IZE_KEEP` set. It is idempotent/re-runnable.
- Verify with a residual grep for `-ize/-yze` outside the keep-set, and a broad American-marker grep (the only legitimate remaining "artifact*" hits are the `artifacts/` path).
