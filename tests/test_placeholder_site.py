import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


class SiteSourceTests(unittest.TestCase):
    def test_root_route_uses_the_final_public_base(self):
        config = (ROOT / "astro.config.mjs").read_text(encoding="utf-8")
        self.assertIn("/portfolio-content", config)
        self.assertNotIn("sites.google.com/view/yunhanwei", config)

    def test_root_route_keeps_bilingual_fallback_navigation(self):
        page = (ROOT / "src/pages/index.astro").read_text(encoding="utf-8")
        self.assertIn("请选择语言", page)
        self.assertIn("Choose your language", page)
        self.assertIn("<main>", page)
        self.assertIn('lang="zh-CN"', page)


if __name__ == "__main__":
    unittest.main()
