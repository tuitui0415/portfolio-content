from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parents[2]


class SiteStructureTests(unittest.TestCase):
    def test_astro_build_targets_the_existing_pages_url(self):
        config = (ROOT / "astro.config.mjs").read_text(encoding="utf-8")
        self.assertIn("https://tuitui0415.github.io", config)
        self.assertIn("base: '/portfolio-content'", config)

    def test_root_route_has_visible_language_fallbacks(self):
        page = (ROOT / "src/pages/index.astro").read_text(encoding="utf-8")
        self.assertIn('href={`${base}/zh/`}', page)
        self.assertIn('href={`${base}/en/`}', page)


if __name__ == "__main__":
    unittest.main()
