import subprocess
import unittest
import zipfile
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


class AssetHygieneTests(unittest.TestCase):
    def test_expected_portfolio_assets_exist(self):
        expected = [
            ROOT / "projects/multiplayer-xr-drone-game/assets/multiplayer-xr-drone-game-final-report.pdf",
            ROOT / "projects/interpretable-nsfw-text-moderation/assets/interpretable-nsfw-text-moderation-report.pdf",
            ROOT / "projects/mont-saint-michel-castle/assets/mont-saint-michel-castle-level-design.pptx",
            ROOT / "projects/mont-saint-michel-castle/assets/level-preview.png",
            ROOT / "projects/mont-saint-michel-castle/technical-overview.md",
            ROOT / "projects/mont-saint-michel-castle/package-readme.md",
            ROOT / "assets/previews/vango.webp",
        ]
        for path in expected:
            self.assertTrue(path.is_file(), str(path))

    def test_no_tracked_file_reaches_github_size_limit(self):
        tracked = subprocess.run(
            ["git", "ls-files", "-z"],
            cwd=ROOT,
            check=True,
            capture_output=True,
        ).stdout.split(b"\0")
        oversized = []
        for raw_path in tracked:
            if not raw_path:
                continue
            path = ROOT / raw_path.decode()
            if path.is_file() and path.stat().st_size >= 100_000_000:
                oversized.append(str(path.relative_to(ROOT)))
        self.assertEqual(oversized, [])

    def test_level_design_assets_have_no_source_campaign_markers(self):
        project_root = ROOT / "projects/mont-saint-michel-castle"
        banned = ("雷火", "秋招", "招聘", "应聘", "笔试", "面试", "岗位", "题目", "网易")
        hits = []
        if not project_root.exists():
            self.fail(str(project_root))

        for path in project_root.rglob("*"):
            relative = str(path.relative_to(project_root))
            if any(term in relative for term in banned):
                hits.append(relative)
            if path.suffix.lower() in {".md", ".txt", ".json"}:
                text = path.read_text(encoding="utf-8")
                if any(term in text for term in banned):
                    hits.append(relative)
            if path.suffix.lower() == ".pptx":
                with zipfile.ZipFile(path) as archive:
                    for name in archive.namelist():
                        if not name.endswith(".xml"):
                            continue
                        text = archive.read(name).decode("utf-8", errors="ignore")
                        if any(term in text for term in banned):
                            hits.append(f"{relative}:{name}")
        self.assertEqual(hits, [])


if __name__ == "__main__":
    unittest.main()
