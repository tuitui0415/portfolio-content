# Restrained Public Presentation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Simplify the bilingual landing page and keep public project dossiers factual and positive.

**Architecture:** Keep canonical project JSON unchanged and enforce public presentation rules in Astro components. Replace the illustrated landing composition with a text-only, responsive entry screen; omit the mixed internal `iteration` field at render time.

**Tech Stack:** Astro, CSS, Playwright, Vitest

## Global Constraints

- No person or scene artwork on the landing page.
- No subjective or promotional copy.
- No public project limitations, disadvantages, or incomplete-work statements.
- Preserve bilingual routes, accessibility, responsiveness, and existing content data.

---

### Task 1: Lock the public presentation contract

**Files:**
- Modify: `tests/e2e/landing.spec.ts`
- Modify: `tests/e2e/projects.spec.ts`
- Modify: `tests/e2e/performance.spec.ts`

**Interfaces:**
- Consumes: generated Astro routes under `/portfolio-content/{locale}/`
- Produces: browser-level assertions for a text-only landing and omission of internal iteration notes

- [ ] **Step 1: Write failing tests** asserting the landing contains no image or subjective intro and project pages contain no iteration section.
- [ ] **Step 2: Run the focused Playwright tests** and confirm they fail against the current illustrated site.
- [ ] **Step 3: Keep the assertions user-visible** by checking headings, links, and rendered text rather than implementation helpers.

### Task 2: Implement the restrained landing

**Files:**
- Modify: `src/components/LandingHero.astro`
- Modify: `src/styles/landing.css`
- Delete: `public/art/librarian-hero.webp`

**Interfaces:**
- Consumes: `locale`, `portfolio.profile`, and existing route helpers
- Produces: bilingual name, factual credentials, and About/Journey links

- [ ] **Step 1: Remove the image, dust particles, archive statistics, scroll prompt, and subjective intro.**
- [ ] **Step 2: Add one factual credentials line** for M.S. Computer Science and project domains.
- [ ] **Step 3: Replace landing CSS** with a responsive solid-background layout and restrained hover transitions.
- [ ] **Step 4: Run landing and performance tests** and confirm they pass.

### Task 3: Keep public dossiers factual

**Files:**
- Modify: `src/components/ProjectDossier.astro`
- Modify: `src/components/AboutDossier.astro`

**Interfaces:**
- Consumes: existing localized portfolio view models
- Produces: project pages without `design.iteration` and an About lede based on verifiable credentials

- [ ] **Step 1: Remove the iteration section from the public sections array.**
- [ ] **Step 2: Replace the About lede** with a factual education and project-experience sentence in both languages.
- [ ] **Step 3: Run project and About tests** and confirm they pass.

### Task 4: Verify and publish

**Files:**
- Verify only: generated `dist/`

**Interfaces:**
- Consumes: the complete repository state
- Produces: passing build, unit, content, accessibility, desktop, and mobile checks on GitHub Pages

- [ ] **Step 1: Run `npm run verify`.**
- [ ] **Step 2: Inspect desktop and mobile screenshots** for hierarchy and clipping.
- [ ] **Step 3: Commit and push `main`.**
- [ ] **Step 4: Wait for GitHub Pages deployment** and verify the public routes contain the new presentation.
