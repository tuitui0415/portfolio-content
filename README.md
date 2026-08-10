# Yunhan Wei Portfolio Content

Public source of truth for Yunhan Wei's portfolio facts, project descriptions, and existing external resources.

This repository is content-first. It does not duplicate large files already hosted on GitHub, Google Drive, Figma, itch.io, or project pages. Link status is checked anonymously and recorded in `docs/external-link-audit.md`.

## Structure

- `content/`: structured profile, education, experience, projects, and external links.
- `projects/`: bilingual human-readable project pages.
- `schemas/`: machine-readable content contracts.
- `scripts/`: offline content validation and bounded anonymous link checks.
- `docs/`: link audit and future project intake workflow.

Future resume and website projects should consume this repository rather than maintain separate copies of the same facts.

## Validate

```bash
python3 scripts/check_content.py
python3 -m unittest discover -s tests -v
```

Run the bounded anonymous link audit with `python3 scripts/check_links.py --write`.

## Add a Project

Follow [`docs/project-intake.md`](docs/project-intake.md). Inspect existing public sources first, record unknown facts as questions, and keep large files at their current public URLs.

## Current Projects

The initial import contains 11 project records. Complete evidence-backed pages currently exist for Rhythm Watershed, Modular Mining Game, and Isolation; the remaining pages expose known facts and precise questions for the owner.
