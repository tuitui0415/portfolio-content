#!/usr/bin/env python3
import argparse
import html
import json
import re
import socket
import urllib.error
import urllib.request
from datetime import date
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
LINKS_PATH = ROOT / "content" / "external-links.json"
AUDIT_PATH = ROOT / "docs" / "external-link-audit.md"
MAX_SAMPLE = 64 * 1024
RESTRICTED_MARKERS = (
    b"you need access",
    b"request access",
    b"sign in to continue",
    b"login to continue",
    "이 콘텐츠에 액세스하려면 로그인해야 합니다".encode("utf-8"),
    "로그인해야 합니다".encode("utf-8"),
)


def classify_response(status, headers, sample, url):
    if status == 0:
        return "unclear", sample.decode("utf-8", errors="ignore")[:200] or "transport failure"
    if status in {401, 403}:
        return "restricted", f"HTTP {status}"
    if status in {404, 410}:
        return "broken", f"HTTP {status}"
    if status < 200 or status >= 500:
        return "unclear", f"HTTP {status}"

    lowered = sample.lower()
    if any(marker in lowered for marker in RESTRICTED_MARKERS):
        return "restricted", f"HTTP {status}; explicit sign-in or access gate"
    if b"just a moment" in lowered and b"cloudflare" in lowered:
        return "unclear", f"HTTP {status}; anti-bot interstitial"

    content_type = headers.get("content-type", "")
    title_match = re.search(br"<title[^>]*>(.*?)</title>", sample, flags=re.I | re.S)
    if title_match:
        title = html.unescape(title_match.group(1).decode("utf-8", errors="ignore"))
        title = " ".join(title.split())[:120]
        return "public", f"HTTP {status}; title: {title}"
    return "public", f"HTTP {status}; content-type: {content_type or 'unknown'}"


def check_link(record, timeout=15.0):
    url = record["url"]
    if not url.startswith(("http://", "https://")):
        return {"access": record["access"], "evidence": "Non-HTTP public contact link."}

    request = urllib.request.Request(
        url,
        headers={
            "User-Agent": "Mozilla/5.0 (compatible; PortfolioLinkAudit/1.0)",
            "Accept": "text/html,application/xhtml+xml,application/pdf,*/*;q=0.8",
            "Range": f"bytes=0-{MAX_SAMPLE - 1}",
        },
    )
    try:
        with urllib.request.urlopen(request, timeout=timeout) as response:
            status = response.getcode() or 200
            headers = {key.lower(): value for key, value in response.headers.items()}
            sample = response.read(MAX_SAMPLE)
            final_url = response.geturl()
    except urllib.error.HTTPError as exc:
        status = exc.code
        headers = {key.lower(): value for key, value in exc.headers.items()} if exc.headers else {}
        sample = exc.read(MAX_SAMPLE)
        final_url = url
    except (urllib.error.URLError, TimeoutError, socket.timeout, OSError) as exc:
        status = 0
        headers = {}
        sample = str(exc).encode("utf-8", errors="ignore")
        final_url = url

    access, evidence = classify_response(status, headers, sample, final_url)
    if final_url != url:
        evidence += f"; redirected to {final_url[:180]}"
    return {"access": access, "evidence": evidence}


def recommended_action(record):
    if record["access"] == "public":
        return "keep"
    if record["access"] == "restricted":
        return "fix-sharing"
    if record["access"] == "broken":
        return "replace"
    return "manual-review"


def markdown_cell(value):
    return str(value).replace("|", "\\|").replace("\n", " ")


def write_audit(records):
    lines = [
        "# External Link Audit",
        "",
        f"Anonymous check date: {date.today().isoformat()}",
        "",
        "Checks use no cookies or credentials and read at most 64 KiB from each HTTP(S) response.",
        "",
        "| Link | Project | Type | Access | Evidence | Action |",
        "|---|---|---|---|---|---|",
    ]
    for record in records:
        label = record["label"]["en"] or record["label"]["zh"]
        lines.append(
            "| [{label}]({url}) | {project} | {type} | {access} | {evidence} | {action} |".format(
                label=markdown_cell(label),
                url=record["url"],
                project=markdown_cell(record["project_id"] or "-") ,
                type=markdown_cell(record["type"]),
                access=record["access"],
                evidence=markdown_cell(record["evidence"]),
                action=markdown_cell(record["action"]),
            )
        )
    AUDIT_PATH.parent.mkdir(parents=True, exist_ok=True)
    AUDIT_PATH.write_text("\n".join(lines) + "\n", encoding="utf-8")


def run(write=False):
    records = json.loads(LINKS_PATH.read_text(encoding="utf-8"))
    today = date.today().isoformat()
    for record in records:
        result = check_link(record)
        if result["access"] == "unclear" and record["access"] == "public":
            record["evidence"] = result["evidence"] + "; retained prior evidence-backed public status"
        else:
            record["access"] = result["access"]
            record["evidence"] = result["evidence"]
        record["checked_at"] = today
        record["action"] = recommended_action(record)
        print(f"{record['id']}: {record['access']} - {record['evidence']}")
    if write:
        LINKS_PATH.write_text(json.dumps(records, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        write_audit(records)
    return records


def main():
    parser = argparse.ArgumentParser(description="Audit portfolio links anonymously.")
    parser.add_argument("--write", action="store_true", help="write statuses and Markdown audit")
    args = parser.parse_args()
    run(write=args.write)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
