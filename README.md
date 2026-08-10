# Yunhan Wei · Pixel Library Portfolio

Source and canonical content for Yunhan Wei's bilingual game-design portfolio:

**https://tuitui0415.github.io/portfolio-content/**

The website is a static Astro application with a cinematic pixel-library entrance, an archive-style designer dossier, 30 localized project pages, and a playable chronological journey across all 15 projects. Visitors can use keyboard, mouse, touch, the draggable catalogue timeline, or the complete semantic project list.

## Structure

- `content/`: the only hand-edited source for profile, education, experience, projects, and external links.
- `src/`: Astro layouts, pages, content normalization, and the Canvas 2D journey.
- `assets/`: tracked canonical resume and approved project previews.
- `public/`: small static assets and stable public resume route.
- `projects/`: bilingual evidence and source notes for each project.
- `schemas/`: machine-readable content contracts.
- `scripts/`: content validation, link checks, and deterministic public-asset preparation.
- `tests/`: Python contracts, Vitest unit tests, and Playwright cross-platform checks.
- `docs/`: link audit, intake workflow, design specification, and implementation plan.

Resume and website updates should begin in this repository so dates, descriptions, links, and attribution remain synchronized.

## Local development

```bash
npm install
npm run dev
```

The public site uses the `/portfolio-content/` base path. Run the full local release gate with:

```bash
npm run verify
```

The verified Chinese resume source is `assets/resume/yunhan-wei-resume-zh.pdf`. The build publishes it at `/resume/yunhan-wei-resume-zh.pdf`. Project preview files in `assets/previews/` are copied into deterministic public paths during every build.

## Add a Project

Follow [`docs/project-intake.md`](docs/project-intake.md), then add or update the matching JSON file in `content/projects/`. Inspect existing public sources first, keep attribution explicit, record unknown facts as questions, and prefer existing public URLs for large files.

## Current Projects

The archive currently contains 15 dated project records from 2019 through 2026. Astro generates a Chinese and English dossier for every record and uses labeled concept visuals only when no approved screenshot or report preview exists.
