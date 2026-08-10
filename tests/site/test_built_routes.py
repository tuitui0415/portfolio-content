from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parents[2]


class BuiltRouteTests(unittest.TestCase):
    def test_static_build_contains_thirty_localized_project_pages(self):
        pages = list((ROOT / "dist").glob("*/projects/*/index.html"))
        self.assertEqual(len(pages), 30)


if __name__ == "__main__":
    unittest.main()
