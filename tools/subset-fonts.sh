#!/bin/sh
# Galmuri11 서브셋 만들기. 화면에 픽셀 글꼴로 찍히는 글자(HTML·스크립트·스타일에 적힌 글자)만 남긴다.
# 문구를 고쳐 새 글자가 생기면 다시 돌린다. 안 돌리면 그 글자만 시스템 글꼴로 보인다.
#   준비: python3 -m pip install fonttools brotli
#   실행: tools/subset-fonts.sh        (pyftsubset 위치는 PYFTSUBSET 로 바꿀 수 있다)
set -e
cd "$(dirname "$0")/.."
PYFTSUBSET="${PYFTSUBSET:-pyftsubset}"
CHARS="$(mktemp)"
trap 'rm -f "$CHARS"' EXIT
# 주석은 화면에 안 찍히므로 뺀다
python3 - "$CHARS" <<'PY'
import re, sys
chars = set(map(chr, range(0x20, 0x7F)))
for path in ["index.html", "resume.html", "main.js", "game.js", "styles.css", "resume.css"]:
    s = open(path, encoding="utf-8").read()
    if path.endswith(".html"):
        s = re.sub(r"<!--.*?-->", "", s, flags=re.S)
    elif path.endswith(".css"):
        s = re.sub(r"/\*.*?\*/", "", s, flags=re.S)
    else:
        s = re.sub(r"(?m)^\s*//.*$", "", s)
        s = re.sub(r"\s//\s.*$", "", s, flags=re.M)
    chars.update(c for c in s if ord(c) >= 0x20)
open(sys.argv[1], "w", encoding="utf-8").write("".join(sorted(chars)))
print(f"글자 {len(chars)}개")
PY
for name in Galmuri11 Galmuri11-Bold; do
  "$PYFTSUBSET" "fonts-src/$name.woff2" --text-file="$CHARS" --flavor=woff2 \
    --layout-features='*' --output-file="assets/fonts/$name.subset.woff2"
  wc -c "assets/fonts/$name.subset.woff2"
done
