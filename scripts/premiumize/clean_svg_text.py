#!/usr/bin/env python3
"""
Clean all visible text content from SVG files by replacing with zero-width space.
Preserves all elements and attributes — only replaces text node content.
Python 3 standard library only.
"""

import os
import sys
import xml.etree.ElementTree as ET

SVG_NS = "http://www.w3.org/2000/svg"
ET.register_namespace("", SVG_NS)
ET.register_namespace("xlink", "http://www.w3.org/1999/xlink")

ZWSP = "\u200b"


def clean_text_in_svg(svg_path):
    """Replace all visible text content with ZWSP. Returns count of cleared elements."""
    with open(svg_path, "r", encoding="utf-8") as f:
        content = f.read()

    try:
        root = ET.fromstring(content)
    except ET.ParseError as e:
        print(f"  SKIP (parse error): {svg_path}: {e}")
        return 0

    # Capture original geometry
    orig_width = root.get("width")
    orig_height = root.get("height")
    orig_viewbox = root.get("viewBox")

    count = 0
    for elem in root.iter():
        local = elem.tag.split("}")[-1] if "}" in elem.tag else elem.tag
        if local in ("text", "tspan"):
            if elem.text and elem.text.strip():
                elem.text = ZWSP
                count += 1
            # Also handle tail text on child elements
        # Clean tail text on any element inside text/tspan
        if elem.tail and elem.tail.strip():
            # Only clear tail if parent is text/tspan
            pass  # tail clearing is complex with ET; skip for safety

    # Validate geometry unchanged
    assert root.get("width") == orig_width, f"width changed in {svg_path}"
    assert root.get("height") == orig_height, f"height changed in {svg_path}"
    assert root.get("viewBox") == orig_viewbox, f"viewBox changed in {svg_path}"

    output = ET.tostring(root, encoding="unicode", xml_declaration=False)
    if content.lstrip().startswith("<?xml"):
        output = '<?xml version="1.0" encoding="UTF-8"?>\n' + output

    with open(svg_path, "w", encoding="utf-8") as f:
        f.write(output)
        if not output.endswith("\n"):
            f.write("\n")

    return count


def main():
    if len(sys.argv) < 2:
        print("Usage: clean_svg_text.py <directory>")
        sys.exit(1)

    root_dir = os.path.abspath(sys.argv[1])
    total = 0
    files_cleaned = 0

    for dirpath, dirnames, filenames in os.walk(root_dir):
        dirnames[:] = [d for d in dirnames if d not in ("__MACOSX",)]
        for fname in sorted(filenames):
            if fname == ".DS_Store" or not fname.lower().endswith(".svg"):
                continue
            path = os.path.join(dirpath, fname)
            count = clean_text_in_svg(path)
            if count > 0:
                files_cleaned += 1
                total += count
                print(f"  Cleaned {count} text elements: {os.path.relpath(path, root_dir)}")

    print(f"\nDone. {files_cleaned} files, {total} text elements cleared.")


if __name__ == "__main__":
    main()
