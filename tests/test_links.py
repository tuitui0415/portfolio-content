import sys
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from scripts.check_links import classify_response


class LinkClassificationTests(unittest.TestCase):
    def test_404_is_broken(self):
        access, _ = classify_response(404, {}, b"", "https://example.test/missing")
        self.assertEqual(access, "broken")

    def test_sign_in_gate_is_restricted(self):
        sample = b"You need access. Sign in to continue."
        access, _ = classify_response(200, {}, sample, "https://drive.google.com/file/d/x/view")
        self.assertEqual(access, "restricted")

    def test_public_html_is_public(self):
        sample = b"<html><title>Playable Game</title><main>Start</main></html>"
        access, _ = classify_response(200, {"content-type": "text/html"}, sample, "https://example.test/game")
        self.assertEqual(access, "public")

    def test_transport_failure_is_unclear(self):
        access, _ = classify_response(0, {}, b"timed out", "https://example.test/slow")
        self.assertEqual(access, "unclear")


if __name__ == "__main__":
    unittest.main()
