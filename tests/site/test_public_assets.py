from pathlib import Path
import unittest

from pypdf import PdfReader


ROOT = Path(__file__).resolve().parents[2]


class PublicAssetTests(unittest.TestCase):
    def test_published_resume_is_the_verified_single_page_pdf(self):
        path = ROOT / "public/resume/yunhan-wei-resume-zh.pdf"
        self.assertTrue(path.exists())
        self.assertEqual(len(PdfReader(path).pages), 1)


if __name__ == "__main__":
    unittest.main()
