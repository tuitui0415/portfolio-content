import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


class PlaceholderSiteTests(unittest.TestCase):
    def test_placeholder_homepage_uses_final_public_url(self):
        page = (ROOT / "index.html").read_text(encoding="utf-8")

        self.assertIn("https://tuitui0415.github.io/portfolio-content/", page)
        self.assertNotIn("sites.google.com/view/yunhanwei", page)

    def test_placeholder_homepage_is_bilingual_and_accessible(self):
        page = (ROOT / "index.html").read_text(encoding="utf-8")

        self.assertIn("作品集建设中", page)
        self.assertIn("Portfolio in progress", page)
        self.assertIn("<main", page)
        self.assertIn("lang=\"zh-CN\"", page)


if __name__ == "__main__":
    unittest.main()
