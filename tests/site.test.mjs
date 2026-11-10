// 내용 점검: 같은 사실이 여러 파일에 적혀 있으므로 서로 어긋나면 여기서 잡는다. 실행: node --test tests/
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const read = (f) => fs.readFileSync(new URL(`../${f}`, import.meta.url), "utf8");
const index = read("index.html");
const resume = read("resume.html");
const game = read("game.js");
const css = read("styles.css");
const visible = (html) => html.replace(/<!--.*?-->/gs, "").replace(/<script[^>]*>.*?<\/script>/gs, "");

test("성과 수치 4개가 타이틀·성과 섹션·이력서·게임에 같은 값으로 있다", () => {
  for (const [label, value] of [["일 시청", "11만"], ["결제 전환율", "×2"], ["UP하기 매출", "+35%"], ["광고 대기", "0초"]]) {
    for (const [name, src] of [["index.html", index], ["resume.html", resume], ["game.js", game]]) {
      assert.ok(src.includes(label), `${name}: ${label}`);
      assert.ok(src.includes(value), `${name}: ${value}`);
    }
  }
});

test("경력 기간·회사가 페이지·이력서·게임에 같은 값으로 있다", () => {
  for (const fact of ["2016.03 – 2019.06", "2019.06 – 2020.02", "2020.03 – NOW", "휴빌론", "테크랩스", "번개장터", "KT 계열 앱 9종"]) {
    for (const [name, src] of [["index.html", index], ["resume.html", resume], ["game.js", game]]) assert.ok(src.includes(fact), `${name}: ${fact}`);
  }
});

test("연락처가 모든 곳에서 같다", () => {
  const mails = [...`${index}${resume}`.matchAll(/mailto:([^"]+)"/g)].map((m) => m[1]);
  assert.ok(mails.length >= 4);
  assert.equal(new Set(mails).size, 1);
  assert.ok(game.includes(mails[0]));
});

test("프로젝트 11건: 번호가 겹치지 않고, 페이지 안의 프로젝트 주소가 모두 실제 항목을 가리킨다", () => {
  const ids = [...index.matchAll(/<li id="quest\/(\d+)" data-n="(\d+)" data-cat="([^"]+)"/g)];
  assert.equal(ids.length, 11);
  ids.forEach(([, id, n]) => assert.equal(id, n));
  const set = new Set(ids.map((m) => m[1]));
  assert.equal(set.size, 11);
  const refs = [...`${index}${resume}`.matchAll(/#quest\/(\d+)"/g)].map((m) => m[1]);
  assert.ok(refs.length >= 15);
  refs.forEach((n) => assert.ok(set.has(n), `#quest/${n}`));
  // 게임 스테이지가 가리키는 프로젝트도 있어야 한다
  [...game.matchAll(/quest: (\d+),/g)].forEach((m) => assert.ok(set.has(m[1]), `game quest ${m[1]}`));
  // 분류 탭과 항목의 분류가 맞는다
  const filters = new Set([...index.matchAll(/data-filter="([^"]+)"/g)].map((m) => m[1]));
  ids.forEach(([, , , cat]) => assert.ok(filters.has(cat.replace(/&amp;/g, "&")), cat));
  assert.equal([...resume.matchAll(/<h3><a href="\.\/#quest\/\d+">/g)].length, 11);
});

test("메뉴가 가리키는 섹션이 모두 있다", () => {
  const hrefs = [...index.matchAll(/<a href="#([a-z]+)"/g)].map((m) => m[1]);
  assert.ok(hrefs.length >= 7);
  hrefs.forEach((id) => assert.ok(index.includes(`id="${id}"`), id));
});

test("스프라이트: 모든 줄의 길이가 같고, 페이지가 쓰는 이름이 정의돼 있다", () => {
  const ctx = {};
  ctx.window = ctx;
  vm.createContext(ctx);
  vm.runInContext(read("sprites.js"), ctx);
  for (const [name, rows] of Object.entries(ctx.SPRITES)) {
    assert.ok(rows.every((r) => r.length === rows[0].length), name);
    assert.ok(rows.join("").split("").every((c) => c === "." || c === "X" || ctx.PAL[c]), `${name}: 팔레트에 없는 글자`);
  }
  const used = [...`${index}${read("main.js")}`.matchAll(/(?:data-sprite="|spriteSVG\("|sprite = ")([A-Z0-9_]+)"/g)].map((m) => m[1]);
  assert.ok(used.length > 20);
  used.forEach((n) => assert.ok(ctx.SPRITES[n], n));
  assert.match(ctx.spriteSVG("I_PLAY", 2), /currentColor/);
  assert.equal(ctx.spriteSVG("NOPE", 2), "");
});

test("보이는 글에 긴 줄표와 이모지가 없다", () => {
  for (const [name, html] of [["index.html", index], ["resume.html", resume], ["404.html", read("404.html")]]) {
    const text = visible(html);
    assert.equal((text.match(/—/g) || []).length, 0, `${name}: 긴 줄표`);
    assert.equal((text.match(/\p{Extended_Pictographic}/gu) || []).filter((c) => !"▶◀".includes(c)).length, 0, `${name}: 이모지`);
  }
});

test("글자 크기는 토큰으로만 쓴다 (7단계 + 폰 변형)", () => {
  const body = css.slice(css.indexOf("* {"));
  const raw = [...body.matchAll(/font(?:-size)?:[^;]*?(\d+(?:\.\d+)?)px/g)].map((m) => m[1]);
  assert.deepEqual(raw, [], `토큰을 거치지 않은 글자 크기: ${raw.join(", ")}`);
  const tokens = [...css.matchAll(/--t-[a-z]+:\s*(\d+)px/g)].map((m) => Number(m[1]));
  // Galmuri11 은 12px 격자라 픽셀 글꼴 크기는 12 의 배수여야 한다 (본문 17·14 는 산세리프)
  tokens.filter((n) => n !== 17 && n !== 14).forEach((n) => assert.equal(n % 12, 0, `${n}px`));
});

test("스크립트 없이도 읽히게 하는 장치가 남아 있다", () => {
  assert.match(css, /\.boot \{[^}]*animation: boot-out/s);
  assert.match(css, /prefers-reduced-motion: reduce[^]*\.boot \{ display: none; \}/);
  // 본문을 감추는 규칙은 .js 표식이 있을 때만 걸린다
  assert.ok(!/^\.(?:reveal|quest-list > li > )[^{]*\{[^}]*(?:opacity: 0|display: none)/m.test(css));
  assert.ok(index.indexOf('<script src="boot.js">') < index.indexOf("</head>"));
});
