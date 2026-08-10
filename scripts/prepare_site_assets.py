from pathlib import Path
from shutil import copy2


ROOT = Path(__file__).resolve().parents[1]


def copy_required(source: Path, target: Path) -> None:
    if not source.exists():
        raise FileNotFoundError(f"Required site asset is missing: {source}")
    target.parent.mkdir(parents=True, exist_ok=True)
    copy2(source, target)


def main() -> None:
    copy_required(
        ROOT / "assets/resume/yunhan-wei-resume-zh.pdf",
        ROOT / "public/resume/yunhan-wei-resume-zh.pdf",
    )
    for source in sorted((ROOT / "assets/previews").glob("*.webp")):
        copy_required(source, ROOT / "public/generated/projects" / source.name)
    print("site assets: prepared")


if __name__ == "__main__":
    main()
