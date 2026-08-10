#!/usr/bin/env python3
import json
import re
import sys
from pathlib import Path


PROJECT_KEYS = {
    "id", "title", "type", "status", "dates", "team", "roles", "tools",
    "summary", "design", "copy", "link_ids", "sources", "questions"
}
LINK_KEYS = {
    "id", "label", "url", "project_id", "type", "access", "checked_at",
    "evidence", "action"
}
ACCESS_VALUES = {"public", "restricted", "broken", "unclear"}
ID_PATTERN = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")
DATE_PATTERN = re.compile(r"^\d{4}-\d{2}-\d{2}$")


def load_json(path):
    return json.loads(Path(path).read_text(encoding="utf-8"))


def _language_value(value, key):
    return isinstance(value, dict) and isinstance(value.get(key), str)


def validate_repository(root):
    root = Path(root)
    errors = []
    project_paths = sorted((root / "content" / "projects").glob("*.json"))
    link_path = root / "content" / "external-links.json"
    projects = []
    links = []

    for path in project_paths:
        try:
            projects.append((path, load_json(path)))
        except (OSError, json.JSONDecodeError) as exc:
            errors.append(f"{path}: invalid JSON: {exc}")

    if link_path.is_file():
        try:
            value = load_json(link_path)
            if isinstance(value, list):
                links = value
            else:
                errors.append(f"{link_path}: expected a JSON array")
        except (OSError, json.JSONDecodeError) as exc:
            errors.append(f"{link_path}: invalid JSON: {exc}")

    project_ids = []
    for path, item in projects:
        missing = PROJECT_KEYS - set(item) if isinstance(item, dict) else PROJECT_KEYS
        if missing:
            errors.append(f"{path}: missing project keys: {', '.join(sorted(missing))}")
            continue
        project_id = item["id"]
        project_ids.append(project_id)
        if not isinstance(project_id, str) or not ID_PATTERN.fullmatch(project_id):
            errors.append(f"{path}: invalid project id {project_id!r}")
        if not _language_value(item["title"], "zh") or not item["title"]["zh"].strip():
            errors.append(f"{project_id}: missing Chinese title")
        if not _language_value(item["summary"], "zh") or not item["summary"]["zh"].strip():
            errors.append(f"{project_id}: missing Chinese summary")
        if not isinstance(item["link_ids"], list):
            errors.append(f"{project_id}: link_ids must be an array")

    seen_projects = set()
    for project_id in project_ids:
        if project_id in seen_projects:
            errors.append(f"duplicate project id: {project_id}")
        seen_projects.add(project_id)

    link_ids = []
    urls = []
    for item in links:
        if not isinstance(item, dict):
            errors.append("external-links.json: every item must be an object")
            continue
        missing = LINK_KEYS - set(item)
        if missing:
            errors.append(f"link {item.get('id', '<unknown>')}: missing keys: {', '.join(sorted(missing))}")
            continue
        link_id = item["id"]
        link_ids.append(link_id)
        urls.append(item["url"])
        if not isinstance(link_id, str) or not ID_PATTERN.fullmatch(link_id):
            errors.append(f"invalid link id: {link_id!r}")
        if item["project_id"] and item["project_id"] not in seen_projects:
            errors.append(f"{link_id}: unknown project id {item['project_id']}")
        if item["access"] not in ACCESS_VALUES:
            errors.append(f"{link_id}: invalid access {item['access']!r}")
        if item["checked_at"] and not DATE_PATTERN.fullmatch(item["checked_at"]):
            errors.append(f"{link_id}: checked_at must be YYYY-MM-DD")

    for value, label in ((link_ids, "link id"), (urls, "URL")):
        seen = set()
        for entry in value:
            if entry in seen:
                errors.append(f"duplicate {label}: {entry}")
            seen.add(entry)

    link_id_set = set(link_ids)
    for _, item in projects:
        if not isinstance(item, dict) or "link_ids" not in item:
            continue
        for link_id in item["link_ids"]:
            if link_id not in link_id_set:
                errors.append(f"{item.get('id', '<unknown>')}: unknown link id {link_id}")

    return errors


def main():
    root = Path(__file__).resolve().parents[1]
    errors = validate_repository(root)
    if errors:
        for error in errors:
            print(error, file=sys.stderr)
        return 1
    print("content validation: OK")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
