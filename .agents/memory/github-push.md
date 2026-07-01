---
name: GitHub push method for The-Nexus-system/Resonance-Fractured-Frequency
description: How this project is pushed to GitHub and why GitHub's repo "size" can lag.
---

# Pushing this project to GitHub

The Replit workspace's only git remote is the internal `gitsafe` backup, NOT GitHub. To publish to `The-Nexus-system/Resonance-Fractured-Frequency` we do NOT use the Replit git panel or `git push`.

Instead, push via the GitHub Git Data API from the code_execution sandbox:
1. `listConnections('github')[0].settings.access_token` for the token (raw `fetch`; the `@replit/connectors-sdk` import fails).
2. File list respecting `.gitignore`: `git ls-files -c -o --exclude-standard`.
3. GET the `main` ref for the parent SHA, POST a tree (inline `content` for all text files — the project is all text, largest is pnpm-lock.yaml ~211KB), POST a commit with that parent, PATCH `refs/heads/main`.

**Why:** direct `git commit`/`git push` are restricted in the sandbox, and the GitHub repo isn't a configured remote. The API path is self-contained and verifiable.

**Gotcha:** creating the tree WITHOUT `base_tree` makes the commit contain exactly the listed files — any file not in the list (e.g. a pre-existing root README) gets dropped. Include everything you want to keep.

**size=0 confusion:** After an API push, GitHub's repo `size` metadata field can stay `0` for a long time (background job lag), and cached branch reads may look empty. This does NOT mean the push failed. Verify with the branches/refs/commits/contents endpoints (with `Cache-Control: no-cache`) — those reflect reality immediately.
