#!/usr/bin/env bash
# vendor-fonts.sh — bring the typefaces into the skill, subset and single-weight.
#
# DEV-ONLY. Nothing here runs when someone builds a book; it produces the
# `.subset.woff2` files that `src/fonts.ts` inlines, and those are committed.
#
# Why it exists: the kit declared Caveat and Barlow Condensed but shipped no font
# data, so the handwriting fell back to Comic Sans on any machine without them.
#
# Why subsetting rather than just copying (measured on this kit):
#   raw woff2               149.6 KB
#   subset + single weight   67.8 KB   -> 55% saved
#
# Caveat ships as a VARIABLE font spanning weight 400-700; instancing it to a
# single weight is where most of its saving comes from — plain glyph subsetting
# only took it 8% down, because its size was never about glyph coverage.
#
# Both faces are SIL Open Font License, which permits embedding and
# redistribution. That matters: this kit is handed to other people.
set -euo pipefail

HERE="$(cd "$(dirname "$0")/.." && pwd)"
SRC="${1:-$HERE/../../shared/sergas-brand/fonts/web}"
OUT="$HERE/assets/fonts"
mkdir -p "$OUT"

# Latin, Latin-1 supplement, smart quotes, dashes, bullet, ellipsis.
UNICODES="U+0020-007E,U+00A0-00FF,U+2018-201D,U+2022,U+2026,U+2013,U+2014,U+00B7"
FEATURES="kern,liga,calt"

subset() {  # subset <infile> <outfile>
  uvx --from "fonttools[woff]" pyftsubset "$1" \
    --output-file="$2" --flavor=woff2 \
    --unicodes="$UNICODES" --layout-features="$FEATURES" --no-hinting
}

echo "vendoring fonts from $SRC"

# Caveat: variable 400-700 -> pin to 500, then subset.
if [ -f "$SRC/Caveat.woff2" ]; then
  cp "$SRC/Caveat.woff2" "$OUT/Caveat.woff2"
  uvx --from "fonttools[woff]" python - "$OUT" <<'PY'
import sys
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
out = sys.argv[1]
f = TTFont(f'{out}/Caveat.woff2')
if 'fvar' in f:
    instancer.instantiateVariableFont(f, {'wght': 500}, inplace=True)
f.flavor = 'woff2'
f.save(f'{out}/Caveat.static.woff2')
PY
  subset "$OUT/Caveat.static.woff2" "$OUT/Caveat.subset.woff2"
  rm -f "$OUT/Caveat.static.woff2"
fi

for w in SemiBold Bold; do
  [ -f "$SRC/BarlowCondensed-$w.woff2" ] || continue
  cp "$SRC/BarlowCondensed-$w.woff2" "$OUT/BarlowCondensed-$w.woff2"
  subset "$OUT/BarlowCondensed-$w.woff2" "$OUT/BarlowCondensed-$w.subset.woff2"
done

# Only the subsets ship; the originals are working files.
rm -f "$OUT"/*[!t].woff2 2>/dev/null || true
ls -l "$OUT" | awk 'NR>1 {printf "  %-40s %6.1f KB\n", $9, $5/1024}'
