# New Project Intake

Use this workflow whenever a new project is added.

## 1. Provide Sources First

Send any existing GitHub repository, Google Drive file or folder, Figma file, itch.io page, playable build, video, design document, screenshots, or previous write-up. Existing public resources should remain at their current URLs.

## 2. Source Review

Before drafting copy, inspect the supplied material and separate:

- verified facts;
- the owner's personal contribution;
- team or third-party work;
- claims that still need confirmation;
- links that are public, restricted, broken, or unclear.

## 3. Questions

Ask one question at a time until these facts are clear:

1. What is the official Chinese and English project name?
2. What type of project is it, and when was it developed?
3. Was it solo or team work? How large was the team?
4. What was Yunhan Wei's exact role and contribution boundary?
5. What player experience or problem was the project trying to create or solve?
6. What are the core mechanics, interactions, level flow, or system loops?
7. What key design decisions were made, and why?
8. How did playtesting or iteration change the result?
9. What is complete, playable, published, tested, or still unfinished?
10. Which tools, engines, languages, and platforms were used?
11. Which public links and assets may be shown?
12. Who owns the code, art, audio, footage, and documents?

## 4. Outputs

After factual approval, create:

- a normalized `content/projects/<id>.json` record;
- a bilingual `projects/<id>/README.md` page;
- one or two concise resume bullets;
- a medium-length website summary;
- a full evidence-backed project description;
- external-link records and an updated anonymous-access audit.

## 5. Verification

Run:

```bash
python3 scripts/check_content.py
python3 -m unittest discover -s tests -v
```

Do not update a resume or website until the project record and open questions have been reviewed by the owner.
