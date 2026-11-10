// DOM 없이 돌아가는 순수 규칙. 브라우저에서는 window.QuestLib, node 테스트에서는 require 로 쓴다.
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.QuestLib = factory();
})(typeof self !== "undefined" ? self : this, function () {
  // 게임 화면 배율. 게임 1픽셀이 기기 픽셀 정수 개가 되도록 맞춘다.
  // k = 기기 픽셀 배율(정수, 최소 1), cssW·cssH = CSS 픽셀 크기.
  const gameScale = ({ availW, availH, dpr, w = 320, h = 192 }) => {
    const ratio = dpr > 0 && Number.isFinite(dpr) ? dpr : 1;
    const fitCss = Math.min(availW / w, availH / h);
    const k = Math.max(1, Math.floor(fitCss * ratio));
    return { k, cssW: (w * k) / ratio, cssH: (h * k) / ratio };
  };

  // "#quest/6" → 6. 형식이 다르면 null.
  const parseQuestHash = (hash) => {
    const m = /^#?quest\/(\d{1,3})$/.exec(String(hash || ""));
    return m ? Number(m[1]) : null;
  };
  const questHash = (n) => `#quest/${n}`;

  // 노션 본문의 "목적", "설계 방향" 같은 짧은 단독 문단은 소제목으로 본다.
  const isLabelParagraph = (text) => {
    const t = String(text || "").trim();
    return t.length > 0 && t.length <= 16 && !/[.!?。:)]$/.test(t) && !t.includes("\n");
  };

  // 상세 본문 첫 문단 "기간: … · 역할: …\n키워드: …" 을 칸으로 나눈다. 그런 문단이 아니면 null.
  const META_KEYS = { 기간: "period", 역할: "role", 키워드: "keys" };
  const parseMeta = (text) => {
    const src = String(text || "");
    const re = /(기간|역할|키워드):[ \t]*/g;
    const marks = [];
    let m;
    while ((m = re.exec(src))) marks.push({ key: META_KEYS[m[1]], start: m.index, end: re.lastIndex });
    if (!marks.length || marks[0].start !== 0) return null;
    const out = {};
    marks.forEach((mk, i) => {
      const raw = src.slice(mk.end, i + 1 < marks.length ? marks[i + 1].start : src.length);
      out[mk.key] = raw.replace(/[\s·]+$/, "").trim();
    });
    return out;
  };

  // 인용 블록 앞의 "📌 한 줄 요약:" 표시를 뗀다 (글자는 그대로)
  const stripSummaryMark = (text) => String(text || "").replace(/^\s*(?:\u{1F4CC}\s*)?(?:한 줄 요약:\s*)?/u, "");

  // 게임 진행 기록(localStorage 문자열)을 읽는다. 깨진 값은 기본값으로 돌린다.
  const readProgress = (raw, stageCount) => {
    const base = { unlocked: 0, best: 0 };
    let v;
    try {
      v = JSON.parse(raw);
    } catch {
      return base;
    }
    if (!v || typeof v !== "object") return base;
    const max = Math.max(0, stageCount - 1);
    const unlocked = Number.isInteger(v.unlocked) ? Math.min(max, Math.max(0, v.unlocked)) : 0;
    const best = Number.isFinite(v.best) && v.best > 0 ? Math.min(999999, Math.floor(v.best)) : 0;
    return { unlocked, best };
  };
  // 스테이지를 깼을 때의 새 기록. unlocked 는 "고를 수 있는 마지막 스테이지 번호".
  const nextProgress = (prev, clearedIndex, score, stageCount) => ({
    unlocked: Math.max(prev.unlocked, Math.min(stageCount - 1, clearedIndex + 1)),
    best: Math.max(prev.best, Math.min(999999, Math.floor(score) || 0)),
  });

  // 60Hz 프레임 수 → "m:ss"
  const formatFrames = (frames) => {
    const s = Math.max(0, Math.floor(frames / 60));
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  };

  return { gameScale, parseQuestHash, questHash, isLabelParagraph, parseMeta, stripSummaryMark, readProgress, nextProgress, formatFrames };
});
