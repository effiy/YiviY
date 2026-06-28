#!/usr/bin/env python3
"""
generate-themes.py — Generate CDN theme CSS files from theme-factory .md definitions.

Reads .claude/theme-factory/themes/*.md, extracts 4-color palettes + font pairings,
then produces self-contained cdn/theme/<name>.css files with a complete set of
--yry-* CSS custom properties.

Usage:
    python3 cdn/theme/generate-themes.py

All color math is done at generation time — output CSS uses only static hex values
(no color-mix(), no oklch(), no runtime computation). Requires only Python stdlib.
"""

import colorsys
import os
import re
import shutil
from pathlib import Path

# ── Project root (script is at cdn/theme/generate-themes.py) ──────────────
ROOT = Path(__file__).resolve().parent.parent.parent
THEME_MD_DIR = ROOT / ".claude" / "theme-factory" / "themes"
OUT_DIR = ROOT / "cdn" / "theme"

# ── Font mapping: theme-factory font names → practical web font stacks ───
SANS_FALLBACK = (
    "'IBM Plex Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', "
    "system-ui, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', "
    "'Noto Sans CJK SC', sans-serif"
)
SERIF_FALLBACK = "Georgia, 'Times New Roman', 'Noto Serif CJK SC', serif"
MONO_FALLBACK = (
    "'JetBrains Mono', 'SF Mono', 'Fira Code', 'Cascadia Code', "
    "'Consolas', 'Source Code Pro', monospace"
)

FONT_MAP = {
    "DejaVu Sans": SANS_FALLBACK,
    "DejaVu Sans Bold": SANS_FALLBACK,
    "DejaVu Serif": SERIF_FALLBACK,
    "DejaVu Serif Bold": SERIF_FALLBACK,
    "FreeSans": SANS_FALLBACK,
    "FreeSans Bold": SANS_FALLBACK,
    "FreeSerif": SERIF_FALLBACK,
    "FreeSerif Bold": SERIF_FALLBACK,
}


# ── Helper: color math (stdlib only) ─────────────────────────────────────

def hex_to_rgb(h: str) -> tuple[int, int, int]:
    """Parse '#rrggbb' or '#rgb' → (R, G, B) 0–255."""
    h = h.lstrip("#")
    if len(h) == 3:
        h = "".join(c * 2 for c in h)
    return (int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16))


def rgb_to_hex(r: int, g: int, b: int) -> str:
    """Convert (R, G, B) 0–255 → '#rrggbb'."""
    return f"#{r:02x}{g:02x}{b:02x}"


def rgb_to_hls(r: int, g: int, b: int) -> tuple[float, float, float]:
    """RGB 0–255 → (H 0–1, L 0–1, S 0–1)."""
    return colorsys.rgb_to_hls(r / 255, g / 255, b / 255)


def hls_to_rgb(h: float, l: float, s: float) -> tuple[int, int, int]:
    """(H 0–1, L 0–1, S 0–1) → RGB 0–255."""
    r, g, b = colorsys.hls_to_rgb(h, l, s)
    return (round(r * 255), round(g * 255), round(b * 255))


def relative_luminance(r: int, g: int, b: int) -> float:
    """WCAG relative luminance (sRGB)."""
    def ch(v):
        v = v / 255
        return v / 12.92 if v <= 0.03928 else ((v + 0.055) / 1.055) ** 2.4
    return 0.2126 * ch(r) + 0.7152 * ch(g) + 0.0722 * ch(b)


def lighten(hex_color: str, amount: float) -> str:
    """Lighten a hex color by `amount` (0–1) in HLS space."""
    r, g, b = hex_to_rgb(hex_color)
    h, l, s = rgb_to_hls(r, g, b)
    l = min(1.0, l + amount)
    return rgb_to_hex(*hls_to_rgb(h, l, s))


def darken(hex_color: str, amount: float) -> str:
    """Darken a hex color by `amount` (0–1) in HLS space."""
    r, g, b = hex_to_rgb(hex_color)
    h, l, s = rgb_to_hls(r, g, b)
    l = max(0.0, l - amount)
    return rgb_to_hex(*hls_to_rgb(h, l, s))


def blend(hex_a: str, hex_b: str, ratio: float) -> str:
    """Linear interpolate between two hex colors.
    ratio=0.0 → pure A, ratio=1.0 → pure B."""
    ra, ga, ba = hex_to_rgb(hex_a)
    rb, gb, bb = hex_to_rgb(hex_b)
    r = round(ra + (rb - ra) * ratio)
    g = round(ga + (gb - ga) * ratio)
    b = round(ba + (bb - ba) * ratio)
    return rgb_to_hex(r, g, b)


def hex_to_rgb_tuple_str(hex_color: str) -> str:
    """'#rrggbb' → 'rr, gg, bb' (for --*-rgb variables)."""
    r, g, b = hex_to_rgb(hex_color)
    return f"{r}, {g}, {b}"


def saturate(hex_color: str, amount: float) -> str:
    """Adjust saturation by `amount` (-1 to 1) in HLS space."""
    r, g, b = hex_to_rgb(hex_color)
    h, l, s = rgb_to_hls(r, g, b)
    s = max(0.0, min(1.0, s + amount))
    return rgb_to_hex(*hls_to_rgb(h, l, s))


def hsl_color(hue: float, sat: float, light: float) -> str:
    """Create a color from HSL values (all 0–1)."""
    return rgb_to_hex(*hls_to_rgb(hue % 1.0, light, sat))


# ── Theme definitions ─────────────────────────────────────────────────────
# Each entry: (slug, [color0, color1, color2, color3], role_indices, font_header, font_body, is_dark_override)
# role_indices: {bg, accent, secondary, text} → index into colors list
# is_dark_override: if None, auto-detect from bg vs text luminance

THEMES = [
    {
        "slug": "ocean-depths",
        "colors": ["#1a2332", "#2d8b8b", "#a8dadc", "#f1faee"],
        "roles": {"bg": 0, "accent": 1, "secondary": 2, "text": 3},
        "font_header": "DejaVu Sans Bold",
        "font_body": "DejaVu Sans",
        "is_dark": None,  # auto-detect
    },
    {
        "slug": "sunset-boulevard",
        "colors": ["#e76f51", "#f4a261", "#e9c46a", "#264653"],
        "roles": {"bg": 2, "accent": 0, "secondary": 1, "text": 3},
        "font_header": "DejaVu Serif Bold",
        "font_body": "DejaVu Sans",
        "is_dark": None,
    },
    {
        "slug": "forest-canopy",
        "colors": ["#2d4a2b", "#7d8471", "#a4ac86", "#faf9f6"],
        "roles": {"bg": 0, "accent": 2, "secondary": 1, "text": 3},
        "font_header": "FreeSerif Bold",
        "font_body": "FreeSans",
        "is_dark": True,  # dark green bg → dark theme
    },
    {
        "slug": "modern-minimalist",
        "colors": ["#36454f", "#708090", "#d3d3d3", "#ffffff"],
        "roles": {"bg": 3, "accent": 0, "secondary": 1, "text": 0},
        "font_header": "DejaVu Sans Bold",
        "font_body": "DejaVu Sans",
        "is_dark": None,
    },
    {
        "slug": "golden-hour",
        "colors": ["#f4a900", "#c1666b", "#d4b896", "#4a403a"],
        "roles": {"bg": 2, "accent": 0, "secondary": 1, "text": 3},
        "font_header": "FreeSans Bold",
        "font_body": "FreeSans",
        "is_dark": None,
    },
    {
        "slug": "arctic-frost",
        "colors": ["#d4e4f7", "#4a6fa5", "#c0c0c0", "#fafafa"],
        "roles": {"bg": 3, "accent": 1, "secondary": 0, "text": 1},
        "font_header": "DejaVu Sans Bold",
        "font_body": "DejaVu Sans",
        "is_dark": None,
    },
    {
        "slug": "desert-rose",
        "colors": ["#d4a5a5", "#b87d6d", "#e8d5c4", "#5d2e46"],
        "roles": {"bg": 2, "accent": 0, "secondary": 1, "text": 3},
        "font_header": "FreeSans Bold",
        "font_body": "FreeSans",
        "is_dark": None,
    },
    {
        "slug": "tech-innovation",
        "colors": ["#0066ff", "#00ffff", "#1e1e1e", "#ffffff"],
        "roles": {"bg": 2, "accent": 0, "secondary": 1, "text": 3},
        "font_header": "DejaVu Sans Bold",
        "font_body": "DejaVu Sans",
        "is_dark": True,
    },
    {
        "slug": "midnight-galaxy",
        "colors": ["#2b1e3e", "#4a4e8f", "#a490c2", "#e6e6fa"],
        "roles": {"bg": 0, "accent": 1, "secondary": 2, "text": 3},
        "font_header": "FreeSans Bold",
        "font_body": "FreeSans",
        "is_dark": True,
    },
    {
        "slug": "botanical-garden",
        "colors": ["#4a7c59", "#f9a620", "#b7472a", "#f5f3ed"],
        "roles": {"bg": 3, "accent": 0, "secondary": 1, "text": 2},
        "font_header": "DejaVu Serif Bold",
        "font_body": "DejaVu Sans",
        "is_dark": None,
    },
]


# ── Semantic color generation ─────────────────────────────────────────────

def generate_semantic_colors(accent_hex: str, is_dark: bool) -> dict:
    """Generate semantic colors (pass/fail/warn/cyan/violet) based on theme mode.

    For dark themes: brighter, more saturated (visible on dark backgrounds).
    For light themes: deeper, more saturated (visible on light backgrounds).
    """
    # Use fixed, well-known hues for semantic meaning, adjusted per mode
    if is_dark:
        return {
            "pass": "#22c55e",       # green
            "fail": "#ef4444",       # red
            "warn": "#f59e0b",       # amber
            "cyan": "#22d3ee",       # cyan
            "violet": "#a78bfa",     # violet
            "blue": "#3b82f6",       # blue
            "amber": "#f59e0b",      # amber
            "purple": "#a78bfa",     # purple
        }
    else:
        return {
            "pass": "#16a34a",       # darker green for light bg
            "fail": "#dc2626",       # darker red
            "warn": "#d97706",       # darker amber
            "cyan": "#0891b2",       # darker cyan
            "violet": "#7c3aed",     # darker violet
            "blue": "#2563eb",       # darker blue
            "amber": "#d97706",      # darker amber
            "purple": "#7c3aed",     # darker purple
        }


# ── Theme CSS generation ──────────────────────────────────────────────────

def generate_theme_css(theme: dict) -> str:
    """Generate a complete CSS theme file from a theme definition."""
    slug = theme["slug"]
    colors = theme["colors"]
    roles = theme["roles"]

    bg = colors[roles["bg"]]
    accent = colors[roles["accent"]]
    secondary = colors[roles["secondary"]]
    text = colors[roles["text"]]

    # Determine dark/light mode
    if theme["is_dark"] is not None:
        is_dark = theme["is_dark"]
    else:
        lum_bg = relative_luminance(*hex_to_rgb(bg))
        lum_text = relative_luminance(*hex_to_rgb(text))
        is_dark = lum_bg < lum_text

    mode_label = "dark" if is_dark else "light"

    # Surface tokens: bg → progressively elevated surfaces
    if is_dark:
        bg_card = bg
        bg_flat = darken(bg, 0.04)
        bg_raised = lighten(bg, 0.06)
        bg_overlay = lighten(bg, 0.10)
    else:
        bg_card = bg
        bg_flat = darken(bg, 0.03)
        bg_raised = lighten(bg, 0.01) if bg != "#ffffff" else "#ffffff"
        bg_overlay = lighten(bg, 0.03) if bg != "#ffffff" else "#ffffff"

    # Text tokens: text → progressively muted toward bg
    text_primary = text
    text_soft = blend(text, bg, 0.30) if is_dark else blend(text, bg, 0.25)
    text_muted = blend(text, bg, 0.50) if is_dark else blend(text, bg, 0.45)

    # Accent tokens
    accent_rgb = hex_to_rgb_tuple_str(accent)
    accent_soft = blend(accent, bg, 0.82)  # heavily blended toward bg

    # Semantic colors
    sem = generate_semantic_colors(accent, is_dark)

    # Gray scale (derived from text→bg blend)
    gray_pale = text_soft
    gray_soft = text_muted
    gray = blend(text, bg, 0.65) if is_dark else blend(text, bg, 0.55)

    # Border
    if is_dark:
        border_color = lighten(bg, 0.15)
    else:
        border_color = darken(bg, 0.12)

    # Shadows: dark themes use bg-color tinted shadows; light themes use black
    if is_dark:
        bg_r, bg_g, bg_b = hex_to_rgb(bg)
        shadow = f"0 1px 3px rgba({bg_r},{bg_g},{bg_b}, 0.4), 0 1px 2px rgba({bg_r},{bg_g},{bg_b}, 0.3)"
        shadow_lg = f"0 10px 25px rgba({bg_r},{bg_g},{bg_b}, 0.5)"
    else:
        shadow = "0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04)"
        shadow_lg = "0 10px 25px rgba(0, 0, 0, 0.08)"

    # Fonts
    font_header = FONT_MAP.get(theme["font_header"], SANS_FALLBACK)
    font_body = FONT_MAP.get(theme["font_body"], SANS_FALLBACK)

    # Build display name
    display_name = slug.replace("-", " ").title()

    # ── Assemble CSS ──────────────────────────────────────────────────
    css = f"""/* ═══════════════════════════════════════════════════════════════════════════
   YrY CDN Theme — {display_name}
   Mode: {mode_label}
   Generated from theme-factory palette by generate-themes.py.

   Colors:
     Background   {bg}
     Accent       {accent}
     Secondary    {secondary}
     Text         {text}

   Fonts:
     Headers  {theme["font_header"]}
     Body     {theme["font_body"]}

   This file is self-contained — all values are static hex.
   Load it on any page to set --yry-* design tokens on :root.
   ═══════════════════════════════════════════════════════════════════════════ */

:root {{
    /* ── Surface ──────────────────────────────────────── */
    --yry-bg-card:        {bg_card};
    --yry-bg-flat:        {bg_flat};
    --yry-bg-raised:      {bg_raised};
    --yry-bg-overlay:     {bg_overlay};

    /* ── Text ─────────────────────────────────────────── */
    --yry-text:           {text_primary};
    --yry-text-soft:      {text_soft};
    --yry-text-muted:     {text_muted};
    --yry-text-heading:   {text_primary};

    /* ── Accent ───────────────────────────────────────── */
    --yry-accent:         {accent};
    --yry-accent-rgb:     {accent_rgb};
    --yry-accent-soft:    {accent_soft};

    /* ── Semantic ─────────────────────────────────────── */
    --yry-pass:           {sem["pass"]};
    --yry-pass-rgb:       {hex_to_rgb_tuple_str(sem["pass"])};
    --yry-fail:           {sem["fail"]};
    --yry-fail-rgb:       {hex_to_rgb_tuple_str(sem["fail"])};
    --yry-warn:           {sem["warn"]};
    --yry-warn-rgb:       {hex_to_rgb_tuple_str(sem["warn"])};
    --yry-cyan:           {sem["cyan"]};
    --yry-cyan-rgb:       {hex_to_rgb_tuple_str(sem["cyan"])};
    --yry-violet:         {sem["violet"]};
    --yry-violet-rgb:     {hex_to_rgb_tuple_str(sem["violet"])};
    --yry-blue:           {sem["blue"]};
    --yry-amber:          {sem["amber"]};
    --yry-purple:         {sem["purple"]};
    --yry-info:           {text_muted};

    /* ── Grays ────────────────────────────────────────── */
    --yry-gray-pale:      {gray_pale};
    --yry-gray-soft:      {gray_soft};
    --yry-gray:           {gray};

    /* ── Border & Shadow ──────────────────────────────── */
    --yry-border-color:   {border_color};
    --yry-border:         1px solid {border_color};
    --yry-shadow:         {shadow};
    --yry-shadow-lg:      {shadow_lg};

    /* ── Shape ────────────────────────────────────────── */
    --yry-radius:         8px;
    --yry-radius-sm:      6px;
    --yry-radius-lg:      12px;
    --yry-radius-full:    9999px;

    /* ── Animation ────────────────────────────────────── */
    --yry-ease-out:       cubic-bezier(0, 0, 0.2, 1);
    --yry-ease-in:        cubic-bezier(0.4, 0, 1, 1);
    --yry-duration-fast:  150ms;
    --yry-duration-normal: 200ms;
    --yry-duration-slow:  300ms;

    /* ── Fonts ────────────────────────────────────────── */
    --yry-font-sans:      {font_body};
    --yry-font-mono:      {MONO_FALLBACK};
}}
"""
    return css


# ── Main ──────────────────────────────────────────────────────────────────

def main():
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    for theme in THEMES:
        css = generate_theme_css(theme)
        out_path = OUT_DIR / f"{theme['slug']}.css"
        out_path.write_text(css)
        print(f"  ✓  {out_path.relative_to(ROOT)}")

    # Copy modern-minimalist as default.css
    default_src = OUT_DIR / "modern-minimalist.css"
    default_dst = OUT_DIR / "default.css"
    shutil.copy(default_src, default_dst)
    print(f"  ✓  {default_dst.relative_to(ROOT)} (default → modern-minimalist)")

    print(f"\nGenerated {len(THEMES)} themes + default.css in {OUT_DIR.relative_to(ROOT)}/")


if __name__ == "__main__":
    main()
