# Psychotherapy Project Dossier Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace Psychotherapy's placeholder presentation with confirmed bilingual content, a real code screenshot, and a playable-build screenshot below the archive abstract.

**Architecture:** Extend the existing `ProjectMedia` model with one optional detail image and render it only when present. Keep project copy in the canonical JSON and README, while the asset-preparation script continues copying all preview WebP files into the static output.

**Tech Stack:** Astro 5, TypeScript, CSS, Vitest, Playwright, Python unittest, cwebp

## Global Constraints

- Only Psychotherapy content, media, and the shared optional detail-image path may change.
- Do not infer team size or add subjective claims.
- Preserve both supplied screenshots pixel-for-pixel through lossless WebP conversion.
- Keep the existing GitHub Pages base path `/portfolio-content/`.

---

### Task 1: Protect the Psychotherapy presentation contract

**Files:**
- Modify: `tests/unit/content.test.ts`
- Modify: `tests/e2e/projects.spec.ts`
- Modify: `tests/test_asset_hygiene.py`

**Interfaces:**
- Consumes: `getProjectMedia(projectId: string): ProjectMedia`
- Produces: failing tests for localized content, the primary image, the detail image, and both asset files

- [ ] **Step 1: Add a unit test for the localized content and media mapping**

Assert that the English localized project title is `Psychotherapy`, that the summary mentions four personalities, and that `getProjectMedia('psychotherapy')` returns the expected primary and detail image paths.

- [ ] **Step 2: Add an end-to-end test for the public dossier**

Open the Chinese route and assert the approved summary is visible, the hero uses `psychotherapy-code.webp`, the archive evidence uses `psychotherapy-gameplay.webp`, and no concept visual appears.

- [ ] **Step 3: Add both WebP files to asset-hygiene expectations**

Add `assets/previews/psychotherapy-code.webp` and `assets/previews/psychotherapy-gameplay.webp` to the existing expected asset list.

- [ ] **Step 4: Run the focused tests and verify RED**

Run: `npm test -- tests/unit/content.test.ts && python3 -m unittest tests.test_asset_hygiene -v`

Expected: FAIL because the Psychotherapy media mapping and files do not exist.

### Task 2: Add confirmed content and media rendering

**Files:**
- Modify: `content/projects/psychotherapy.json`
- Modify: `content/external-links.json`
- Modify: `projects/psychotherapy/README.md`
- Modify: `src/lib/content/types.ts`
- Modify: `src/lib/content/media.ts`
- Modify: `src/components/ProjectDossier.astro`
- Modify: `src/styles/project.css`
- Create: `assets/previews/psychotherapy-code.webp`
- Create: `assets/previews/psychotherapy-gameplay.webp`

**Interfaces:**
- Produces: `ProjectMedia.detail?: { src: string; alt: LocalizedText }`
- Consumes: `media.detail` in `ProjectDossier.astro`

- [ ] **Step 1: Convert both supplied PNG files with lossless WebP encoding**

Use `cwebp -lossless -m 6` and verify decoded pixel data matches each source.

- [ ] **Step 2: Update canonical bilingual content**

Apply the approved title, summary, design goal, mechanics, and key decision. Remove resolved open questions and keep only the unknown team-size question.

- [ ] **Step 3: Add the optional detail-image interface and mapping**

Map the code screenshot as the primary `contain` image and the playable-build screenshot as `detail`.

- [ ] **Step 4: Render the detail image below the abstract**

Add a conditional figure after the tool strip, use localized alt text and caption, and keep it full-width within the archive overview.

- [ ] **Step 5: Run focused tests and verify GREEN**

Run: `npm test -- tests/unit/content.test.ts && python3 -m unittest tests.test_asset_hygiene -v`

Expected: all focused tests pass.

### Task 3: Verify and publish

**Files:**
- Generated only: `public/generated/projects/*.webp`, `dist/**`

**Interfaces:**
- Consumes: all updated project content and assets
- Produces: deployed GitHub Pages output

- [ ] **Step 1: Run the full verification suite**

Run: `npm run verify`

Expected: Astro checks/build, Python tests, Vitest, and Playwright all pass.

- [ ] **Step 2: Inspect the scoped diff and stage only Psychotherapy-related files**

Exclude the pre-existing untracked English-resume files.

- [ ] **Step 3: Commit and push to `main`**

Commit message: `feat: refresh Psychotherapy project dossier`

- [ ] **Step 4: Confirm GitHub Pages deployment and live assets**

Wait for the deployment workflow to complete successfully, then verify the live Chinese and English HTML contain the approved copy and both image paths.

