"""Shared utilities for rui-skill scripts."""

from pathlib import Path

import yaml


def parse_skill_md(skill_path: Path) -> tuple[str, str, str]:
    """Parse a SKILL.md file, returning (name, description, full_content).

    Uses PyYAML for frontmatter parsing (consistent with quick_validate.py)
    rather than a hand-rolled scanner — the prior approach broke on nested
    keys, escaped quotes, and YAML anchors.
    """
    content = (skill_path / "SKILL.md").read_text()

    if not content.startswith("---"):
        raise ValueError("SKILL.md missing frontmatter (no opening ---)")

    end_marker = content.find("\n---", 3)
    if end_marker == -1:
        raise ValueError("SKILL.md missing frontmatter (no closing ---)")

    frontmatter_text = content[3:end_marker].strip()
    frontmatter = yaml.safe_load(frontmatter_text) or {}
    if not isinstance(frontmatter, dict):
        raise ValueError("SKILL.md frontmatter must be a YAML mapping")

    name = str(frontmatter.get("name", "") or "")
    description = str(frontmatter.get("description", "") or "")

    return name, description, content