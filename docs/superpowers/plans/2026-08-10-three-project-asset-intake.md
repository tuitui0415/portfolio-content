# Three-Project Asset Intake Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish three evidence-backed portfolio projects, sanitize the soulslike level-design materials, and place small assets in GitHub while hosting the large gameplay video and cleaned UE source package on public Google Drive.

**Architecture:** Each project receives one normalized JSON record, one bilingual README, and a bounded asset directory. External evidence is registered centrally in `content/external-links.json`; large files never enter Git and are represented by anonymous-access-verified Drive links. Asset-hygiene tests enforce required local evidence, repository size limits, and the absence of recruitment-source wording.

**Tech Stack:** Python 3 standard library, existing repository validators, Poppler, PowerPoint/PPTX inspection tooling, `bsdtar`, ZIP, Git, GitHub, and Google Drive.

## Global Constraints

- Keep the original PDFs byte-for-byte unchanged; only give their GitHub copies stable filenames.
- Preserve the 11-slide soulslike deck's visual design and visible content.
- Remove recruitment-source traces from public filenames, paths, PPT metadata, notes, hidden text, and the cleaned archive.
- Never commit the original 7z, 396 MB gameplay video, or cleaned UE ZIP.
- Exclude `Saved/`, `Intermediate/`, `DerivedDataCache/`, compiled `Binaries/`, crash logs, autosaves, `Content/Developers/`, and third-party files without confirmed redistribution permission.
- Keep Raymond Kang's model-training contribution separate from Yunhan Wei's visualization and UX contribution.
- Preserve unknown facts as questions instead of inventing dates, metrics, ownership, or implementation details.
- All new external links must pass an anonymous no-cookie access check before being marked public.
- Do not modify or delete the user's original files.

---

## File Map

### Create

- `content/projects/multiplayer-xr-drone-game.json`
- `projects/multiplayer-xr-drone-game/README.md`
- `projects/multiplayer-xr-drone-game/assets/multiplayer-xr-drone-game-final-report.pdf`
- `content/projects/interpretable-nsfw-text-moderation.json`
- `projects/interpretable-nsfw-text-moderation/README.md`
- `projects/interpretable-nsfw-text-moderation/assets/interpretable-nsfw-text-moderation-report.pdf`
- `content/projects/mont-saint-michel-castle.json`
- `projects/mont-saint-michel-castle/README.md`
- `projects/mont-saint-michel-castle/technical-overview.md`
- `projects/mont-saint-michel-castle/package-readme.md`
- `projects/mont-saint-michel-castle/assets/mont-saint-michel-castle-level-design.pptx`
- `projects/mont-saint-michel-castle/assets/level-preview.png`
- `tests/test_asset_hygiene.py`

### Modify

- `content/external-links.json`
- `tests/test_content.py`
- `docs/external-link-audit.md`

### Temporary, never committed

- `/private/tmp/portfolio-intake-*/mont-saint-michel-castle-gameplay.mp4`
- `/private/tmp/portfolio-intake-*/mont-saint-michel-castle-ue-project/`
- `/private/tmp/portfolio-intake-*/mont-saint-michel-castle-ue-project.zip`
- PDF and PPT render directories.

---

### Task 1: Add Repository Asset-Hygiene Tests

**Files:**
- Create: `tests/test_asset_hygiene.py`
- Modify: `tests/test_content.py`

**Interfaces:**
- Consumes: repository root and the existing project JSON convention.
- Produces: tests that require the three project IDs, expected local assets, sub-100 MB tracked files, and recruitment-free soulslike public assets.

- [ ] **Step 1: Extend the project completeness expectation**

Add the three IDs to the completeness set:

```python
expected = {
    "rhythm-watershed",
    "modular-mining-game",
    "ue5-adaptive-music-system",
    "multiplayer-xr-drone-game",
    "interpretable-nsfw-text-moderation",
    "mont-saint-michel-castle",
}
```

- [ ] **Step 2: Add failing local-asset tests**

```python
import subprocess
import unittest
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
EXPECTED = {
    "multiplayer-xr-drone-game": ["assets/multiplayer-xr-drone-game-final-report.pdf"],
    "interpretable-nsfw-text-moderation": ["assets/interpretable-nsfw-text-moderation-report.pdf"],
    "mont-saint-michel-castle": [
        "assets/mont-saint-michel-castle-level-design.pptx",
        "assets/level-preview.png",
        "technical-overview.md",
        "package-readme.md",
    ],
}
BANNED = ("雷火", "秋招", "招聘", "应聘", "笔试", "面试", "岗位", "题目", "网易")


class PortfolioAssetHygieneTests(unittest.TestCase):
    def test_required_assets_exist(self):
        for project_id, paths in EXPECTED.items():
            for relative in paths:
                self.assertTrue((ROOT / "projects" / project_id / relative).is_file())

    def test_no_tracked_file_is_100mb_or_larger(self):
        paths = subprocess.check_output(["git", "ls-files", "-co", "--exclude-standard"], cwd=ROOT, text=True).splitlines()
        oversized = [path for path in paths if (ROOT / path).is_file() and (ROOT / path).stat().st_size >= 100_000_000]
        self.assertEqual(oversized, [])

    def test_soulslike_public_paths_and_text_are_recruitment_free(self):
        project = ROOT / "projects" / "mont-saint-michel-castle"
        for path in project.rglob("*"):
            self.assertFalse(any(term in str(path) for term in BANNED), str(path))
            if path.suffix.lower() in {".md", ".json", ".txt"}:
                text = path.read_text(encoding="utf-8")
                self.assertFalse(any(term in text for term in BANNED), str(path))

    def test_soulslike_pptx_xml_is_recruitment_free(self):
        pptx = ROOT / "projects" / "mont-saint-michel-castle" / "assets" / "mont-saint-michel-castle-level-design.pptx"
        with zipfile.ZipFile(pptx) as archive:
            xml = "\n".join(
                archive.read(name).decode("utf-8", errors="ignore")
                for name in archive.namelist()
                if name.endswith((".xml", ".rels"))
            )
        self.assertFalse(any(term in xml for term in BANNED))
```

- [ ] **Step 3: Run the focused tests and confirm failure**

Run:

```bash
python3 -m unittest tests.test_content.RepositoryCompletenessTests.test_new_agent_projects_are_imported -v
python3 -m unittest tests.test_asset_hygiene -v
```

Expected: failures for the three absent project records and local assets.

- [ ] **Step 4: Commit the failing tests**

```bash
git add tests/test_content.py tests/test_asset_hygiene.py
git commit -m "test: require new portfolio project assets"
```

---

### Task 2: Import the Multiplayer XR Drone Project

**Files:**
- Create: `content/projects/multiplayer-xr-drone-game.json`
- Create: `projects/multiplayer-xr-drone-game/README.md`
- Create: `projects/multiplayer-xr-drone-game/assets/multiplayer-xr-drone-game-final-report.pdf`
- Modify: `content/external-links.json`

**Interfaces:**
- Consumes: the 14-page report and its three public Drive demo URLs.
- Produces: project ID `multiplayer-xr-drone-game`, local report evidence, and link IDs `xr-drone-demo-gameplay`, `xr-drone-demo-alignment`, and `xr-drone-demo-plane-detection`.

- [ ] **Step 1: Copy the report without changing bytes**

```bash
mkdir -p projects/multiplayer-xr-drone-game/assets
cp "/Users/yunhanwei/Downloads/Project_Report-4.pdf" projects/multiplayer-xr-drone-game/assets/multiplayer-xr-drone-game-final-report.pdf
shasum -a 256 "/Users/yunhanwei/Downloads/Project_Report-4.pdf" projects/multiplayer-xr-drone-game/assets/multiplayer-xr-drone-game-final-report.pdf
```

Expected: the two SHA-256 values match.

- [ ] **Step 2: Add the normalized project record**

Record these verified facts:

```json
{
  "id": "multiplayer-xr-drone-game",
  "title": {
    "zh": "基于 ZED Camera 的多人 XR 无人机游戏",
    "en": "Multiplayer XR Drone Game Using ZED Camera"
  },
  "type": "solo-research-project",
  "status": "playable-research-prototype",
  "dates": {"start": "", "end": "", "context": {"zh": "UC Davis 2026 春季研究项目；报告未给出具体月份", "en": "UC Davis Spring 2026 research project; exact months are not stated in the report"}},
  "team": {"size": 1, "context": {"zh": "实验室环境中的个人工程项目，接受导师和实验室成员支持", "en": "Individual engineering project in a research lab with faculty and lab support"}},
  "tools": ["Unity", "C#", "ZED Camera", "ZED SDK", "Photon PUN", "CUDA"]
}
```

Use only report-supported design goals, mechanics, decisions, limitations, and results. Include the three demo link IDs and the local report path in `sources`.

- [ ] **Step 3: Write the bilingual project page**

Cover:

- spatial scale and yaw calibration;
- real-floor anchoring;
- robust multi-anchor similarity fitting and runtime refinement;
- host-authoritative Photon calibration snapshots;
- the playable calibration-to-combat loop;
- the limitation that physical drones were not yet fully operational.

- [ ] **Step 4: Register the three demo links**

Add the exact URLs from report references 10-12 with `access: "public"`, their verified titles, and `action: "keep"`.

- [ ] **Step 5: Verify the project**

Run:

```bash
pdfinfo projects/multiplayer-xr-drone-game/assets/multiplayer-xr-drone-game-final-report.pdf
python3 scripts/check_content.py
python3 -m unittest discover -s tests -v
git diff --check
```

Expected: 14 pages, content validation OK, and only the other two project asset tests remain failing.

- [ ] **Step 6: Commit**

```bash
git add content/projects/multiplayer-xr-drone-game.json content/external-links.json projects/multiplayer-xr-drone-game
git commit -m "feat: import multiplayer XR drone project"
```

---

### Task 3: Import the Interpretable NSFW Moderation Project

**Files:**
- Create: `content/projects/interpretable-nsfw-text-moderation.json`
- Create: `projects/interpretable-nsfw-text-moderation/README.md`
- Create: `projects/interpretable-nsfw-text-moderation/assets/interpretable-nsfw-text-moderation-report.pdf`
- Modify: `content/external-links.json`

**Interfaces:**
- Consumes: the 12-page team report and public Raymond branch.
- Produces: project ID `interpretable-nsfw-text-moderation` and link ID `nsfw-moderation-raymond-branch`.

- [ ] **Step 1: Copy and hash-check the report**

```bash
mkdir -p projects/interpretable-nsfw-text-moderation/assets
cp "/Users/yunhanwei/Downloads/Interpretable NSFW Text Moderation via RISE and Post‑hoc Concept Bottleneck Models-3.pdf" projects/interpretable-nsfw-text-moderation/assets/interpretable-nsfw-text-moderation-report.pdf
shasum -a 256 "/Users/yunhanwei/Downloads/Interpretable NSFW Text Moderation via RISE and Post‑hoc Concept Bottleneck Models-3.pdf" projects/interpretable-nsfw-text-moderation/assets/interpretable-nsfw-text-moderation-report.pdf
```

Expected: matching SHA-256 values.

- [ ] **Step 2: Add the team project record**

Set `team.size` to `2`. Limit Yunhan Wei's roles to:

```json
{
  "zh": ["可视化设计", "用户体验设计", "Streamlit 前端开发", "可用性研究工具设计"],
  "en": ["Visualization Design", "UX Design", "Streamlit Front-End Development", "Usability Study Instrument Design"]
}
```

Treat the 0.8705 validation accuracy and model-training details as team-system evidence, not Yunhan Wei's individual result. Leave the project date as an open question because the report and repository do not provide a reliable date.

- [ ] **Step 3: Write the bilingual project page**

Describe the dashboard's three confirmed outputs:

- RISE token-saliency heatmap;
- concept-activation bar chart;
- token-concept matrix.

Include observed UI limitations from the report, including tokenizer artifacts and concept imbalance, without claiming they were fully fixed.

- [ ] **Step 4: Register Raymond's public branch**

```text
https://github.com/RaymondHKang/ECS289HFinalProject/tree/raymondbranch
```

The label and project copy must say it is Raymond Kang's repository/branch and a team code source.

- [ ] **Step 5: Verify and commit**

```bash
pdfinfo projects/interpretable-nsfw-text-moderation/assets/interpretable-nsfw-text-moderation-report.pdf
python3 scripts/check_content.py
python3 -m unittest discover -s tests -v
git diff --check
git add content/projects/interpretable-nsfw-text-moderation.json content/external-links.json projects/interpretable-nsfw-text-moderation
git commit -m "feat: import interpretable NSFW moderation project"
```

Expected: 12 pages and only the soulslike asset test remains failing.

---

### Task 4: Import and Sanitize the Soulslike Presentation Assets

**Files:**
- Create: `content/projects/mont-saint-michel-castle.json`
- Create: `projects/mont-saint-michel-castle/README.md`
- Create: `projects/mont-saint-michel-castle/technical-overview.md`
- Create: `projects/mont-saint-michel-castle/package-readme.md`
- Create: `projects/mont-saint-michel-castle/assets/mont-saint-michel-castle-level-design.pptx`
- Create: `projects/mont-saint-michel-castle/assets/level-preview.png`

**Interfaces:**
- Consumes: extracted 11-slide PPT, AutoScreenshot, technical overview, and source archive inventory.
- Produces: project ID `mont-saint-michel-castle` and recruitment-free local portfolio assets.

- [ ] **Step 1: Copy the source deck under the stable public name**

The full XML and metadata scan found no recruitment keywords, so preserve the source bytes:

```bash
SOULS_ASSET_DIR=/private/tmp/mont-saint-michel-assets
mkdir -p "$SOULS_ASSET_DIR" projects/mont-saint-michel-castle/assets
bsdtar -xf "/Users/yunhanwei/Library/Containers/com.tencent.xinWeChat/Data/Documents/xwechat_files/wxid_ckhz7v89t3n122_23e9/msg/file/2026-08/LD_魏允瀚_雷火秋招_题目1.7z" -C "$SOULS_ASSET_DIR" "LD_魏允瀚_雷火秋招_题目1/演示文档.pptx" "LD_魏允瀚_雷火秋招_题目1/JiaoTang/Saved/AutoScreenshot.png"
cp "$SOULS_ASSET_DIR/LD_魏允瀚_雷火秋招_题目1/演示文档.pptx" projects/mont-saint-michel-castle/assets/mont-saint-michel-castle-level-design.pptx
cp "$SOULS_ASSET_DIR/LD_魏允瀚_雷火秋招_题目1/JiaoTang/Saved/AutoScreenshot.png" projects/mont-saint-michel-castle/assets/level-preview.png
```

Do not rewrite slide content or typography.

- [ ] **Step 2: Add the technical overview**

Write `technical-overview.md` with only these confirmed implementation facts:

- Unreal Engine 5.6;
- Blueprint-triggered elevator and water-level movement;
- one-way door using collision-trigger boundaries;
- Pawn Sensing-based enemy detection and material feedback;
- UE base-package character/enemy animations;
- BlockoutTools-assisted greyboxing.

- [ ] **Step 3: Add the future package README**

`package-readme.md` must explain:

- this is a cleaned project-specific source package;
- excluded caches/build outputs;
- UE template dependencies and BlockoutTools dependency;
- third-party assets remain owned by their licensors;
- the package may require dependencies to be restored before opening.

- [ ] **Step 4: Add the project JSON and bilingual README**

Record:

- type `solo-level-design-project`;
- status `playable-level-prototype`;
- date `2025-08`;
- tools `Unreal Engine 5.6`, `Blueprint`, and `BlockoutTools`;
- level-design evidence: linear route, weak guidance, shortcuts, water-level mechanism, stealth section, combat section, enemy zoning, and environmental storytelling.

Do not mention recruitment, applications, tests, employers, or job positions.

- [ ] **Step 5: Render and inspect every slide**

```bash
python3 /Users/yunhanwei/.codex/plugins/cache/openai-primary-runtime/presentations/26.805.11740/skills/Presentations/container_tools/render_slides.py projects/mont-saint-michel-castle/assets/mont-saint-michel-castle-level-design.pptx
python3 /Users/yunhanwei/.codex/plugins/cache/openai-primary-runtime/presentations/26.805.11740/skills/Presentations/container_tools/slides_test.py projects/mont-saint-michel-castle/assets/mont-saint-michel-castle-level-design.pptx
```

Inspect all 11 rendered slides against the source renders. Expected: same structure and no new clipping, overlap, missing media, or recruitment text.

- [ ] **Step 6: Run asset tests and commit**

```bash
python3 scripts/check_content.py
python3 -m unittest discover -s tests -v
git diff --check
git add content/projects/mont-saint-michel-castle.json projects/mont-saint-michel-castle
git commit -m "feat: import Mont Saint-Michel level design"
```

Expected: all local content and asset tests pass.

---

### Task 5: Build and Publish the Large Soulslike Assets

**Files:**
- Modify: `content/external-links.json`
- Modify: `projects/mont-saint-michel-castle/README.md`
- Create temporarily: cleaned video and UE ZIP under `/private/tmp`

**Interfaces:**
- Consumes: original 7z, `package-readme.md`, and official redistribution evidence.
- Produces: public Drive links `mont-saint-michel-gameplay-video` and `mont-saint-michel-ue-project`.

- [ ] **Step 1: Extract into a fresh temporary directory**

```bash
SOULS_BUILD_DIR="$(mktemp -d /private/tmp/mont-saint-michel-build.XXXXXX)"
bsdtar -xf "/Users/yunhanwei/Library/Containers/com.tencent.xinWeChat/Data/Documents/xwechat_files/wxid_ckhz7v89t3n122_23e9/msg/file/2026-08/LD_魏允瀚_雷火秋招_题目1.7z" -C "$SOULS_BUILD_DIR"
```

Do not delete or modify the original archive.

- [ ] **Step 2: Build a clean-root staging tree**

Set exact source and output paths:

```bash
SOURCE_ROOT="$SOULS_BUILD_DIR/LD_魏允瀚_雷火秋招_题目1/JiaoTang"
CLEAN_ROOT="$SOULS_BUILD_DIR/mont-saint-michel-castle-ue-project"
SOULS_VIDEO="$SOULS_BUILD_DIR/mont-saint-michel-castle-gameplay.mp4"
SOULS_ZIP="$SOULS_BUILD_DIR/mont-saint-michel-castle-ue-project.zip"
mkdir -p "$CLEAN_ROOT/Config" "$CLEAN_ROOT/Content/Variant_Combat" "$CLEAN_ROOT/Content/__ExternalActors__/Variant_Combat" "$CLEAN_ROOT/Content/__ExternalObjects__/Variant_Combat"
cp -R "$SOURCE_ROOT/Config/." "$CLEAN_ROOT/Config/"
cp "$SOURCE_ROOT/JiaoTang.uproject" "$CLEAN_ROOT/mont-saint-michel-castle.uproject"
find "$SOURCE_ROOT/Content" -maxdepth 1 -type f -exec cp {} "$CLEAN_ROOT/Content/" \;
cp "$SOURCE_ROOT/Content/Variant_Combat/Lvl_Combat.umap" "$CLEAN_ROOT/Content/Variant_Combat/"
cp -R "$SOURCE_ROOT/Content/__ExternalActors__/Variant_Combat/Lvl_Combat" "$CLEAN_ROOT/Content/__ExternalActors__/Variant_Combat/"
cp -R "$SOURCE_ROOT/Content/__ExternalObjects__/Variant_Combat/Lvl_Combat" "$CLEAN_ROOT/Content/__ExternalObjects__/Variant_Combat/"
cp projects/mont-saint-michel-castle/package-readme.md "$CLEAN_ROOT/README.md"
cp "$SOULS_BUILD_DIR/LD_魏允瀚_雷火秋招_题目1/2025-08-29 14-53-29.mp4" "$SOULS_VIDEO"
```

This allowlist excludes `Saved/`, `Intermediate/`, `DerivedDataCache/`, all plugin files, UE template asset payloads, `Content/Developers/`, compiled binaries, logs, and autosaves.

- [ ] **Step 3: Audit redistribution boundaries**

Use the current official [Unreal Engine EULA](https://www.unrealengine.com/eula/unreal) and [Epic Content License Agreement](https://www.unrealengine.com/eula/content) as the authority. The public ZIP must contain only the project-authored map, external actor/object records, root-level project Blueprints/assets, configuration, and dependency instructions. Do not include Epic template asset payloads or `Plugins/BlockoutToolsPlugin/`; list them as user-supplied dependencies.

- [ ] **Step 4: Scan the clean tree**

```bash
find "$CLEAN_ROOT" -print | rg -i '雷火|秋招|招聘|应聘|笔试|面试|岗位|题目|网易'
rg -uuu -l -i '雷火|秋招|招聘|应聘|笔试|面试|岗位|题目|网易' "$CLEAN_ROOT" -g '*.ini' -g '*.json' -g '*.txt' -g '*.md' -g '*.xml' -g '*.uproject' -g '*.uplugin'
```

Expected: no matches. Also assert the excluded directory names are absent.

- [ ] **Step 5: Create and validate the ZIP**

```bash
ditto -c -k --sequesterRsrc --keepParent "$CLEAN_ROOT" "$SOULS_ZIP"
unzip -t "$SOULS_ZIP"
shasum -a 256 "$SOULS_VIDEO" "$SOULS_ZIP"
```

Append the two external filenames, byte sizes, SHA-256 values, exclusions, and dependency notes to the `External Packages / 外部包` section of `projects/mont-saint-michel-castle/README.md`.

- [ ] **Step 6: Upload through Google Drive**

Use the connected Google Drive integration:

1. create or reuse `Portfolio Assets / Mont Saint-Michel Castle`;
2. upload the gameplay MP4 and cleaned UE ZIP;
3. set both to “anyone with the link can view”;
4. retrieve their canonical Drive URLs.

- [ ] **Step 7: Verify anonymous access and register links**

Run the repository's no-cookie checker against both URLs. Only after both return `public`, add them to `content/external-links.json` and the project README.

- [ ] **Step 8: Verify and commit**

```bash
python3 scripts/check_links.py --write
python3 scripts/check_content.py
python3 -m unittest discover -s tests -v
git diff --check
git add content/external-links.json docs/external-link-audit.md projects/mont-saint-michel-castle
git commit -m "feat: publish Mont Saint-Michel project assets"
```

---

### Task 6: Final Cross-Project Verification and Publish

**Files:**
- Verify all files created or modified by Tasks 1-5.

**Interfaces:**
- Consumes: completed local records, local evidence assets, and anonymous external links.
- Produces: clean `main` synchronized with `origin/main`.

- [ ] **Step 1: Run the complete validation suite**

```bash
python3 scripts/check_content.py
python3 -m unittest discover -s tests -v
git diff --check
git status -sb
```

Expected: content validation OK, all tests pass, no whitespace errors, and only intentional changes remain.

- [ ] **Step 2: Verify binary properties**

```bash
pdfinfo projects/multiplayer-xr-drone-game/assets/multiplayer-xr-drone-game-final-report.pdf
pdfinfo projects/interpretable-nsfw-text-moderation/assets/interpretable-nsfw-text-moderation-report.pdf
unzip -t projects/mont-saint-michel-castle/assets/mont-saint-michel-castle-level-design.pptx
find projects -type f -size +99M -print
```

Expected: PDF page counts 14 and 12, PPT package valid, and no GitHub project asset over 99 MB.

- [ ] **Step 3: Confirm source attribution and contribution boundaries**

Review the three JSON records and READMEs. Confirm:

- drone limitations are present;
- NSFW team responsibilities match the report;
- soulslike materials contain no recruitment origin;
- third-party dependencies are disclosed.

- [ ] **Step 4: Push and verify the remote**

```bash
git push origin main
git status -sb
git rev-parse HEAD
git ls-remote origin refs/heads/main
```

Expected: local and remote SHA match and `main...origin/main` is clean.
