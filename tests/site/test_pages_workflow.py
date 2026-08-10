from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parents[2]


class PagesWorkflowTests(unittest.TestCase):
    def test_pages_workflow_validates_and_deploys_the_static_build(self):
        workflow = (ROOT / ".github/workflows/pages.yml").read_text(encoding="utf-8")
        self.assertIn("npm ci", workflow)
        self.assertIn("npm run build", workflow)
        self.assertIn("actions/upload-pages-artifact", workflow)
        self.assertIn("actions/deploy-pages", workflow)


if __name__ == "__main__":
    unittest.main()
