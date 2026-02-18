#!/usr/bin/env python3
"""
Deterministic SVG premiumizer for NeuroBreath templates.
Python 3 standard library only. Idempotent.

Transforms:
  A) Replace visible text content with zero-width space (\u200b)
  B) Add rounded-corner clipPath
  C) Add subtle bevel/3D filter
  D) Conservative color enrichment (saturation + contrast boost)
"""

import argparse
import colorsys
import hashlib
import json
import os
import re
import sys
import xml.etree.ElementTree as ET

# ── Namespace handling ──────────────────────────────────────────────────────
SVG_NS = "http://www.w3.org/2000/svg"
XLINK_NS = "http://www.w3.org/1999/xlink"
NS_MAP = {
    "svg": SVG_NS,
    "xlink": XLINK_NS,
}

# Register namespaces so output doesn't get ns0: prefixes
ET.register_namespace("", SVG_NS)
ET.register_namespace("xlink", XLINK_NS)

ZWSP = "\u200b"

SKIP_FILES = {"__MACOSX", ".DS_Store"}


def clamp(v, lo, hi):
    return max(lo, min(hi, v))


# ── Color utilities ─────────────────────────────────────────────────────────

HEX3_RE = re.compile(r"^#([0-9a-fA-F]{3})$")
HEX6_RE = re.compile(r"^#([0-9a-fA-F]{6})$")
RGB_RE = re.compile(r"^rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$")
RGBA_RE = re.compile(r"^rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([0-9.]+)\s*\)$")


def parse_color(c):
    """Return (r, g, b) 0-255 or None."""
    c = c.strip()
    m = HEX3_RE.match(c)
    if m:
        h = m.group(1)
        return (int(h[0]*2, 16), int(h[1]*2, 16), int(h[2]*2, 16))
    m = HEX6_RE.match(c)
    if m:
        h = m.group(1)
        return (int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16))
    m = RGB_RE.match(c)
    if m:
        return (int(m.group(1)), int(m.group(2)), int(m.group(3)))
    m = RGBA_RE.match(c)
    if m:
        return (int(m.group(1)), int(m.group(2)), int(m.group(3)))
    return None


def color_to_hex(r, g, b):
    return f"#{r:02X}{g:02X}{b:02X}"


def enrich_color(r, g, b):
    """Conservative saturation + contrast boost. Preserves neutrals."""
    h, l, s = colorsys.rgb_to_hls(r/255, g/255, b/255)
    # Skip neutrals (low saturation)
    if s < 0.08:
        return None
    # Skip near-black and near-white
    if l < 0.06 or l > 0.94:
        return None
    # Boost saturation by ~12%, mild contrast
    new_s = clamp(s * 1.12, 0, 1.0)
    # Slight contrast: push lightness slightly away from 0.5
    if l > 0.5:
        new_l = clamp(l * 1.03, 0, 1.0)
    else:
        new_l = clamp(l * 0.97, 0, 1.0)
    nr, ng, nb = colorsys.hls_to_rgb(h, new_l, new_s)
    return (clamp(int(nr * 255), 0, 255),
            clamp(int(ng * 255), 0, 255),
            clamp(int(nb * 255), 0, 255))


def enrich_color_string(c):
    """Return enriched color string or None if unchanged."""
    c = c.strip()
    rgb = parse_color(c)
    if rgb is None:
        return None
    enriched = enrich_color(*rgb)
    if enriched is None:
        return None
    # Preserve original format type
    if c.startswith("rgba("):
        m = RGBA_RE.match(c)
        alpha = m.group(4)
        return f"rgba({enriched[0]},{enriched[1]},{enriched[2]},{alpha})"
    if c.startswith("rgb("):
        return f"rgb({enriched[0]},{enriched[1]},{enriched[2]})"
    return color_to_hex(*enriched)


# ── Style attribute color enrichment ────────────────────────────────────────

COLOR_PROPS = ["fill", "stroke", "stop-color"]
STYLE_COLOR_RE = re.compile(
    r"((?:fill|stroke|stop-color)\s*:\s*)(#[0-9a-fA-F]{3,6}|rgb\([^)]+\)|rgba\([^)]+\))",
    re.IGNORECASE
)


def enrich_style_attr(style_str):
    """Enrich colors in a style='...' string. Returns (new_style, count)."""
    count = 0
    def replacer(m):
        nonlocal count
        prefix = m.group(1)
        color = m.group(2)
        enriched = enrich_color_string(color)
        if enriched:
            count += 1
            return prefix + enriched
        return m.group(0)
    new_style = STYLE_COLOR_RE.sub(replacer, style_str)
    return new_style, count


# ── Geometry parsing ────────────────────────────────────────────────────────

def parse_viewbox(vb_str):
    """Parse viewBox string to (minX, minY, w, h) or None."""
    if not vb_str:
        return None
    parts = vb_str.replace(",", " ").split()
    if len(parts) != 4:
        return None
    try:
        return tuple(float(p) for p in parts)
    except ValueError:
        return None


def parse_numeric(val):
    """Parse a numeric dimension, stripping units."""
    if not val:
        return None
    m = re.match(r"([0-9.]+)", val.strip())
    if m:
        try:
            return float(m.group(1))
        except ValueError:
            return None
    return None


# ── ID generation ───────────────────────────────────────────────────────────

def safe_basename(path):
    """Create a safe ID component from a file path."""
    base = os.path.splitext(os.path.basename(path))[0]
    # Replace non-alphanumeric with hyphen
    return re.sub(r"[^a-zA-Z0-9]", "-", base)


def short_hash(path):
    return hashlib.sha1(path.encode()).hexdigest()[:8]


# ── SVG element helpers ─────────────────────────────────────────────────────

def tag(local):
    return f"{{{SVG_NS}}}{local}"


def get_or_create_defs(root):
    """Get or create <defs> as first child of root."""
    defs = root.find(tag("defs"))
    if defs is None:
        defs = ET.SubElement(root, tag("defs"))
        # Move to first position
        root.remove(defs)
        root.insert(0, defs)
    return defs


def collect_ids(root):
    """Collect all id attributes in the tree."""
    ids = set()
    for elem in root.iter():
        eid = elem.get("id")
        if eid:
            ids.add(eid)
    return ids


# ── Transform A: placeholder text → ZWSP ───────────────────────────────────

def clear_placeholder_text(root):
    """Replace visible text content in <text> and <tspan> with ZWSP."""
    cleared = []
    for elem in root.iter():
        local = elem.tag.split("}")[-1] if "}" in elem.tag else elem.tag
        if local in ("text", "tspan"):
            if elem.text and elem.text.strip():
                elem.text = ZWSP
                eid = elem.get("id")
                cleared.append(eid if eid else None)
    return cleared


# ── Transform B: rounded corners ────────────────────────────────────────────

def add_rounded_corners(root, vb, basename, existing_ids):
    """Add clipPath for rounded corners. Returns (applied, radius, clip_id)."""
    if vb is None:
        return False, 0, None

    min_x, min_y, vb_w, vb_h = vb
    min_dim = min(vb_w, vb_h)
    radius = clamp(min_dim * 0.04, 24, 80)

    clip_id = f"nb-premium-{basename}-clip"
    if clip_id in existing_ids:
        clip_id += f"-{short_hash(basename)}"

    defs = get_or_create_defs(root)

    clip_path = ET.SubElement(defs, tag("clipPath"))
    clip_path.set("id", clip_id)
    rect = ET.SubElement(clip_path, tag("rect"))
    rect.set("x", str(min_x))
    rect.set("y", str(min_y))
    rect.set("width", str(vb_w))
    rect.set("height", str(vb_h))
    rect.set("rx", str(round(radius, 2)))
    rect.set("ry", str(round(radius, 2)))

    # Wrap all non-defs children in a group with clip-path
    children = list(root)
    wrapper = ET.Element(tag("g"))
    wrapper.set("clip-path", f"url(#{clip_id})")

    for child in children:
        child_local = child.tag.split("}")[-1] if "}" in child.tag else child.tag
        if child_local == "defs":
            continue
        # Also preserve <title> and <desc> outside the clip group
        if child_local in ("title", "desc"):
            continue
        root.remove(child)
        wrapper.append(child)

    root.append(wrapper)

    return True, radius, clip_id


# ── Transform C: bevel filter ──────────────────────────────────────────────

def add_bevel_filter(root, basename, existing_ids, wrapper_group):
    """Add a subtle bevel filter and apply to wrapper group."""
    filter_id = f"nb-premium-{basename}-bevel"
    if filter_id in existing_ids:
        filter_id += f"-{short_hash(basename)}"

    defs = get_or_create_defs(root)

    filt = ET.SubElement(defs, tag("filter"))
    filt.set("id", filter_id)
    filt.set("x", "-2%")
    filt.set("y", "-2%")
    filt.set("width", "104%")
    filt.set("height", "104%")
    filt.set("color-interpolation-filters", "sRGB")

    # Merge source graphic
    merge = ET.SubElement(filt, tag("feMerge"))

    # Light shadow (highlight)
    ds1 = ET.SubElement(filt, tag("feDropShadow"))
    ds1.set("dx", "-1")
    ds1.set("dy", "-1")
    ds1.set("stdDeviation", "1.5")
    ds1.set("flood-color", "#FFFFFF")
    ds1.set("flood-opacity", "0.12")
    ds1.set("result", "highlight")

    # Dark shadow
    ds2 = ET.SubElement(filt, tag("feDropShadow"))
    ds2.set("dx", "1.5")
    ds2.set("dy", "1.5")
    ds2.set("stdDeviation", "2")
    ds2.set("flood-color", "#000000")
    ds2.set("flood-opacity", "0.10")
    ds2.set("result", "shadow")

    # Merge all
    merge2 = ET.SubElement(filt, tag("feMerge"))
    mn1 = ET.SubElement(merge2, tag("feMergeNode"))
    mn1.set("in", "shadow")
    mn2 = ET.SubElement(merge2, tag("feMergeNode"))
    mn2.set("in", "highlight")
    mn3 = ET.SubElement(merge2, tag("feMergeNode"))
    mn3.set("in", "SourceGraphic")

    # Remove the empty merge we created first
    defs_children = list(filt)
    filt.remove(merge)

    # Apply to wrapper
    if wrapper_group is not None:
        wrapper_group.set("filter", f"url(#{filter_id})")

    return True, filter_id


# ── Transform D: color enrichment ──────────────────────────────────────────

def enrich_colors(root):
    """Enrich fill/stroke/stop-color attributes and inline styles."""
    count = 0
    for elem in root.iter():
        # Direct attributes
        for prop in COLOR_PROPS:
            val = elem.get(prop)
            if val and val != "none" and not val.startswith("url("):
                enriched = enrich_color_string(val)
                if enriched:
                    elem.set(prop, enriched)
                    count += 1
        # Inline style
        style = elem.get("style")
        if style:
            new_style, sc = enrich_style_attr(style)
            if sc > 0:
                elem.set("style", new_style)
                count += sc
    return count


# ── Main transform pipeline ────────────────────────────────────────────────

def process_svg(svg_path, repo_root, report_file):
    """Process a single SVG file. Returns a log dict."""
    rel_path = os.path.relpath(svg_path, repo_root)
    basename = safe_basename(svg_path)

    log = {
        "svg_path": rel_path,
        "had_viewBox": False,
        "rounding_applied": False,
        "radius": None,
        "bevel_applied": False,
        "new_ids": [],
        "placeholder_text_cleared": 0,
        "placeholder_text_ids": [],
        "colors_modified_count": 0,
        "skip_reason": None,
    }

    # Read and parse
    with open(svg_path, "r", encoding="utf-8") as f:
        original_content = f.read()

    try:
        tree = ET.ElementTree(ET.fromstring(original_content))
    except ET.ParseError as e:
        log["skip_reason"] = f"XML parse error: {e}"
        return log

    root = tree.getroot()

    # Capture original geometry
    orig_width = root.get("width")
    orig_height = root.get("height")
    orig_viewbox = root.get("viewBox")

    # Capture original IDs
    orig_ids = collect_ids(root)

    # Parse geometry for transforms
    vb = parse_viewbox(orig_viewbox)
    if vb:
        log["had_viewBox"] = True
    else:
        # Try width/height
        w = parse_numeric(orig_width)
        h = parse_numeric(orig_height)
        if w and h:
            vb = (0, 0, w, h)

    existing_ids = collect_ids(root)

    # A) Clear placeholder text
    cleared = clear_placeholder_text(root)
    log["placeholder_text_cleared"] = len(cleared)
    log["placeholder_text_ids"] = [c for c in cleared if c is not None]

    # D) Color enrichment (before wrapping, so we process all elements)
    log["colors_modified_count"] = enrich_colors(root)

    # B) Rounded corners
    rounding_applied, radius, clip_id = add_rounded_corners(root, vb, basename, existing_ids)
    log["rounding_applied"] = rounding_applied
    if rounding_applied:
        log["radius"] = round(radius, 2)
        log["new_ids"].append(clip_id)
    if not rounding_applied and not vb:
        log["skip_reason"] = "No viewBox or usable width/height; rounding skipped"

    # Find wrapper group for bevel
    wrapper = None
    for child in root:
        if child.get("clip-path") and f"url(#{clip_id})" in (child.get("clip-path") or ""):
            wrapper = child
            break

    # C) Bevel filter
    bevel_applied, filter_id = add_bevel_filter(root, basename, existing_ids, wrapper)
    log["bevel_applied"] = bevel_applied
    if bevel_applied:
        log["new_ids"].append(filter_id)

    # ── VALIDATION ──────────────────────────────────────────────────────
    # Assert geometry unchanged
    assert root.get("width") == orig_width, f"width changed in {rel_path}"
    assert root.get("height") == orig_height, f"height changed in {rel_path}"
    assert root.get("viewBox") == orig_viewbox, f"viewBox changed in {rel_path}"

    # Assert all original IDs still present
    new_ids = collect_ids(root)
    missing = orig_ids - new_ids
    assert not missing, f"IDs lost in {rel_path}: {missing}"

    # Serialize
    output = ET.tostring(root, encoding="unicode", xml_declaration=False)
    # Ensure XML declaration if original had one
    if original_content.lstrip().startswith("<?xml"):
        output = '<?xml version="1.0" encoding="UTF-8"?>\n' + output

    # Assert parseable
    try:
        ET.fromstring(output if not output.startswith("<?xml") else output.split("?>", 1)[1].strip() if "?>" in output else output)
    except ET.ParseError:
        # Try parsing the full thing
        ET.fromstring(output.encode("utf-8"))

    with open(svg_path, "w", encoding="utf-8") as f:
        f.write(output)
        if not output.endswith("\n"):
            f.write("\n")

    return log


def main():
    parser = argparse.ArgumentParser(description="Premiumize SVG templates")
    parser.add_argument("--root", required=True, help="Templates root directory")
    parser.add_argument("--report", required=True, help="Path to JSONL report file")
    args = parser.parse_args()

    root_dir = os.path.abspath(args.root)
    report_path = os.path.abspath(args.report)
    repo_root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

    if not os.path.isdir(root_dir):
        print(f"ERROR: root directory not found: {root_dir}", file=sys.stderr)
        sys.exit(1)

    # Ensure report directory exists
    os.makedirs(os.path.dirname(report_path), exist_ok=True)

    svg_files = []
    for dirpath, dirnames, filenames in os.walk(root_dir):
        # Skip unwanted dirs
        dirnames[:] = [d for d in dirnames if d not in SKIP_FILES]
        for fname in sorted(filenames):
            if fname in SKIP_FILES:
                continue
            if fname.lower().endswith(".svg"):
                svg_files.append(os.path.join(dirpath, fname))
            # Explicitly skip manifests
            if fname in ("manifest.json", "manifest.nb-wallet.json"):
                continue

    svg_files.sort()

    print(f"Found {len(svg_files)} SVGs to process in {root_dir}")

    with open(report_path, "w", encoding="utf-8") as report:
        for svg_path in svg_files:
            log = process_svg(svg_path, repo_root, report)
            report.write(json.dumps(log, ensure_ascii=False) + "\n")
            status = "OK" if not log.get("skip_reason") else f"SKIP: {log['skip_reason']}"
            print(f"  [{status}] {log['svg_path']}")

    print(f"\nDone. {len(svg_files)} SVGs processed. Report: {report_path}")


if __name__ == "__main__":
    main()
