# Portfolio Content Rules

- Treat `content/` as the canonical source for future resume and website copy.
- Never invent roles, dates, team sizes, outcomes, metrics, or ownership.
- Preserve existing public external URLs; do not copy or re-upload large files unless the owner explicitly requests it.
- Record missing facts as precise questions in the relevant project's `questions` array.
- Keep project IDs and link IDs stable after publication.
- Run `python3 scripts/check_content.py` and `python3 -m unittest discover -s tests -v` after every content change.
- Link audits must be anonymous and bounded; never use credentials, cookies, or full large-file downloads.
