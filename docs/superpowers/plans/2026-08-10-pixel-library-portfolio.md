# Pixel Library Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the GitHub Pages placeholder with a fast bilingual portfolio containing a cinematic pixel-librarian landing page, an archive-style About dossier, 30 localized project pages, and a playable chronological pixel-library journey for all 15 projects.

**Architecture:** Astro generates every content route as static HTML under the `/portfolio-content/` base path. Canonical JSON is normalized into typed bilingual view models at build time. A small native TypeScript Canvas 2D engine powers the journey, while semantic DOM navigation, timeline controls, station cards, and a complete project list preserve accessibility and no-JavaScript navigation.

**Tech Stack:** Astro 5.x, TypeScript, Canvas 2D, CSS, Vitest, Playwright, Python content validation, GitHub Actions, GitHub Pages.

## Global Constraints

- Publish only at `https://tuitui0415.github.io/portfolio-content/`.
- Keep `content/` as the only hand-edited source of project facts; never invent missing facts.
- Generate `/zh/` and `/en/` versions of Landing, About, Journey, and all 15 project dossiers.
- Use the original librarian and pixel-library art direction; do not copy existing game art, characters, UI, audio, or level layouts.
- Keep Home, Journey, About, Resume, Contact, and the Chinese/English toggle visible in global navigation.
- Resolve locale from a saved choice first, then Chinese browser locales, then English; persist manual changes.
- Keep the journey usable by keyboard, mouse, touch, visible DOM controls, and a complete fallback project list.
- Support `prefers-reduced-motion`; reduced mode removes particles, parallax, auto-running, camera easing, and elaborate transitions.
- Cap Canvas device-pixel ratio at 2; pause animation when hidden; target at most 120 KB gzip of site-authored journey JavaScript.
- Publish the verified Chinese resume at `/resume/yunhan-wei-resume-zh.pdf`.
- Use test-first development, focused files, and one intentional commit per task.

## Planned File Structure

```text
astro.config.mjs                 # GitHub Pages site/base/output configuration
package.json                     # build, check, unit, and e2e scripts
playwright.config.ts             # production-preview browser matrix
tsconfig.json                    # Astro strict TypeScript settings
public/.nojekyll                 # Pages compatibility
public/art/librarian-hero.png    # original generated hero portrait
assets/resume/yunhan-wei-resume-zh.pdf # tracked canonical resume source
public/resume/**                 # stable published resume path
public/generated/**              # build-prepared canonical media (ignored)
scripts/prepare_site_assets.py   # copies tracked/canonical assets into public
src/components/
  AboutDossier.astro             # education, experience, skills, contacts, resume
  ConceptCover.astro             # deterministic labeled pixel concept visual
  GlobalHeader.astro             # global navigation and language switch
  LandingHero.astro              # landing character and two primary actions
  ProjectDossier.astro           # reusable localized project article
  JourneyShell.astro             # canvas, timeline, station card, controls, fallback list
src/layouts/BaseLayout.astro     # document metadata, global styles, navigation
src/lib/content/
  load.ts                        # JSON loading and normalization
  media.ts                       # canonical local/public media registry
  types.ts                       # Locale and view-model contracts
src/lib/i18n/
  copy.ts                        # shared bilingual interface copy
  locale.ts                      # locale resolution and equivalent-route switching
src/lib/journey/
  engine.ts                      # pure movement, jump, active station, auto-travel
  layout.ts                      # chronological station/year-wing coordinates
  renderer.ts                    # Canvas 2D pixel-library drawing
  types.ts                       # Journey state and command contracts
  ui.ts                          # DOM bindings, controls, persistence, navigation
src/pages/
  index.astro                    # preference/locale redirect with visible fallback links
  [lang]/index.astro             # localized landing page
  [lang]/about.astro             # localized About page
  [lang]/journey.astro           # localized playable journey
  [lang]/projects/[id].astro     # 30 static project dossier routes
src/styles/
  global.css                     # tokens, reset, typography, global navigation
  landing.css                    # archive entrance and hero motion
  about.css                      # dossier composition
  project.css                    # project article and media layouts
  journey.css                    # canvas shell, catalogue timeline, touch UI
src/scripts/language.ts          # client preference persistence and route switching
tests/site/                      # Python source/build contract tests
tests/unit/                      # Vitest content, locale, layout, and engine tests
tests/e2e/                       # Playwright route, input, responsive, and a11y tests
.github/workflows/pages.yml      # validate, build, and deploy GitHub Pages
```

---

### Task 1: Establish the Astro Build and Test Harness

**Files:**
- Create: `package.json`
- Create: `astro.config.mjs`
- Create: `tsconfig.json`
- Create: `src/env.d.ts`
- Create: `playwright.config.ts`
- Create: `src/pages/index.astro`
- Create: `public/.nojekyll`
- Create: `tests/site/test_site_structure.py`
- Modify: `.gitignore`
- Delete: `index.html`
- Delete: `.nojekyll`
- Modify: `tests/test_placeholder_site.py`

**Interfaces:**
- Produces npm scripts `dev`, `build`, `preview`, `check`, `test`, `test:e2e`, and `verify`.
- Produces Astro configuration with `site: 'https://tuitui0415.github.io'`, `base: '/portfolio-content'`, and `output: 'static'`.
- Later tasks consume the strict TypeScript and base-path configuration.

- [ ] **Step 1: Write the failing source-structure test**

```python
def test_astro_uses_the_existing_pages_url():
    config = (ROOT / "astro.config.mjs").read_text(encoding="utf-8")
    assert "https://tuitui0415.github.io" in config
    assert "base: '/portfolio-content'" in config

def test_root_route_keeps_visible_language_fallbacks():
    page = (ROOT / "src/pages/index.astro").read_text(encoding="utf-8")
    assert 'href={`${base}/zh/`}' in page
    assert 'href={`${base}/en/`}' in page
```

- [ ] **Step 2: Run the test and verify it fails because Astro files do not exist**

Run: `python3 -m unittest tests.site.test_site_structure -v`

Expected: FAIL with `FileNotFoundError` for `astro.config.mjs`.

- [ ] **Step 3: Add the minimal Astro project and replace the tracked placeholder**

Create `package.json` with:

```json
{
  "name": "yunhan-wei-portfolio",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "astro dev",
    "build": "python3 scripts/check_content.py && astro check && astro build",
    "preview": "astro preview",
    "check": "astro check",
    "test": "vitest run",
    "test:e2e": "playwright test",
    "verify": "python3 -m unittest discover -s tests -v && npm test && npm run build && npm run test:e2e"
  },
  "dependencies": {"astro": "^5.0.0"},
  "devDependencies": {
    "@astrojs/check": "^0.9.0",
    "@axe-core/playwright": "^4.10.0",
    "@playwright/test": "^1.50.0",
    "typescript": "^5.7.0",
    "vitest": "^3.0.0"
  }
}
```

Create `astro.config.mjs`:

```js
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://tuitui0415.github.io',
  base: '/portfolio-content',
  output: 'static',
  build: { format: 'directory' },
});
```

Create a semantic root route with visible `/zh/` and `/en/` links and a tiny inline redirect script. Move `.nojekyll` into `public/`, remove the tracked root `index.html`, and change the old placeholder test into a source/build contract test rather than testing deleted HTML.

Create `playwright.config.ts` with the `/portfolio-content` base URL and an `npm run preview -- --host 127.0.0.1` web server so later route tests run against the production build.

- [ ] **Step 4: Install dependencies and verify the scaffold**

Run: `npm install`

Run: `python3 -m unittest tests.site.test_site_structure -v && npm run check && npm run build`

Expected: source tests PASS; Astro check reports no errors; `dist/index.html` exists under a successful static build.

- [ ] **Step 5: Commit the build foundation**

```bash
git add package.json package-lock.json astro.config.mjs playwright.config.ts tsconfig.json src/env.d.ts src/pages/index.astro public/.nojekyll tests/site tests/test_placeholder_site.py .gitignore index.html .nojekyll
git commit -m "build: establish Astro portfolio site"
```

---

### Task 2: Normalize Canonical Content into Typed Bilingual View Models

**Files:**
- Create: `src/lib/content/types.ts`
- Create: `src/lib/content/load.ts`
- Create: `src/lib/content/media.ts`
- Create: `tests/unit/content.test.ts`
- Modify: `schemas/project.schema.json`

**Interfaces:**
- Produces `type Locale = 'zh' | 'en'`.
- Produces `loadPortfolio(): PortfolioData` for Astro build-time use.
- Produces `localizePortfolio(data: PortfolioData, locale: Locale): LocalizedPortfolio`.
- Produces `sortProjectsChronologically(projects: ProjectRecord[]): ProjectRecord[]`.
- Produces `getProjectMedia(projectId: string): ProjectMedia`.

- [ ] **Step 1: Write failing tests for completeness, chronology, localization, and attribution**

```ts
import { describe, expect, it } from 'vitest';
import { loadPortfolio, localizePortfolio, sortProjectsChronologically } from '../../src/lib/content/load';

describe('portfolio content', () => {
  it('loads all 15 projects with confirmed start dates', () => {
    const data = loadPortfolio();
    expect(data.projects).toHaveLength(15);
    expect(data.projects.every((project) => /^\d{4}-\d{2}$/.test(project.dates.start))).toBe(true);
  });

  it('sorts Vango first and the July 2026 projects last', () => {
    const ids = sortProjectsChronologically(loadPortfolio().projects).map((project) => project.id);
    expect(ids[0]).toBe('vango');
    expect(ids.slice(-2).sort()).toEqual(['modular-mining-game', 'rhythm-watershed']);
  });

  it('keeps NSFW team attribution in both locales', () => {
    const en = localizePortfolio(loadPortfolio(), 'en');
    const project = en.projects.find(({ id }) => id === 'interpretable-nsfw-text-moderation');
    expect(project?.teamContext).toContain('Raymond');
  });
});
```

- [ ] **Step 2: Run the tests and verify missing modules fail**

Run: `npm test -- tests/unit/content.test.ts`

Expected: FAIL with inability to resolve `src/lib/content/load`.

- [ ] **Step 3: Define exact data contracts and implement normalization**

Define `LocalizedText`, `ProjectRecord`, `ProjectViewModel`, `ExternalLinkRecord`, `ProfileRecord`, `EducationRecord`, `ExperienceRecord`, `PortfolioData`, and `LocalizedPortfolio`. Use `node:fs` and `node:path` to read `content/*.json` and `content/projects/*.json` at build time. Resolve every `link_id` through the central external-link registry and throw a descriptive error for duplicates, missing dates, or unknown links.

Use stable sorting by `dates.start`, then `dates.end`, then project ID. Keep URLs, dates, roles, team context, tools, design sections, and questions separate so pages can omit empty sections without inventing copy.

- [ ] **Step 4: Run content and repository validation**

Run: `npm test -- tests/unit/content.test.ts && python3 scripts/check_content.py && python3 -m unittest discover -s tests -v`

Expected: all content and existing repository tests PASS.

- [ ] **Step 5: Commit the typed content layer**

```bash
git add src/lib/content tests/unit/content.test.ts schemas/project.schema.json
git commit -m "feat: add typed bilingual portfolio content"
```

---

### Task 3: Add Locale Resolution, Global Layout, and Navigation

**Files:**
- Create: `src/lib/i18n/locale.ts`
- Create: `src/lib/i18n/copy.ts`
- Create: `src/scripts/language.ts`
- Create: `src/layouts/BaseLayout.astro`
- Create: `src/components/GlobalHeader.astro`
- Create: `src/styles/global.css`
- Create: `tests/unit/locale.test.ts`
- Modify: `src/pages/index.astro`

**Interfaces:**
- Produces `resolveLocale(saved: string | null, browserLocales: string[]): Locale`.
- Produces `switchLocalePath(pathname: string, target: Locale, base: string): string`.
- `BaseLayout` accepts `locale`, `title`, `description`, and optional `bodyClass`.
- `GlobalHeader` accepts `locale` and `currentPath`.

- [ ] **Step 1: Write failing locale tests**

```ts
expect(resolveLocale('en', ['zh-CN'])).toBe('en');
expect(resolveLocale(null, ['zh-CN'])).toBe('zh');
expect(resolveLocale(null, ['fr-FR'])).toBe('en');
expect(switchLocalePath('/portfolio-content/zh/projects/isolation/', 'en', '/portfolio-content'))
  .toBe('/portfolio-content/en/projects/isolation/');
```

- [ ] **Step 2: Run the locale test and verify it fails**

Run: `npm test -- tests/unit/locale.test.ts`

Expected: FAIL because locale helpers do not exist.

- [ ] **Step 3: Implement locale helpers and the shared bilingual copy map**

Use the storage key `yunhan-portfolio-locale`. `resolveLocale` accepts only `zh` or `en` saved values. Chinese locale matching uses `/^zh(?:-|$)/i`. `switchLocalePath` replaces the first localized route segment and preserves the rest of the path.

Create shared labels for Home, Journey, About, Resume, Contact, language names, Begin the Journey, project types, concept-visual label, and journey controls.

- [ ] **Step 4: Build the global layout and header**

Implement semantic skip link, `<header>`, `<nav>`, `<main>`, contact anchor, responsive menu, visible language toggle, and system-font stacks. Define the archive palette, spacing, focus ring, pixel-border utility, and reduced-motion defaults in `global.css`. The root inline script calls the same locale rules and preserves visible fallback links when JavaScript is unavailable.

- [ ] **Step 5: Verify locale behavior and static build**

Run: `npm test -- tests/unit/locale.test.ts && npm run check && npm run build`

Expected: tests and build PASS; generated HTML contains global navigation labels in the requested locale.

- [ ] **Step 6: Commit the global application shell**

```bash
git add src/lib/i18n src/scripts/language.ts src/layouts src/components/GlobalHeader.astro src/styles/global.css src/pages/index.astro tests/unit/locale.test.ts
git commit -m "feat: add bilingual portfolio shell"
```

---

### Task 4: Build the Pixel-Librarian Landing Page

**Files:**
- Create: `public/art/librarian-hero.png`
- Create: `src/components/LandingHero.astro`
- Create: `src/styles/landing.css`
- Create: `src/pages/[lang]/index.astro`
- Create: `tests/e2e/landing.spec.ts`

**Interfaces:**
- `LandingHero` accepts `locale: Locale` and emits localized About and Journey links.
- Hero image is decorative inside a keyboard-focusable About link with a descriptive accessible name.

- [ ] **Step 1: Write the failing landing route test**

```ts
test('Chinese landing exposes the two primary paths', async ({ page }) => {
  await page.goto('/portfolio-content/zh/');
  await expect(page.getByRole('link', { name: /设计师档案/ })).toBeVisible();
  await expect(page.getByRole('link', { name: /开始旅程/ })).toHaveAttribute('href', /\/zh\/journey\/$/);
});
```

- [ ] **Step 2: Run the test and verify the route is missing**

Run: `npm run build && npm run test:e2e -- tests/e2e/landing.spec.ts`

Expected: FAIL with a 404 for `/zh/`.

- [ ] **Step 3: Generate and inspect the original hero asset**

Use ImageGen with this fixed brief: “Original cinematic pixel-art librarian, full body, contemporary dark forest-green archive coat with brass accents and catalogue satchel, standing in an immense warm pixel-art library entrance, sophisticated 32-bit-style shading, clear silhouette, no text, no logos, no resemblance to an existing game character, transparent or clean separable background, vertical composition.”

Save one approved output as `public/art/librarian-hero.png`. Inspect the actual pixels for invented text, extra limbs, broken hands, or recognizable copyrighted character traits. If unusable, retry once with the same identity and simplified pose.

- [ ] **Step 4: Implement the localized landing experience**

Create the archive entrance with large librarian, quiet headline, short identity line, clickable About character, Begin the Journey button, catalogue-card secondary navigation, CSS lamp glow, capped dust particles, layered shelves, and a no-motion state. Use CSS transforms and opacity only; do not animate layout properties.

- [ ] **Step 5: Verify landing behavior and commit**

Run: `npm run check && npm run build && npm run test:e2e -- tests/e2e/landing.spec.ts`

Expected: route, actions, keyboard focus, and mobile layout tests PASS.

```bash
git add public/art/librarian-hero.png src/components/LandingHero.astro src/styles/landing.css src/pages/[lang]/index.astro tests/e2e/landing.spec.ts
git commit -m "feat: add pixel librarian landing page"
```

---

### Task 5: Build the About Dossier and Publish the Verified Resume

**Files:**
- Create: `scripts/prepare_site_assets.py`
- Create: `assets/resume/yunhan-wei-resume-zh.pdf`
- Create: `src/components/AboutDossier.astro`
- Create: `src/styles/about.css`
- Create: `src/pages/[lang]/about.astro`
- Create: `tests/site/test_public_assets.py`
- Create: `tests/e2e/about.spec.ts`
- Modify: `.gitignore`
- Modify: `package.json`

**Interfaces:**
- `prepare_site_assets.py` copies the tracked verified resume to `public/resume/yunhan-wei-resume-zh.pdf` and approved canonical media to deterministic paths.
- `AboutDossier` consumes `LocalizedPortfolio` and `Locale`; it does not contain hand-edited experience records.

- [ ] **Step 1: Write failing tests for the stable resume and public contact facts**

```python
def test_prepared_resume_is_a_single_page_pdf():
    path = ROOT / "public/resume/yunhan-wei-resume-zh.pdf"
    reader = PdfReader(path)
    assert len(reader.pages) == 1
```

```ts
test('About shows public contact facts and completed MSCS', async ({ page }) => {
  await page.goto('/portfolio-content/en/about/');
  await expect(page.getByText('+86 17372796758')).toBeVisible();
  await expect(page.getByText(/June 11, 2026/)).toBeVisible();
  await expect(page.getByRole('link', { name: /resume/i })).toHaveAttribute('href', /yunhan-wei-resume-zh\.pdf$/);
});
```

- [ ] **Step 2: Run tests and verify the public resume/About route are missing**

Run: `python3 -m unittest tests.site.test_public_assets -v`

Run: `npm run build && npm run test:e2e -- tests/e2e/about.spec.ts`

Expected: both commands FAIL for missing output/route.

- [ ] **Step 3: Implement deterministic asset preparation**

Copy the verified local `output/resume/魏允瀚_简历_2026.pdf` once into the tracked canonical source `assets/resume/yunhan-wei-resume-zh.pdf`. Have the preparation script copy that tracked source to the stable public path. Copy the Mont Saint-Michel preview and render the first pages of the NSFW and drone reports into optimized public preview images. Fail with a clear path-specific message when a required source is absent. Ignore only `public/generated/` because it is reproduced on every build; keep `public/resume/` available to the static build.

Add `prepare:assets` and update `build` to run it before content validation and Astro. This begins only after the script and tracked source exist, so the earlier scaffold remains buildable.

- [ ] **Step 4: Implement the bilingual designer dossier**

Create archive-folder sections for Profile, Education, Experience, Skills, Contact, and Resume. Use canonical data, show the public phone, email, GitHub, and website, and exclude age, gender, hometown, and availability. Keep the document readable without animation and use native `<dl>`, `<ol>`, headings, and links.

- [ ] **Step 5: Verify and commit About/resume support**

Run: `npm run prepare:assets && python3 -m unittest tests.site.test_public_assets -v && npm run build && npm run test:e2e -- tests/e2e/about.spec.ts`

Expected: one-page resume verification, bilingual About route, download, and contacts PASS.

```bash
git add assets/resume/yunhan-wei-resume-zh.pdf public/resume/yunhan-wei-resume-zh.pdf scripts/prepare_site_assets.py package.json src/components/AboutDossier.astro src/styles/about.css src/pages/[lang]/about.astro tests/site/test_public_assets.py tests/e2e/about.spec.ts .gitignore
git commit -m "feat: add designer dossier and resume"
```

---

### Task 6: Generate All Bilingual Project Dossiers and Media Fallbacks

**Files:**
- Create: `src/components/ConceptCover.astro`
- Create: `src/components/ProjectDossier.astro`
- Create: `src/styles/project.css`
- Create: `src/pages/[lang]/projects/[id].astro`
- Create: `tests/site/test_built_routes.py`
- Create: `tests/e2e/projects.spec.ts`
- Modify: `src/lib/content/media.ts`
- Modify: `scripts/prepare_site_assets.py`

**Interfaces:**
- `ProjectDossier` accepts `project`, `locale`, `previous`, `next`, and `media`.
- `ConceptCover` accepts `projectId`, `title`, `locale`, and `accent`; it always renders the visible concept label.
- Project routes are `/zh/projects/<id>/` and `/en/projects/<id>/` for every canonical ID.

- [ ] **Step 1: Write failing route and attribution tests**

```python
def test_build_contains_30_project_routes():
    pages = list((ROOT / "dist").glob("*/projects/*/index.html"))
    assert len(pages) == 30
```

```ts
test('NSFW dossier preserves team attribution', async ({ page }) => {
  await page.goto('/portfolio-content/en/projects/interpretable-nsfw-text-moderation/');
  await expect(page.getByText(/Raymond Kang/)).toBeVisible();
  await expect(page.getByRole('link', { name: /team code/i })).toBeVisible();
});
```

- [ ] **Step 2: Run tests and verify project routes are missing**

Run: `npm run build && python3 -m unittest tests.site.test_built_routes -v`

Expected: FAIL with zero project route pages.

- [ ] **Step 3: Implement static route generation**

Use `getStaticPaths()` to emit both locales for all canonical projects. Render only non-empty sections. Format dates consistently, attribute teams, expose safe external links with `target="_blank" rel="noreferrer"`, and add previous/next/return-to-library navigation.

- [ ] **Step 4: Implement real-media preference and labeled concept fallbacks**

Use the local preview registry for Mont Saint-Michel, drone, and NSFW. For other projects, render deterministic CSS pixel compositions seeded by project ID and based on verified mechanics/tools. The fallback includes the visible `概念视觉 / Concept Visual` label and never pretends to be a screenshot.

- [ ] **Step 5: Verify all routes, links, and attribution**

Run: `npm run build && python3 -m unittest tests.site.test_built_routes -v && npm run test:e2e -- tests/e2e/projects.spec.ts`

Expected: 30 direct-load routes, real-media pages, labeled concept pages, previous/next links, and attribution checks PASS.

- [ ] **Step 6: Commit project dossiers**

```bash
git add src/components/ConceptCover.astro src/components/ProjectDossier.astro src/styles/project.css src/pages/[lang]/projects src/lib/content/media.ts scripts/prepare_site_assets.py tests/site/test_built_routes.py tests/e2e/projects.spec.ts
git commit -m "feat: add bilingual project dossiers"
```

---

### Task 7: Implement the Pure Chronological Journey Layout and Movement Engine

**Files:**
- Create: `src/lib/journey/types.ts`
- Create: `src/lib/journey/layout.ts`
- Create: `src/lib/journey/engine.ts`
- Create: `tests/unit/journey-layout.test.ts`
- Create: `tests/unit/journey-engine.test.ts`

**Interfaces:**
- `buildJourneyLayout(projects: ProjectViewModel[]): JourneyLayout` returns ordered `stations`, `wings`, `worldWidth`, and `floorY`.
- `createJourneyState(layout: JourneyLayout, restoredProjectId?: string): JourneyState`.
- `stepJourney(state: JourneyState, input: JourneyInput, dtSeconds: number): JourneyState` is pure.
- `selectStation(state: JourneyState, projectId: string, reducedMotion: boolean): JourneyState`.
- `shouldOpenPortal(state: JourneyState): string | null` returns the active project ID only during a valid portal-entry condition.

- [ ] **Step 1: Write failing chronological-layout tests**

```ts
const layout = buildJourneyLayout(localizePortfolio(loadPortfolio(), 'en').projects);
expect(layout.stations).toHaveLength(15);
expect(layout.stations[0].projectId).toBe('vango');
expect(layout.stations.every((station, index, all) => index === 0 || station.x > all[index - 1].x)).toBe(true);
expect(layout.worldWidth).toBeGreaterThan(layout.stations.at(-1)!.x);
```

- [ ] **Step 2: Run layout tests and verify missing modules fail**

Run: `npm test -- tests/unit/journey-layout.test.ts`

Expected: FAIL because layout types/functions do not exist.

- [ ] **Step 3: Implement deterministic station and year-wing coordinates**

Assign fixed station spacing, larger gaps at year transitions, floor engravings, and category accents. Derive all positions from sorted view models, never a second manual project array.

- [ ] **Step 4: Write failing engine tests for manual movement, jump, auto-travel, and portal entry**

```ts
it('lands on the floor after a jump', () => {
  let state = createJourneyState(layout);
  state = stepJourney(state, { right: false, left: false, jumpPressed: true }, 1 / 60);
  for (let frame = 0; frame < 120; frame += 1) {
    state = stepJourney(state, { right: false, left: false, jumpPressed: false }, 1 / 60);
  }
  expect(state.player.y).toBe(layout.floorY);
  expect(state.player.grounded).toBe(true);
});

it('auto-travel stops at the selected station', () => {
  let state = selectStation(createJourneyState(layout), 'rhythm-watershed', false);
  for (let frame = 0; frame < 1200 && state.autoTargetId; frame += 1) {
    state = stepJourney(state, EMPTY_INPUT, 1 / 60);
  }
  expect(state.activeProjectId).toBe('rhythm-watershed');
  expect(state.autoTargetId).toBeNull();
});
```

- [ ] **Step 5: Run engine tests and verify they fail**

Run: `npm test -- tests/unit/journey-engine.test.ts`

Expected: FAIL because engine functions do not exist.

- [ ] **Step 6: Implement the smallest pure engine that passes**

Use capped horizontal acceleration, friction, maximum speed, gravity, jump velocity, fixed floor collision, bounded world coordinates, station activation radius, horizontal auto-travel, and camera target calculation. Clamp `dtSeconds` to `1 / 30` and run the browser loop with a fixed `1 / 60` accumulator. Reduced-motion station selection places the player directly at the target.

- [ ] **Step 7: Verify all journey unit tests and commit**

Run: `npm test -- tests/unit/journey-layout.test.ts tests/unit/journey-engine.test.ts`

Expected: chronology, bounds, jump, activation, auto-travel, reduced motion, and portal tests PASS.

```bash
git add src/lib/journey tests/unit/journey-layout.test.ts tests/unit/journey-engine.test.ts
git commit -m "feat: add chronological journey engine"
```

---

### Task 8: Render and Control the Playable Pixel Library

**Files:**
- Create: `src/lib/journey/renderer.ts`
- Create: `src/lib/journey/ui.ts`
- Create: `src/components/JourneyShell.astro`
- Create: `src/styles/journey.css`
- Create: `src/pages/[lang]/journey.astro`
- Create: `tests/e2e/journey.spec.ts`

**Interfaces:**
- `createJourneyRenderer(canvas: HTMLCanvasElement, layout: JourneyLayout): JourneyRenderer` returns `resize`, `render`, and `destroy`.
- `mountJourney(root: HTMLElement, initial: JourneyPayload): () => void` binds inputs and returns cleanup.
- `JourneyShell` serializes localized `JourneyPayload` once and provides canvas, catalogue, station card, controls, and fallback list.

- [ ] **Step 1: Write failing journey interaction tests**

```ts
test('timeline selection activates and opens a project', async ({ page }) => {
  await page.goto('/portfolio-content/en/journey/');
  await page.getByRole('button', { name: /Rhythm Watershed/ }).click();
  await expect(page.getByRole('heading', { name: 'Rhythm Watershed' })).toBeVisible();
  await page.getByRole('link', { name: /open project/i }).click();
  await expect(page).toHaveURL(/\/en\/projects\/rhythm-watershed\/$/);
});

test('keyboard movement changes the reported player position', async ({ page }) => {
  await page.goto('/portfolio-content/en/journey/');
  const before = await page.locator('[data-player-x]').getAttribute('data-player-x');
  await page.keyboard.down('ArrowRight');
  await page.waitForTimeout(300);
  await page.keyboard.up('ArrowRight');
  await expect.poll(() => page.locator('[data-player-x]').getAttribute('data-player-x')).not.toBe(before);
});
```

- [ ] **Step 2: Run tests and verify the journey route is missing**

Run: `npm run build && npm run test:e2e -- tests/e2e/journey.spec.ts`

Expected: FAIL with a 404 for the journey route.

- [ ] **Step 3: Implement Canvas rendering without behavior duplication**

Draw parallax library layers, year wings, shelves, lamps, archive books, project panels, floor markers, librarian state, and capped dust particles from `JourneyState`. Render at capped DPR, use integer world coordinates for pixel edges, pause on `document.hidden`, and drop particles before reducing engine updates.

- [ ] **Step 4: Implement semantic journey UI and all input paths**

Create the draggable/collapsible T3 catalogue, year labels, 15 project buttons, arrival card, explicit open link, touch controls, keyboard listeners, project-list fallback, live status text, and session restoration. Timeline selection calls `selectStation`; UI never modifies player coordinates directly. Portal entry, E/Enter, and open link resolve to the same localized dossier URL.

- [ ] **Step 5: Add journey route and responsive CSS**

The page renders a useful chronological project list before client initialization. Coarse-pointer controls use 44-pixel targets. Mobile stacks the arrival card above the catalogue and prevents catalogue swipes from scrolling the page.

- [ ] **Step 6: Verify all movement and navigation paths**

Run: `npm test -- tests/unit/journey-layout.test.ts tests/unit/journey-engine.test.ts`

Run: `npm run build && npm run test:e2e -- tests/e2e/journey.spec.ts`

Expected: keyboard movement, jump/open equivalence, timeline auto-travel, touch controls, fallback list, and return-state tests PASS.

- [ ] **Step 7: Commit the playable journey**

```bash
git add src/lib/journey/renderer.ts src/lib/journey/ui.ts src/components/JourneyShell.astro src/styles/journey.css src/pages/[lang]/journey.astro tests/e2e/journey.spec.ts
git commit -m "feat: add playable pixel library journey"
```

---

### Task 9: Verify Responsive, Reduced-Motion, Accessibility, and Performance Behavior

**Files:**
- Create: `tests/e2e/responsive.spec.ts`
- Create: `tests/e2e/accessibility.spec.ts`
- Create: `tests/e2e/performance.spec.ts`
- Modify: `playwright.config.ts`
- Modify: `src/styles/global.css`
- Modify: `src/styles/landing.css`
- Modify: `src/styles/about.css`
- Modify: `src/styles/project.css`
- Modify: `src/styles/journey.css`
- Modify: `src/lib/journey/renderer.ts`

**Interfaces:**
- Playwright runs against `npm run preview -- --host 127.0.0.1` after a production build.
- Projects cover Chromium desktop, iPhone-sized touch, and reduced-motion desktop.

- [ ] **Step 1: Add failing accessibility and responsive assertions**

```ts
test('key routes have no serious axe violations', async ({ page }) => {
  for (const path of ['/zh/', '/en/about/', '/en/journey/', '/zh/projects/isolation/']) {
    await page.goto(`/portfolio-content${path}`);
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations.filter(({ impact }) => impact === 'critical' || impact === 'serious')).toEqual([]);
  }
});

test('mobile pages do not overflow horizontally', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/portfolio-content/zh/journey/');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
});
```

- [ ] **Step 2: Run the new suite and record actual failures**

Run: `npm run build && npm run test:e2e -- tests/e2e/responsive.spec.ts tests/e2e/accessibility.spec.ts tests/e2e/performance.spec.ts`

Expected: FAIL on any unresolved contrast, focus, overflow, motion, or payload issue; use the exact failure as the next implementation target.

- [ ] **Step 3: Fix only verified issues and enforce motion/performance budgets**

Add visible `:focus-visible`, accessible names, correct landmarks, contrast-safe tokens, 44-pixel touch targets, responsive typography, overflow containment, image dimensions, and `prefers-reduced-motion` overrides. Renderer checks `document.visibilityState`, caps DPR at 2, and sets particle count to zero in reduced mode.

Add a production-build assertion that total authored journey JS does not exceed 120 KB gzip. Exclude Astro runtime and source maps from the measurement and fail with the measured byte count.

- [ ] **Step 4: Re-run full browser verification**

Run: `npm run build && npm run test:e2e`

Expected: all desktop, mobile, keyboard, touch, reduced-motion, accessibility, direct-route, and performance tests PASS.

- [ ] **Step 5: Commit responsive and accessibility hardening**

```bash
git add playwright.config.ts tests/e2e src/styles src/lib/journey/renderer.ts
git commit -m "test: harden portfolio across platforms"
```

---

### Task 10: Configure GitHub Pages Deployment and Verify Production

**Files:**
- Create: `.github/workflows/pages.yml`
- Create: `tests/site/test_pages_workflow.py`
- Modify: `README.md`

**Interfaces:**
- Workflow validates Python content, installs locked npm dependencies, installs Playwright Chromium, runs unit/build/e2e checks, uploads `dist`, and deploys Pages.
- Production verification uses the exact public URL and direct route paths.

- [ ] **Step 1: Write the failing workflow contract test**

```python
def test_pages_workflow_builds_and_deploys_dist():
    workflow = (ROOT / ".github/workflows/pages.yml").read_text(encoding="utf-8")
    assert "npm ci" in workflow
    assert "npm run build" in workflow
    assert "actions/upload-pages-artifact" in workflow
    assert "actions/deploy-pages" in workflow
```

- [ ] **Step 2: Run the test and verify the workflow is missing**

Run: `python3 -m unittest tests.site.test_pages_workflow -v`

Expected: FAIL with `FileNotFoundError`.

- [ ] **Step 3: Add the Pages workflow and update repository documentation**

Use `permissions: { contents: read, pages: write, id-token: write }`, `concurrency` for Pages, Node dependency caching, `python -m pip install pypdf` for the single-page resume contract, Python content checks, `npm ci`, `npm test`, `npm run build`, Playwright Chromium, `npm run test:e2e`, Pages artifact upload from `dist`, and deployment in the `github-pages` environment.

Document canonical content edits, local commands, stable resume source/output, generated assets, and production URL in `README.md`.

- [ ] **Step 4: Run the complete local release gate**

Run: `python3 scripts/check_content.py`

Run: `python3 -m unittest discover -s tests -v`

Run: `npm test`

Run: `npm run build`

Run: `npm run test:e2e`

Run: `git diff --check && git status --short`

Expected: all validators, 30 project routes, static build, browser matrix, and diff checks PASS; only intentional tracked changes remain.

- [ ] **Step 5: Commit deployment configuration**

```bash
git add .github/workflows/pages.yml tests/site/test_pages_workflow.py README.md
git commit -m "ci: deploy portfolio to GitHub Pages"
```

- [ ] **Step 6: Push and switch Pages to workflow deployment**

Run: `git push origin main`

Run: `gh api -X PUT repos/tuitui0415/portfolio-content/pages -f build_type=workflow`

Expected: push succeeds and the Pages endpoint reports `build_type: workflow`.

- [ ] **Step 7: Wait for deployment and verify public direct routes**

Verify HTTP 200 and expected content for:

```text
https://tuitui0415.github.io/portfolio-content/
https://tuitui0415.github.io/portfolio-content/zh/
https://tuitui0415.github.io/portfolio-content/en/
https://tuitui0415.github.io/portfolio-content/zh/about/
https://tuitui0415.github.io/portfolio-content/en/journey/
https://tuitui0415.github.io/portfolio-content/zh/projects/isolation/
https://tuitui0415.github.io/portfolio-content/en/projects/rhythm-watershed/
https://tuitui0415.github.io/portfolio-content/resume/yunhan-wei-resume-zh.pdf
```

Expected: pages return the new bilingual portfolio, the PDF returns `application/pdf`, and no URL exposes the old placeholder.

---

## Final Release Checklist

- [ ] All 15 projects appear in chronological order in both the world and T3 catalogue.
- [ ] Landing character opens About; Begin the Journey opens the library.
- [ ] Mouse/trackpad selection, keyboard movement/jump/open, touch controls, and fallback list all reach projects.
- [ ] Jump portal, E/Enter, and visible open link resolve to the same localized project route.
- [ ] Both languages, preference persistence, and equivalent-route switching work.
- [ ] About shows approved public professional information and excludes resume-only demographics.
- [ ] All 30 project routes direct-load and preserve verified attribution.
- [ ] Real media is preferred and every fallback is labeled Concept Visual.
- [ ] Resume downloads from the stable production URL.
- [ ] Reduced motion, focus, contrast, touch sizing, and no-JavaScript fallbacks pass.
- [ ] Authored journey JS remains within 120 KB gzip and responsive layouts do not overflow.
- [ ] Full local verification and GitHub Pages production verification pass.
