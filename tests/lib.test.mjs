// 순수 규칙(lib.js) 테스트. 실행: node --test tests/
import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
const L = createRequire(import.meta.url)("../lib.js");

test("gameScale: 게임 1픽셀이 기기 픽셀 정수 개가 된다", () => {
  // 폰 세로 390×844, 배율 3: 예전에는 1.17배로 늘어나 흐렸다
  const phone = L.gameScale({ availW: 366, availH: 616, dpr: 3 });
  assert.equal(phone.k, 3);
  assert.equal(phone.cssW, 320);
  assert.equal(phone.cssH, 192);
  assert.ok(Number.isInteger(phone.cssW * 3));
  // 폰 가로 844×390, 배율 3
  const land = L.gameScale({ availW: 516, availH: 322, dpr: 3 });
  assert.equal(land.k, 4);
  assert.ok(Math.abs(land.cssW * 3 - 320 * 4) < 1e-9);
  // 데스크톱 1440×900, 배율 1
  assert.deepEqual(L.gameScale({ availW: 1416, availH: 816, dpr: 1 }), { k: 4, cssW: 1280, cssH: 768 });
  // 배율 2 화면은 반 픽셀 단위까지 쓴다
  assert.equal(L.gameScale({ availW: 1416, availH: 816, dpr: 2 }).k, 8);
});

test("gameScale: 아주 작은 화면·이상한 배율에서도 1배 밑으로 내려가지 않는다", () => {
  assert.equal(L.gameScale({ availW: 100, availH: 100, dpr: 1 }).k, 1);
  assert.equal(L.gameScale({ availW: 640, availH: 384, dpr: 0 }).k, 2);
  assert.equal(L.gameScale({ availW: 640, availH: 384, dpr: NaN }).k, 2);
  assert.equal(L.gameScale({ availW: -5, availH: 384, dpr: 2 }).k, 1);
});

test("parseQuestHash: 프로젝트 주소만 받는다", () => {
  assert.equal(L.parseQuestHash("#quest/6"), 6);
  assert.equal(L.parseQuestHash("quest/11"), 11);
  assert.equal(L.questHash(6), "#quest/6");
  for (const bad of ["", "#quests", "#quest/", "#quest/abc", "#quest/6/x", "#quest/-1", "#quest/1234", null, undefined, "#status"]) {
    assert.equal(L.parseQuestHash(bad), null, String(bad));
  }
});

test("isLabelParagraph: 짧은 단독 문단만 소제목으로 본다", () => {
  assert.equal(L.isLabelParagraph("목적"), true);
  assert.equal(L.isLabelParagraph("설계 방향"), true);
  assert.equal(L.isLabelParagraph("문장으로 끝난다."), false);
  assert.equal(L.isLabelParagraph("이 문단은 열여섯 글자를 넘기 때문에 본문이다"), false);
  assert.equal(L.isLabelParagraph("두 줄\n문단"), false);
  assert.equal(L.isLabelParagraph(""), false);
});

test("parseMeta: 기간·역할·키워드를 나눈다", () => {
  assert.deepEqual(L.parseMeta("기간: 2025 – 2026 · 역할: 프로세스 발굴 · 워크플로우 설계\n키워드: n8n, Claude"), {
    period: "2025 – 2026",
    role: "프로세스 발굴 · 워크플로우 설계",
    keys: "n8n, Claude",
  });
  assert.deepEqual(L.parseMeta("기간: 2026.09 – 2026.10\n역할: 문제 정의\n키워드: Claude Code"), {
    period: "2026.09 – 2026.10",
    role: "문제 정의",
    keys: "Claude Code",
  });
  // 기간이 없는 프로젝트
  assert.deepEqual(L.parseMeta("역할: 사내 AIPT 활동\n키워드: Claude API"), { role: "사내 AIPT 활동", keys: "Claude API" });
  // 그런 문단이 아니면 건드리지 않는다
  assert.equal(L.parseMeta("목적"), null);
  assert.equal(L.parseMeta("이 글의 기간: 은 본문 안에 있다"), null);
  assert.equal(L.parseMeta(""), null);
});

test("stripSummaryMark: 표시만 떼고 글자는 그대로 둔다", () => {
  assert.equal(L.stripSummaryMark("📌 한 줄 요약: 숏폼 플레이어를 만들었습니다."), "숏폼 플레이어를 만들었습니다.");
  assert.equal(L.stripSummaryMark("한 줄 요약: 그대로"), "그대로");
  assert.equal(L.stripSummaryMark("표시 없는 인용"), "표시 없는 인용");
});

test("readProgress: 깨진 저장값은 기본값으로 돌린다", () => {
  const base = { unlocked: 0, best: 0 };
  for (const raw of [null, undefined, "", "{", "null", "[]", "42", '"x"', '{"unlocked":"3"}', '{"unlocked":1.5,"best":-4}']) {
    assert.deepEqual(L.readProgress(raw, 5), base, String(raw));
  }
  assert.deepEqual(L.readProgress('{"unlocked":3,"best":4200}', 5), { unlocked: 3, best: 4200 });
  // 스테이지 수보다 큰 값·너무 큰 점수는 잘라 낸다
  assert.deepEqual(L.readProgress('{"unlocked":99,"best":1e12}', 5), { unlocked: 4, best: 999999 });
  assert.deepEqual(L.readProgress('{"unlocked":-2,"best":10.9}', 5), { unlocked: 0, best: 10 });
});

test("nextProgress: 기록은 늘기만 한다", () => {
  const p0 = { unlocked: 0, best: 0 };
  const p1 = L.nextProgress(p0, 0, 1500, 5);
  assert.deepEqual(p1, { unlocked: 1, best: 1500 });
  // 앞 스테이지를 다시 깨도 풀린 스테이지가 줄지 않는다
  assert.deepEqual(L.nextProgress({ unlocked: 3, best: 9000 }, 0, 100, 5), { unlocked: 3, best: 9000 });
  // 마지막 스테이지를 깨도 범위를 넘지 않는다
  assert.deepEqual(L.nextProgress({ unlocked: 4, best: 0 }, 4, 12345, 5), { unlocked: 4, best: 12345 });
  assert.deepEqual(L.nextProgress(p0, 0, NaN, 5), { unlocked: 1, best: 0 });
});

test("formatFrames: 60Hz 프레임을 m:ss 로", () => {
  assert.equal(L.formatFrames(0), "0:00");
  assert.equal(L.formatFrames(59), "0:00");
  assert.equal(L.formatFrames(60 * 42), "0:42");
  assert.equal(L.formatFrames(60 * 125), "2:05");
  assert.equal(L.formatFrames(-10), "0:00");
});
