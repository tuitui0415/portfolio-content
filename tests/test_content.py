import json
import re
import sys
import tempfile
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from scripts.check_content import validate_repository


def write_json(path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def project(project_id="isolation", link_ids=None):
    return {
        "id": project_id,
        "title": {"zh": "隔离", "en": "Isolation"},
        "type": "solo-project",
        "status": "completed",
        "dates": {"start": "2021-12", "end": "2022-12"},
        "team": {"size": 1, "context": {"zh": "个人项目", "en": "Solo project"}},
        "roles": {"zh": ["游戏设计"], "en": ["Game Design"]},
        "tools": ["Unity"],
        "summary": {"zh": "叙事卡牌游戏。", "en": "A narrative card game."},
        "design": {"goals": {"zh": [], "en": []}, "mechanics": {"zh": [], "en": []}, "decisions": {"zh": [], "en": []}, "iteration": {"zh": [], "en": []}},
        "copy": {"resume": {"zh": [], "en": []}, "website": {"zh": "", "en": ""}, "full": {"zh": "", "en": ""}},
        "link_ids": link_ids or [],
        "sources": [],
        "questions": []
    }


def link(link_id="isolation-doc", project_id="isolation", url="https://example.com/isolation"):
    return {
        "id": link_id,
        "label": {"zh": "项目文档", "en": "Project document"},
        "url": url,
        "project_id": project_id,
        "type": "design-document",
        "access": "public",
        "checked_at": "2026-08-10",
        "evidence": "HTTP 200",
        "action": "keep"
    }


def make_fixture(projects=None, links=None):
    temp = tempfile.TemporaryDirectory()
    root = Path(temp.name)
    (root / "content" / "projects").mkdir(parents=True)
    for index, value in enumerate(projects or [project()]):
        write_json(root / "content" / "projects" / f"project-{index}.json", value)
    write_json(root / "content" / "external-links.json", links or [])
    return temp, root


def load_project_ids(root=ROOT):
    return {
        json.loads(path.read_text(encoding="utf-8"))["id"]
        for path in (root / "content" / "projects").glob("*.json")
    }


class ContentValidationTests(unittest.TestCase):
    def test_unknown_link_reference_is_rejected(self):
        temp, root = make_fixture(projects=[project(link_ids=["missing-link"])], links=[])
        self.addCleanup(temp.cleanup)
        self.assertIn("missing-link", "\n".join(validate_repository(root)))

    def test_duplicate_project_ids_are_rejected(self):
        temp, root = make_fixture(projects=[project(), project()], links=[])
        self.addCleanup(temp.cleanup)
        self.assertIn("duplicate project id", "\n".join(validate_repository(root)))

    def test_valid_fixture_has_no_errors(self):
        temp, root = make_fixture(projects=[project(link_ids=["isolation-doc"])], links=[link()])
        self.addCleanup(temp.cleanup)
        self.assertEqual(validate_repository(root), [])


if __name__ == "__main__":
    unittest.main()
