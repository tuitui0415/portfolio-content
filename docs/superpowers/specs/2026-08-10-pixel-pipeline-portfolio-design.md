# Pixel Pipeline Portfolio Design

## 1. Goal and Release Boundary

Build and publish a bilingual personal portfolio for Yunhan Wei at:

`https://tuitui0415.github.io/portfolio-content/`

The website presents all 15 projects as an explorable low-color pixel-art level. A visitor can select a project with the mouse and watch an original avatar travel to it, or move the avatar with the keyboard. Each checkpoint opens an independently shareable project dossier.

This first release is an interaction-complete visual draft. It must establish the content model, navigation, movement, animation language, responsive behavior, accessibility, deployment, and resume workflow. A later art-polish release will refine sprite animation, environment tiles, depth, covers, transitions, and effects without changing the information architecture.

## 2. Audience and Experience Priority

The primary experience is an immersive project showcase rather than a conventional recruiter-first portfolio. It should feel like entering a small original game world while still allowing a visitor to reach any project, personal information, contact method, or resume without learning the controls.

The site must not copy Nintendo characters, Mario pipes, logos, sound effects, level layouts, or other protected game assets. “Pipe parkour” describes the interaction pattern only. All characters, pipes, palette, UI, routes, and motion language are original and based on field maps, level-design documentation, and low-color pixel art.

## 3. Confirmed Visual Direction

### 3.1 Style

- Extreme low-color pixel art rather than detailed 16-bit or 32-bit illustration.
- Four-color foundation: near-black, deep desaturated green, sage, and parchment.
- Hard pixel edges, no smoothing, limited color ramps, stepped motion, scan-line texture, and compact monospace labels.
- The earlier “Cartographer’s Archive” direction remains visible through coordinates, route annotations, checkpoint numbers, field-file terminology, and map-grid structure.
- Real project images are used first and translated into the site palette with framing and pixel treatment.
- Projects without usable imagery receive an original concept cover based only on verified project summaries. The dossier labels it “概念视觉 / Concept Visual”.

### 3.2 Original Avatar

Create an original low-color 2D pixel character representing a modern game designer:

- hoodie;
- headphones;
- handheld tablet;
- neutral, professional silhouette;
- no resemblance to an existing game character.

V1 animation states:

- idle;
- walk left and right;
- move vertically on route segments;
- interact/open project;
- enter/exit a pipe or route transition.

The final sprite must remain legible at its smallest desktop and mobile display size. The production asset may be generated from an image model, but frame dimensions, palette, transparency, and animation consistency must be verified before use.

## 4. Information Architecture

### 4.1 Routes

- `/`: detects browser language and redirects to the matching localized home route.
- `/zh/` and `/en/`: interactive project world.
- `/zh/projects/<project-id>/` and `/en/projects/<project-id>/`: static, shareable project dossiers.
- `/zh/about/` and `/en/about/`: personal information pages.
- Stable resume download URL under the published site.

Every route must work when opened directly on GitHub Pages, not only after navigating from the homepage.

### 4.2 Navigation

The upper-right area always provides:

- project world;
- about page;
- resume download;
- contact;
- visible Chinese/English toggle.

The language system:

1. reads a previously saved language choice from local storage;
2. otherwise uses Chinese for Chinese browser locales;
3. otherwise uses English;
4. saves manual language changes;
5. moves to the equivalent localized route when switching languages.

### 4.3 About Page

The independent personal information page is an explorable pixel “designer profile file” containing:

- name and positioning;
- UC Davis MSCS, graduated June 11, 2026;
- UC Santa Cruz B.S. in Computer Science: Computer Game Design;
- all verified professional and research experience;
- skills and languages;
- email, phone, and GitHub;
- resume download.

It does not display age, gender, hometown, or availability.

## 5. Interactive Project World

### 5.1 Pipe Route

All 15 projects appear as checkpoints on one horizontally explorable pipe route. Known dates determine chronological placement. Projects without verified dates appear in an explicitly labeled “Archive Annex / 日期待确认” route segment and are not assigned invented years.

The pipe route uses:

- horizontal and vertical segments;
- elbows, junctions, lifts, and short branches;
- checkpoint flags and numbered project stations;
- image panels above or below the route;
- different elevations to express phases in the portfolio.

### 5.2 Movement

Mouse or pointer:

- clicking a project computes a route through the pipe graph;
- the character travels to that checkpoint;
- the camera follows with bounded easing;
- arrival focuses the project and presents an open command;
- a second click or the explicit open control enters the dossier.

Keyboard:

- arrows and WASD move along valid route segments;
- E opens the currently active checkpoint;
- Escape closes overlays or returns focus to the world;
- keyboard commands are ignored while typing or interacting with standard form controls.

Touch:

- tapping a project triggers auto-travel;
- compact on-screen directional controls allow manual movement;
- touch controls do not cover project labels or navigation.

Movement is constrained to a graph of authored pipe segments. It is not free platforming physics. This keeps input predictable, prevents collision bugs, and makes mouse path selection deterministic.

### 5.3 Project Selection and Dossier Transition

When a checkpoint opens:

1. the selected route segment brightens;
2. map layers separate in stepped pixel motion;
3. the project image expands;
4. the localized dossier route loads;
5. the page retains a clear return-to-world action and restores the prior world position.

The transition must respect `prefers-reduced-motion`; reduced-motion mode uses a short opacity change with no camera travel.

## 6. Project Dossiers

Each project page consumes its record from `content/projects/*.json` and the central link registry. It includes only sections supported by available data:

- localized title and type;
- date or explicit date status;
- summary;
- personal role and team context;
- tools;
- design goals;
- mechanics;
- decisions;
- iteration and limitations;
- resume-length bullets when useful;
- real-image gallery and labeled concept covers;
- GitHub, Google Drive, playable build, PDF, deck, article, Figma, or other verified external links;
- previous/next project navigation.

External links open safely in a new tab with descriptive labels. Raymond Kang’s repository and team contributions remain explicitly attributed. The NSFW system metric remains a team-level result. The drone physical-hardware limitation remains visible. No missing fact is invented.

## 7. Technical Architecture

### 7.1 Framework

- Astro static site generation for direct, shareable routes and GitHub Pages compatibility.
- TypeScript for build-time content normalization and interaction code.
- A React island for the interactive home-world state.
- PixiJS for the low-color 2D world, avatar, pipe tiles, checkpoints, camera, and sprite animation.
- GSAP only for bounded DOM transitions and dossier/map-layer reveals that are awkward in PixiJS.
- Astro view transitions for localized page navigation where supported, with normal navigation fallback.

### 7.2 Data Flow

`content/` remains the canonical source of truth.

At build time:

1. validate content with the existing Python validator;
2. load profile, education, experience, project, and link JSON;
3. normalize them into typed bilingual view models;
4. generate localized project and about routes;
5. build the checkpoint registry consumed by the interactive world;
6. fail the build for missing project IDs, duplicate routes, or unresolved link references.

Website copy must not be maintained in a second hand-edited project database.

### 7.3 Movement Model

The world defines:

- graph nodes with `id`, coordinates, and optional checkpoint project ID;
- graph edges with endpoints, orientation, and distance;
- player state with current node/edge, direction, progress, and movement mode;
- camera state with bounded world position;
- selection state with active and pending project IDs.

Mouse auto-travel uses a deterministic shortest-path search over this small authored graph. Keyboard input chooses a connected edge in the requested direction. The same route data draws the pipes and constrains movement, preventing the visual route and playable route from drifting apart.

## 8. Performance and Accessibility

- Static HTML contains a complete project index even before the interactive world loads.
- The PixiJS bundle loads only on the homepage.
- Project images use responsive sizes and lazy loading.
- Concept covers use optimized WebP plus fallback where needed.
- Fonts are self-hosted or use reliable system fallbacks.
- All navigation and project selection remain keyboard accessible outside the canvas.
- A “project list” control provides immediate non-game navigation.
- Reduced-motion mode disables auto-running, parallax, scan-line motion, route pulses, and elaborate transitions.
- Color contrast is verified despite the restricted palette.
- Pixel graphics use nearest-neighbor scaling.
- Mobile has touch controls and a simpler camera, without removing projects or content.

## 9. Resume Workflow

The supplied one-page Chinese resume is the current source file for the download experience. After the public website URL exists, create an updated one-page PDF that:

- replaces the Google Sites URL with `https://tuitui0415.github.io/portfolio-content/`;
- changes UC Davis from “现在” to a completed June 2026 degree;
- states graduation on June 11, 2026 where layout permits;
- preserves the public phone number;
- uses the canonical repository facts for other corrections;
- remains one page and visually verified.

Publish the updated PDF under a stable site filename so future replacements do not break links.

## 10. GitHub Pages Delivery

- Add a GitHub Actions workflow that validates content, builds the Astro site with base path `/portfolio-content/`, uploads the Pages artifact, and deploys it.
- Configure asset and internal URLs for the project-site base path.
- Do not require a backend, database, authentication, or secret runtime values.
- Verify the deployed homepage, both languages, about pages, multiple direct project URLs, resume download, external links, keyboard movement, pointer auto-travel, and mobile layout.

## 11. V1 Acceptance Criteria

The draft release is ready for art polish when:

- all 15 projects are reachable from the world and the fallback list;
- mouse selection moves the avatar to the selected project;
- arrows and WASD move the avatar along valid routes;
- E opens the active project;
- every project has a localized, shareable static route;
- browser language detection and the visible language toggle work and persist;
- the about page contains only the approved professional information;
- verified external links are surfaced on their related projects;
- real images are preferred and concept images are labeled;
- the supplied resume is updated and downloadable from a stable URL;
- GitHub Pages serves the site at the confirmed address;
- content validation, build tests, interaction tests, and responsive checks pass.

## 12. Deferred Art-Polish Phase

After the V1 interaction draft is published, a separate review will cover:

- final avatar silhouette and sprite-sheet cleanup;
- per-project environment props;
- more distinctive pipe tiles and junctions;
- real-image crop direction;
- concept-cover art direction;
- background depth and atmosphere;
- sound design, only if separately approved;
- richer arrival and project-opening animations;
- final typography and spacing adjustments.

These refinements must preserve the stable routes, data contract, controls, accessibility alternatives, and GitHub Pages deployment established in V1.
