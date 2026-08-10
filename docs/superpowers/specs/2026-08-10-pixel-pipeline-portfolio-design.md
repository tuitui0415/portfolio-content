# Pixel Library Portfolio Design

## 1. Goal and Release Boundary

Build and publish Yunhan Wei's bilingual portfolio at:

`https://tuitui0415.github.io/portfolio-content/`

The site presents Yunhan as a pixel-art librarian whose archive contains every verified project. It must be understandable as a professional portfolio before it is understood as a game. The public release includes the landing page, designer dossier, playable chronological library, 15 bilingual project dossiers, language persistence, resume download, responsive layouts, accessibility fallbacks, automated validation, and GitHub Pages delivery.

The experience is original. It may borrow the density, lighting discipline, and animation confidence of cinematic pixel art, but it must not reproduce an existing game's characters, environments, UI, sounds, or level layouts.

## 2. Audience and Experience Priorities

Primary visitors are game studios, recruiters, designers, and technical collaborators. The experience follows four priorities in order:

1. A visitor can identify Yunhan, his discipline, and the two primary actions within five seconds.
2. A visitor can reach About, Resume, Contact, or any project without playing the game.
3. A visitor who chooses the journey receives a memorable, coherent interactive experience.
4. Motion and visual richness never make the site slow, confusing, or inaccessible.

## 3. Confirmed Art Direction

### 3.1 The Archive Explorer

Yunhan's on-site identity is an original librarian and archive explorer, not a generic hooded game character. The visual language uses detailed cinematic pixel art rather than oversized 8-bit blocks.

- Character reference scale: approximately 64 × 96 source pixels for the journey and a higher-resolution portrait treatment on the landing page.
- Clothing: dark green archive coat, warm brass accents, practical satchel or catalogue cards, and a contemporary silhouette.
- Animation states: idle, walk, run, jump anticipation, airborne, landing, inspect book, and portal entry.
- Motion uses stepped frame animation while camera and interface movement remain smooth.
- Character proportions, outfit, face, and poses are original.

### 3.2 Pixel Library World

The whole journey takes place inside an authored pixel-art library:

- deep forest green, aged paper, dark timber, brass, warm lamp light, and restrained red accents;
- tall shelves, rolling ladders, reading tables, catalogue drawers, archive stamps, windows, dust motes, and layered silhouettes;
- project portals appear as illuminated oversized archive books embedded in shelves;
- year markers are engraved into the floor and shelf plaques;
- category is shown through small shelf crests and accent colors, while chronology remains the primary spatial rule.

Text, navigation, and long-form content remain crisp HTML rather than rasterized pixel text. Pixel styling is reserved for imagery, borders, icons, transitions, and the interactive world.

### 3.3 Image Policy

Use verified project imagery before decorative imagery. Existing local screenshots, report pages, deck previews, and public project media are eligible. When no suitable real image exists, use an original code-authored pixel composition based only on verified project facts and label it `概念视觉 / Concept Visual`.

## 4. Information Architecture

### 4.1 Routes

- `/`: use a tiny inline preference/locale resolver to redirect to the localized landing page, with visible Chinese and English fallback links.
- `/zh/` and `/en/`: gateway landing page.
- `/zh/about/` and `/en/about/`: independent designer dossier.
- `/zh/journey/` and `/en/journey/`: playable chronological pixel library.
- `/zh/projects/<project-id>/` and `/en/projects/<project-id>/`: static project dossiers.
- `/resume/yunhan-wei-resume-zh.pdf`: stable resume download.

Every route is statically generated and must work when opened directly under the GitHub Pages base path `/portfolio-content/`.

### 4.2 Global Navigation

The upper-right navigation is always visible and contains:

- Home;
- Journey;
- About;
- Resume;
- Contact;
- Chinese/English toggle.

The language system first reads the saved choice, otherwise uses Chinese for Chinese browser locales and English for all other locales. Manual selection is stored locally and moves to the equivalent localized route.

## 5. Landing Page

The first viewport is a quiet archive entrance, not the game itself.

- A large animated librarian character is the visual focus.
- Clicking or activating the character opens the About dossier.
- The primary button reads `开始旅程 / BEGIN THE JOURNEY` and opens the journey.
- A short bilingual identity line introduces Yunhan as a game designer and developer without repeating a dense resume summary.
- The page includes subtle lamp glow, dust, foreground depth, and catalogue-card motion, all capped for performance and disabled in reduced-motion mode.
- Global navigation and language switching are immediately visible.

The two actions are visually distinct: the character means “meet the designer,” and the button means “explore the work.”

## 6. About: Designer Dossier

The About route resembles an open archival case file and contains:

- name and concise professional summary;
- UC Davis MSCS, completed June 2026 and graduated June 11, 2026;
- UC Santa Cruz B.S. in Computer Science: Computer Game Design;
- verified work, internship, and research experience;
- skills and languages;
- email, public phone number, GitHub, and website;
- resume preview and download action.

Age, gender, hometown, and availability remain resume-only and do not appear on the public About page. All contact links are selectable and keyboard accessible.

## 7. Journey: Chronological Library

### 7.1 Spatial Structure

The journey is one horizontally scrollable library corridor containing all 15 projects. Every project now has a confirmed date, so no undated annex is needed.

Projects are ordered from 2019 to 2026. Major year transitions create visually distinct library wings. Category plaques identify Game Design, Game Jam, Research, Technical, and UI/UX work without changing chronological order.

Each project station includes:

- an illuminated archive-book portal;
- localized title and date;
- a compact role/type label;
- a real image or labeled concept visual;
- an arrival card with summary and explicit open action.

### 7.2 T3 Dual-Layer Timeline

Chronology is expressed twice using the same project order:

1. Year marks and project stations are physically embedded in the library floor and shelves.
2. A collapsible catalogue timeline stays at the bottom of the viewport.

The catalogue can be dragged horizontally, scrolled, or navigated with arrow keys. Selecting a project moves the librarian and camera to its station. Current year, current project, and exploration progress remain visible. The catalogue never covers project descriptions or mobile controls.

### 7.3 Input and Movement

Keyboard:

- A/D or Left/Right moves;
- Space, W, or Up jumps;
- E or Enter opens the active project;
- Escape closes the arrival card or returns focus to the world.

Mouse and trackpad:

- clicking a project book or timeline node starts deterministic auto-travel;
- clicking the world does not cause unintended page navigation;
- arrival focuses the station and reveals the project card.

Touch:

- tap a station or timeline node to auto-travel;
- coarse-pointer devices show compact left, right, jump, and open controls;
- swiping the catalogue moves through the timeline without moving the browser page.

The librarian uses lightweight authored side-scroller movement with a constant floor, a small number of decorative platform zones, bounded horizontal speed, and deterministic jump arcs. Jumping through the active glowing book portal opens the project dossier. E/Enter and the visible open button provide equivalent non-precision access.

Auto-travel follows the shortest horizontal direction and stops at the selected station. It does not simulate complex platform navigation. Reduced-motion mode focuses the chosen station immediately instead of running the avatar across the world.

### 7.4 Return State

Opening a project saves the journey's active project and camera position in session storage. Returning to the journey restores that station. If storage is unavailable, the page starts at the first project.

## 8. Project Dossiers

Each bilingual project page is generated from `content/projects/*.json` and the central external-link registry. It shows only supported facts:

- title, type, date, status, and personal role;
- summary and project context;
- design goals, mechanics, decisions, iteration, and limitations when present;
- tools and team context;
- real gallery media and labeled concept visuals;
- verified GitHub, Drive, playable build, PDF, deck, Figma, or article links;
- previous/next project navigation and a return-to-library action.

Team attribution remains explicit. Raymond Kang's model work and the NSFW team's metrics are not presented as Yunhan's individual model-training results. Hardware limitations and missing evidence remain visible rather than being invented.

## 9. Technical Architecture

### 9.1 Stack

- Astro static site generation for localized, shareable routes.
- TypeScript for content normalization, language routing, and journey logic.
- A small native Canvas 2D module for the library renderer, avatar, camera, particles, and collision zones.
- Semantic HTML overlays for navigation, timeline, station cards, fallback project list, and all long-form content.
- CSS transitions and the View Transitions API where available, with normal navigation fallback.

React, PixiJS, GSAP, a backend, authentication, and a database are intentionally excluded. The smaller runtime reduces bundle size, animation overhead, and long-term maintenance.

### 9.2 Module Boundaries

- `content-loader`: validates and normalizes canonical JSON into bilingual view models.
- `route-builder`: generates localized About and project routes.
- `language-controller`: resolves, stores, and switches locale.
- `journey-layout`: converts chronological projects into year wings, stations, and timeline positions.
- `journey-engine`: owns player state, simple physics, auto-travel, camera, and active station.
- `journey-renderer`: draws the pixel library from engine state without owning behavior.
- `journey-ui`: owns DOM timeline, cards, touch controls, and accessible fallback list.

The engine and renderer communicate through plain serializable state. Timeline and station UI use project IDs, never duplicated project copy.

### 9.3 Data Flow

`content/` remains the canonical source of truth.

At build time:

1. run the existing Python content validator;
2. load profile, education, experience, projects, and external links;
3. normalize bilingual records and sort by confirmed project date;
4. generate localized routes and journey station data;
5. fail for missing IDs, duplicate routes, invalid dates, or unresolved link references.

The website does not maintain a second hand-edited project database.

## 10. Performance, Responsive Behavior, and Accessibility

- Landing and content routes render useful HTML without client JavaScript.
- Journey JavaScript loads only on the journey route and targets at most 120 KB gzip for site-authored code.
- Canvas device-pixel ratio is capped at 2 and animation pauses when hidden or offscreen.
- The journey targets smooth 60 fps on current desktop and mobile devices and degrades decorative particles before movement quality.
- Images use responsive dimensions, lazy loading, and optimized modern formats with fallbacks.
- Mobile rearranges the arrival card and catalogue vertically and enlarges touch targets to at least 44 CSS pixels.
- Every canvas action has a DOM control or project-list equivalent.
- Focus order, focus visibility, headings, link names, and color contrast are explicitly tested.
- `prefers-reduced-motion` disables parallax, particles, auto-running, camera easing, and elaborate transitions.
- Canvas initialization failure reveals the complete chronological DOM project list without blocking navigation.
- External links open safely with descriptive labels.

## 11. Error and Fallback Behavior

- Missing local media uses a labeled concept visual.
- Failed external media never removes the project summary or links.
- Local-storage or session-storage failure falls back to browser language and the first journey station.
- Unsupported View Transitions use standard page navigation.
- Canvas or WebGL capability is not required; the renderer uses Canvas 2D and a semantic HTML fallback.
- JavaScript-disabled visitors can browse About, Resume, the project list, and every project dossier.

## 12. Resume Workflow

The verified one-page Chinese resume is published at a stable URL and contains the confirmed website, education, experience, and project dates. Future replacements keep the same public filename so existing applications and links do not break.

## 13. Testing and Delivery

Automated checks cover:

- existing Python content validation and repository tests;
- bilingual view-model normalization and chronological sorting;
- language detection and persistence;
- route generation under the `/portfolio-content/` base path;
- journey movement, jump bounds, station activation, and auto-travel;
- direct access to both languages, About, several project pages, and the resume;
- keyboard-only and reduced-motion journeys;
- representative desktop, tablet, and mobile viewport layouts.

GitHub Actions validates content, builds the Astro site, uploads the Pages artifact, and deploys `main`. The existing public URL remains unchanged.

## 14. Acceptance Criteria

The release is complete when:

- the landing page clearly exposes About and Begin the Journey;
- the original librarian character and pixel library art direction are visually coherent;
- all 15 projects appear in chronological order in both the world and catalogue timeline;
- keyboard, mouse, touch, and visible fallback navigation reach every project;
- jumping into a selected archive book, pressing E/Enter, or using the open button reaches the same dossier;
- every project and About page is bilingual, static, shareable, and direct-load safe;
- language detection, visible switching, and preference persistence work;
- the resume downloads from its stable URL;
- motion respects reduced-motion settings;
- content, unit, interaction, accessibility, responsive, performance, and production-build checks pass;
- the verified build is published at `https://tuitui0415.github.io/portfolio-content/`.
