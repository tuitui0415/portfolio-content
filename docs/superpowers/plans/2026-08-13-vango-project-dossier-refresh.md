# Vango Project Dossier Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace Vango’s placeholder copy and concept cover with the confirmed bilingual description and the supplied Figma workflow screenshot.

**Architecture:** Keep `content/projects/vango.json` as the canonical bilingual source. Store one optimized WebP preview in `assets/previews/`, publish it through the existing asset preparation script, and expose it through `getProjectMedia`. Add an optional per-image fit mode so the full Figma canvas can use `contain` without changing the crop behavior of existing project previews.

**Tech Stack:** Astro 5, TypeScript, Vitest, Python unittest, CSS, WebP via `cwebp`.

## Global Constraints

- Do not change Vango’s confirmed `2019-09` to `2019-12` date range or its existing public Figma link.
- Preserve the existing `UI 设计` / `UI Design` role and do not invent team size or individual contributions.
- Use the confirmed Chinese and English descriptions verbatim.
- Show the supplied Figma canvas completely without stretching.
- Do not modify any other project record or image presentation.

---

### Task 1: Lock the Vango content and media contract

**Files:**
- Modify: `tests/unit/content.test.ts`
- Modify: `tests/test_asset_hygiene.py`

**Interfaces:**
- Consumes: `loadPortfolio()`, `localizePortfolio(data, locale)`, and `getProjectMedia(projectId)`.
- Produces: regression coverage for the approved copy, team context, real-image mapping, contain fit, and tracked preview asset.

- [ ] **Step 1: Write the failing content and media test**

Add this import and test to `tests/unit/content.test.ts`:

```ts
import { getProjectMedia } from '../../src/lib/content/media';

it('publishes Vango as a team Figma prototype with a complete real preview', () => {
  const zh = localizePortfolio(loadPortfolio(), 'zh').projects.find(({ id }) => id === 'vango');
  const en = localizePortfolio(loadPortfolio(), 'en').projects.find(({ id }) => id === 'vango');
  const media = getProjectMedia('vango');

  expect(zh?.teamContext).toBe('团队项目');
  expect(zh?.websiteCopy).toBe('Vango 是一款用于浏览与介绍游戏作品的 Figma 交互原型。原型包含作品发现、分类筛选、详情浏览、搜索、评论、个人主页及内容发布等界面流程。');
  expect(en?.websiteCopy).toBe('Vango is a Figma interactive prototype for discovering, browsing, and presenting game projects. It includes flows for discovery, filtering, project details, search, comments, user profiles, and content publishing.');
  expect(media).toMatchObject({
    kind: 'image',
    src: '/portfolio-content/generated/projects/vango.webp',
    fit: 'contain',
  });
});
```

Append `ROOT / "assets/previews/vango.webp"` to the expected list in `tests/test_asset_hygiene.py`.

- [ ] **Step 2: Run the focused tests and verify failure**

Run: `npm test -- --run tests/unit/content.test.ts && python3 -m unittest tests.test_asset_hygiene -v`

Expected: FAIL because the approved copy, Vango real-media mapping, `fit` field, and preview file do not exist yet.

- [ ] **Step 3: Commit the failing tests**

```bash
git add tests/unit/content.test.ts tests/test_asset_hygiene.py
git commit -m "test: define Vango dossier refresh"
```

### Task 2: Add the approved bilingual content and optimized screenshot

**Files:**
- Modify: `content/projects/vango.json`
- Modify: `projects/vango/README.md`
- Create: `assets/previews/vango.webp`

**Interfaces:**
- Consumes: the supplied 1264×1222 PNG screenshot and the content shape validated by `scripts/check_content.py`.
- Produces: canonical bilingual copy and an optimized project preview consumed by the site asset pipeline.

- [ ] **Step 1: Update the canonical Vango record**

Set the team context, summary, website copy, full copy, sources, and questions as follows while preserving dates, tools, role, and link ID:

```json
"team": {"size": null, "context": {"zh": "团队项目", "en": "Team project"}},
"summary": {
  "zh": "用于浏览与介绍游戏作品的 Figma 交互原型。",
  "en": "A Figma interactive prototype for browsing and presenting game projects."
},
"copy": {
  "resume": {"zh": [], "en": []},
  "website": {
    "zh": "Vango 是一款用于浏览与介绍游戏作品的 Figma 交互原型。原型包含作品发现、分类筛选、详情浏览、搜索、评论、个人主页及内容发布等界面流程。",
    "en": "Vango is a Figma interactive prototype for discovering, browsing, and presenting game projects. It includes flows for discovery, filtering, project details, search, comments, user profiles, and content publishing."
  },
  "full": {
    "zh": "Vango 是一款用于浏览与介绍游戏作品的 Figma 交互原型。原型包含作品发现、分类筛选、详情浏览、搜索、评论、个人主页及内容发布等界面流程。",
    "en": "Vango is a Figma interactive prototype for discovering, browsing, and presenting game projects. It includes flows for discovery, filtering, project details, search, comments, user profiles, and content publishing."
  }
},
"sources": ["User-confirmed project description", "User-supplied Figma canvas screenshot", "Figma public prototype"],
"questions": []
```

- [ ] **Step 2: Synchronize the human-readable README**

Replace the uncertainty language with the confirmed bilingual descriptions, record it as a team project, preserve the public Figma prototype link, and remove resolved questions.

- [ ] **Step 3: Convert the supplied screenshot to WebP**

Run:

```bash
cwebp -quiet -q 88 -m 6 /private/var/folders/gm/hv28spw11bl0pssqmhx3c0000000gn/T/codex-clipboard-af8b6f85-38cb-4887-b6ed-69bf499a78d7.png -o assets/previews/vango.webp
```

Expected: `assets/previews/vango.webp` exists, preserves the 1264×1222 dimensions, and is smaller than the PNG source.

- [ ] **Step 4: Validate the canonical content**

Run: `python3 scripts/check_content.py`

Expected: `content: valid`.

- [ ] **Step 5: Commit the content and preview**

```bash
git add content/projects/vango.json projects/vango/README.md assets/previews/vango.webp
git commit -m "content: refresh Vango dossier"
```

### Task 3: Render the Vango screenshot completely

**Files:**
- Modify: `src/lib/content/types.ts`
- Modify: `src/lib/content/media.ts`
- Modify: `src/components/ProjectDossier.astro`
- Modify: `src/styles/project.css`

**Interfaces:**
- Consumes: `ProjectMedia` from `src/lib/content/types.ts`.
- Produces: optional `ProjectMedia.fit?: 'cover' | 'contain'`; Vango returns `fit: 'contain'`; `ProjectDossier` converts it into a modifier class.

- [ ] **Step 1: Extend the media type minimally**

Add this optional field to `ProjectMedia`:

```ts
fit?: 'cover' | 'contain';
```

- [ ] **Step 2: Map Vango to its real preview**

Add this entry to `realMedia` in `src/lib/content/media.ts`:

```ts
vango: {
  kind: 'image',
  src: '/portfolio-content/generated/projects/vango.webp',
  alt: {
    zh: 'Vango 的 Figma 页面结构与主要交互流程',
    en: 'Vango’s Figma screen structure and primary interaction flows',
  },
  accent: '#b7c66b',
  fit: 'contain',
},
```

- [ ] **Step 3: Apply the fit mode in the dossier**

Change the real-media figure class to:

```astro
<figure class:list={['real-media', media.fit === 'contain' && 'real-media--contain']}>
```

- [ ] **Step 4: Add the contained-image style**

Add:

```css
.real-media--contain { padding: clamp(.8rem, 2vw, 1.5rem); background: #e7e7e7; }
.real-media--contain img { object-fit: contain; filter: none; }
```

- [ ] **Step 5: Run the focused tests**

Run: `npm test -- --run tests/unit/content.test.ts && python3 -m unittest tests.test_asset_hygiene -v`

Expected: PASS.

- [ ] **Step 6: Commit the rendering change**

```bash
git add src/lib/content/types.ts src/lib/content/media.ts src/components/ProjectDossier.astro src/styles/project.css
git commit -m "feat: show complete Vango workflow preview"
```

### Task 4: Verify the bilingual public result

**Files:**
- Modify: `tests/e2e/projects.spec.ts`

**Interfaces:**
- Consumes: generated Chinese and English Vango routes.
- Produces: browser-level regression coverage for the approved copy, real image, external link, and absence of the concept label.

- [ ] **Step 1: Add the Vango browser test**

```ts
test('Vango presents the confirmed team prototype with a real workflow image', async ({ page }) => {
  await page.goto('/portfolio-content/zh/projects/vango/');
  await expect(page.getByText('团队项目')).toBeVisible();
  await expect(page.getByText(/用于浏览与介绍游戏作品的 Figma 交互原型/).first()).toBeVisible();
  await expect(page.locator('.real-media--contain img')).toHaveAttribute('src', /vango\.webp$/);
  await expect(page.getByText('概念视觉')).toHaveCount(0);
  await expect(page.getByRole('link', { name: /Figma/ })).toBeVisible();
});
```

- [ ] **Step 2: Run the full verification gate**

Run: `npm run verify`

Expected: Astro build, Python tests, Vitest tests, and Playwright tests all PASS.

- [ ] **Step 3: Inspect the generated desktop and mobile page**

Open the Chinese Vango page at desktop and mobile widths. Confirm that the full screenshot is visible, is not stretched, and the description remains readable.

- [ ] **Step 4: Commit the browser regression test**

```bash
git add tests/e2e/projects.spec.ts
git commit -m "test: cover Vango project presentation"
```
