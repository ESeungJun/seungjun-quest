#!/bin/sh
# Cloudflare Pages 에 올릴 dist 폴더를 만든다. 배포: ./build.sh && npx wrangler pages deploy
set -e
cd "$(dirname "$0")"
rm -rf dist
mkdir dist
cp -R index.html resume.html 404.html styles.css resume.css boot.js sprites.js lib.js main.js game.js \
  robots.txt sitemap.xml _headers data assets dist/
# 영상·음악 Range 응답은 _worker.js 가 맡고, 나머지는 정적 파일로 바로 나간다
cp worker.js dist/_worker.js
cat > dist/_routes.json <<'JSON'
{ "version": 1, "include": ["/assets/*.mp4", "/assets/*.m4a"], "exclude": [] }
JSON
find dist -name .DS_Store -delete
