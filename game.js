// SEUNGJUN QUEST — 직접 플레이하는 버전.
// 320×192 저해상도 캔버스에 그리고 정수 배율로 키운다. 로직은 고정 60Hz.
(() => {
  const W = 320;
  const H = 192;
  const T = 16;
  const ROWS = 12;
  const FONT = "11px Galmuri11";
  const FONT_B = "bold 11px Galmuri11";
  const FONT_L = "bold 22px Galmuri11";
  // 모션 줄이기: 화면 흔들림과 깜빡임을 끈다
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ───────── 스테이지 정의 ─────────
  const THEMES = {
    day: { sky: ["#5FCDE4", "#7AD7EA", "#9EE2F0", "#C3EEF6"], far: "#7FB8C9", near: "#4F9A6E", top: "#3DDC84", dirt: "#8F563B", line: "#5B3427", brick: "#C2703D" },
    sunset: { sky: ["#3B1F5C", "#7A3E7C", "#C0567D", "#F28A7A"], far: "#6B3770", near: "#3F2A55", top: "#FF6B97", dirt: "#68386C", line: "#3F2045", brick: "#9E4E86" },
    dusk: { sky: ["#2B1B2E", "#5C2A3A", "#A8433F", "#E86A3C"], far: "#5C2A3A", near: "#3A1E2A", top: "#E43B44", dirt: "#5B3427", line: "#3A1E1A", brick: "#8E3B32" },
    night: { sky: ["#0B0B24", "#17153B", "#2A1F5C", "#3E2A7A"], far: "#241B4F", near: "#171236", top: "#9B5DE5", dirt: "#2A1F4A", line: "#17122E", brick: "#4B3A8A", stars: true },
  };

  const LEVELS = [
    {
      id: "1-1",
      name: "휴빌론",
      theme: "day",
      len: 100,
      pits: [[22, 24], [48, 50], [70, 72]],
      plats: [[12, 7, 3], [30, 6, 4], [56, 7, 3], [62, 5, 3], [80, 7, 4]],
      items: [[13, 6, "c"], [14, 6, "c"], [15, 6, "c"], [31, 5, "c"], [32, 5, "c"], [33, 5, "c"], [57, 6, "c"], [63, 4, "c"], [81, 6, "c"]],
      enemies: [[18, "BUG"], [40, "ANR"], [66, "BUG"], [86, "CRASH"]],
      signs: [[5, "WORLD 1-1 휴빌론\n2016.03 – 2019.06"], [44, "KT 계열 앱 9종을\n개발하고 운영했다"]],
      flag: 95,
      clear: ["휴빌론 · 2016.03 – 2019.06", "KT 계열 앱 9종 개발·운영"],
    },
    {
      id: "1-2",
      name: "테크랩스",
      theme: "sunset",
      len: 90,
      pits: [[18, 21], [40, 43], [62, 64]],
      plats: [[8, 7, 3], [24, 6, 3], [34, 7, 3], [46, 6, 4], [54, 7, 3], [70, 6, 4]],
      items: [[9, 6, "h"], [25, 5, "h"], [35, 6, "h"], [47, 5, "h"], [49, 5, "h"], [71, 5, "h"]],
      enemies: [[14, "CRASH", 1], [30, "CRASH", 1], [58, "CRASH", 1], [77, "CRASH", 1]],
      signs: [[4, "WORLD 1-2 테크랩스\n2019.06 – 2020.02"], [51, "소개팅 앱\n아만다 · 너랑나랑 Android"]],
      flag: 86,
      clear: ["테크랩스 · 2019.06 – 2020.02", "소개팅 앱 아만다 · 너랑나랑 Android"],
    },
    {
      id: "2-1",
      name: "번개장터",
      theme: "dusk",
      len: 100,
      pits: [[26, 28], [44, 46]],
      plats: [[14, 7, 3], [34, 6, 3], [52, 7, 4]],
      items: [[15, 6, "g", "마이샵"], [35, 5, "g", "검색"], [53, 6, "g", "번개톡"], [58, 9, "g", "마이지면"], [66, 9, "J"]],
      enemies: [[20, "BUG"], [38, "BUG"], [56, "LEGACY"]],
      signs: [[4, "WORLD 2-1 번개장터\n2020.03 – NOW"], [62, "CI/CD 를 Jenkins 로!\n이동 속도가 빨라진다"], [72, "이 앞은 레거시의 소굴\nX 로 세 번 베어라!"]],
      boss: { type: "legacy", arena: 78 },
      flag: 96,
      clear: ["번개장터 · 2020.03 – NOW", "핵심 지면 재설계 (마이샵·검색·번개톡)", "MVP→MVVM→Clean+멀티모듈→Compose", "Bitbucket → Jenkins CI/CD 이관"],
    },
    {
      id: "2-2",
      name: "성과",
      theme: "day",
      len: 70,
      pits: [[30, 32]],
      plats: [[40, 7, 2]],
      items: [],
      blocks: [
        [12, 6, ["일 시청", "11만", "Media3 숏폼"]],
        [22, 6, ["결제 전환율", "×2", "숏폼 플레이어"]],
        [36, 6, ["UP하기 매출", "+35%", "핵심 지면 개편"]],
        [48, 6, ["광고 대기", "0초", "광고 SDK 개편"]],
      ],
      enemies: [[18, "BUG"], [44, "ANR"], [56, "BUG"]],
      signs: [[4, "WORLD 2-2 성과\n? 블록을 아래에서 쳐라!"]],
      flag: 64,
      clear: ["숫자로 남은 성과", "일 시청 11만 · 결제 전환율 ×2", "UP하기 매출 +35% · 광고 대기 0초"],
    },
    {
      id: "3-1",
      name: "AI 시대",
      theme: "night",
      len: 100,
      pits: [],
      plats: [[24, 7, 14], [54, 7, 20]],
      items: [
        [10, 9, "a"], [13, 9, "a"], [16, 9, "a"], [19, 9, "a"],
        [25, 6, "s"], [27, 6, "s"], [29, 6, "s"], [31, 6, "s"], [33, 6, "s"], [35, 6, "s"], [37, 6, "s"],
        [43, 9, "a"], [45, 9, "a"], [47, 9, "a"], [49, 9, "a"], [51, 9, "a"],
        [55, 6, "s"], [57, 6, "s"], [59, 6, "s"], [61, 6, "s"], [63, 6, "s"], [65, 6, "s"], [67, 6, "s"], [69, 6, "s"], [71, 6, "s"], [73, 6, "s"],
      ],
      enemies: [[30, "TODO"], [62, "TODO"]],
      signs: [[6, "WORLD 3-1 AI 시대\nAIRU: 에이전트 4 · 스킬 7"], [40, "팀원 4명이 합류했다!\n에이전트 +5 · 스킬 +10"], [76, "보스: 반복 업무\n동료가 레이저로 돕는다"]],
      boss: { type: "repeat", arena: 78 },
      flag: 96,
      clear: ["AI 시대", "Claude Code 멀티에이전트 AIRU → 팀 표준", "n8n 개발 자동화 8종 · AI 스터디 리드"],
    },
  ];

  const BOT_COLORS = ["#3DDC84", "#5FCDE4", "#3DDC84", "#5FCDE4", "#FEE761", "#FF6B97", "#F77622", "#9B5DE5", "#0099DB"];
  const SWORD_COLORS = ["#C0CBDC", "#5FCDE4", "#C59BFF", "#3DDC84"];

  // ───────── 스프라이트 캐시 (1px = 1픽셀 캔버스) ─────────
  const sprCache = new Map();
  const spr = (name, over) => {
    const key = name + (over ? JSON.stringify(over) : "");
    if (sprCache.has(key)) return sprCache.get(key);
    const map = SPRITES[name];
    const pal = Object.assign({}, PAL, over || {});
    const c = document.createElement("canvas");
    c.width = map[0].length;
    c.height = map.length;
    const x = c.getContext("2d");
    map.forEach((row, y) => {
      for (let i = 0; i < row.length; i++) {
        const col = pal[row[i]];
        if (row[i] !== "." && col) {
          x.fillStyle = col;
          x.fillRect(i, y, 1, 1);
        }
      }
    });
    sprCache.set(key, c);
    return c;
  };
  // 그릴 때마다 색 객체를 만들지 않도록 색이 바뀌는 스프라이트는 미리 만들어 둔다
  const BOT_IMGS = BOT_COLORS.map((c) => spr("BOT", { X: c }));
  const SWORD_IMGS = SWORD_COLORS.map((c) => spr("SWORD", { X: c }));
  const HEART_EMPTY = spr("HEART", { H: "#3A4466", W: "#3A4466" });
  const ITEM_IMGS = {
    c: spr("COIN"),
    h: spr("HEART"),
    g: spr("GEM", { X: "#0099DB" }),
    J: spr("GEM", { X: "#F77622", b: "#9E4539" }),
    s: spr("GEM", { X: "#C59BFF", b: "#5A3A9B" }),
  };

  // ───────── 소리 ─────────
  let actx = null;
  let muted = false;
  const tone = (freqs, dur = 0.06, type = "square", vol = 0.05) => {
    if (muted || !actx) return;
    const t0 = actx.currentTime;
    freqs.forEach((f, i) => {
      const o = actx.createOscillator();
      const g = actx.createGain();
      o.type = type;
      o.frequency.value = f;
      g.gain.setValueAtTime(vol, t0 + i * dur);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + (i + 1) * dur);
      o.connect(g).connect(actx.destination);
      o.start(t0 + i * dur);
      o.stop(t0 + (i + 1) * dur + 0.02);
    });
  };
  const SFX = {
    jump: () => tone([392, 587], 0.05),
    coin: () => tone([988, 1319], 0.06),
    swing: () => tone([880, 440], 0.03, "sawtooth", 0.03),
    kill: () => tone([784, 392, 196], 0.05),
    hurt: () => tone([330, 220, 165], 0.07, "sawtooth", 0.05),
    bump: () => tone([196, 392, 784, 1047], 0.05),
    power: () => tone([523, 659, 784, 1047, 1319], 0.06),
    laser: () => tone([1400, 700], 0.03, "square", 0.025),
    boss: () => tone([110, 98, 82], 0.12, "sawtooth", 0.06),
    clear: () => tone([523, 659, 784, 1047, 784, 1047, 1319], 0.09),
    select: () => tone([660, 990], 0.05),
  };

  // ───────── DOM ─────────
  const root = document.getElementById("game");
  const canvas = document.getElementById("game-canvas");
  const ctx = canvas.getContext("2d");
  const bgm = document.getElementById("game-bgm");

  // ───────── 입력 ─────────
  const keys = { left: false, right: false, jump: false, attack: false };
  const pressed = { jump: false, attack: false, confirm: false };
  const KEYMAP = {
    ArrowLeft: "left", a: "left", A: "left",
    ArrowRight: "right", d: "right", D: "right",
    ArrowUp: "jump", " ": "jump", z: "jump", Z: "jump", w: "jump", W: "jump",
    x: "attack", X: "attack", j: "attack", J: "attack",
  };
  const setKey = (k, down) => {
    if (down && !keys[k] && (k === "jump" || k === "attack")) pressed[k] = true;
    keys[k] = down;
  };
  const clearInput = () => {
    Object.keys(keys).forEach((k) => (keys[k] = false));
    Object.keys(pressed).forEach((k) => (pressed[k] = false));
  };
  const onKey = (e) => {
    if (root.hidden) return;
    // Tab 으로 상단 버튼에 와 있으면 Enter·스페이스는 그 버튼이 받는다
    if ((e.key === "Enter" || e.key === " ") && e.target.closest?.(".game-bar button")) return;
    const down = e.type === "keydown";
    const k = KEYMAP[e.key];
    const isGameKey = k || e.key === "Enter" || e.key === "Escape" || "mMpP".includes(e.key) && e.key.length === 1;
    // 게임 키는 페이지 스크롤·버튼 클릭으로 새지 않게 막는다
    if (isGameKey) e.preventDefault();
    if (down && e.key === "Escape") return close();
    if (down && (e.key === "m" || e.key === "M")) return toggleMute();
    if (down && (e.key === "p" || e.key === "P") && state.scene === "play") {
      setPaused(!state.paused);
      return;
    }
    if (down && (e.key === "Enter" || e.key === " ")) pressed.confirm = true;
    if (k) setKey(k, down);
  };
  window.addEventListener("keydown", onKey);
  window.addEventListener("keyup", onKey);

  // 터치 버튼 (멀티터치)
  root.querySelectorAll("[data-key]").forEach((b) => {
    const k = b.dataset.key;
    const down = (e) => {
      e.preventDefault();
      b.setPointerCapture?.(e.pointerId);
      if (k === "confirm") pressed.confirm = true;
      else setKey(k, true);
    };
    const up = (e) => {
      e.preventDefault();
      if (k !== "confirm") setKey(k, false);
    };
    b.addEventListener("pointerdown", down);
    b.addEventListener("pointerup", up);
    b.addEventListener("pointercancel", up);
    b.addEventListener("pointerleave", up);
  });
  canvas.addEventListener("pointerdown", () => (pressed.confirm = true));

  // ───────── 상태 ─────────
  const state = {
    scene: "title", // title | play | clear | ending
    paused: false,
    levelIndex: 0,
    score: 0,
    coins: 0,
    skills: 0,
    t: 0,
  };
  let lv = null; // 현재 스테이지 런타임

  const solidAt = (tx, ty) => {
    if (tx < 0) return true;
    if (!lv || tx >= lv.len || ty < 0) return false;
    if (ty >= ROWS) return false;
    const c = lv.grid[ty][tx];
    return c === "#" || c === "=" || c === "?" || c === "u";
  };

  const buildLevel = (def) => {
    const grid = Array.from({ length: ROWS }, () => Array(def.len).fill("."));
    for (let x = 0; x < def.len; x++) {
      if (def.pits.some(([a, b]) => x >= a && x <= b)) continue;
      grid[10][x] = "#";
      grid[11][x] = "#";
    }
    def.plats.forEach(([x, r, n]) => {
      for (let i = 0; i < n; i++) grid[r][x + i] = "=";
    });
    const blocks = (def.blocks || []).map(([x, r, info]) => {
      grid[r][x] = "?";
      return { tx: x, ty: r, info, hit: false, bump: 0, cardT: 0 };
    });
    const items = def.items.map(([x, r, k, label]) => ({
      x: x * T + 4,
      y: r * T + 4,
      k,
      label,
      img: k === "a" ? BOT_IMGS[x % 9] : ITEM_IMGS[k],
      taken: false,
      t: Math.random() * 60,
    }));
    const enemies = def.enemies.map(([x, label, fast]) => makeEnemy(x * T, 9 * T + 8, label, fast));
    const signs = def.signs.map(([x, text]) => ({ x: x * T, text, seen: false }));
    const boss = def.boss ? makeBoss(def.boss) : null;
    return {
      def,
      len: def.len,
      grid,
      items,
      enemies,
      blocks,
      signs,
      boss,
      flagX: boss ? null : def.flag * T,
      arena: def.boss ? def.boss.arena * T : null,
      particles: [],
      texts: [],
      lasers: [],
      bots: [],
      checkpoint: 2 * T,
      camX: 0,
      shake: 0,
      sign: null,
      clearT: 0,
      bg: makeBg(THEMES[def.theme]),
    };
  };

  const makeEnemy = (x, y, label, fast) => {
    const color = label === "CRASH" ? "#9B5DE5" : label === "TODO" ? "#8B9BB4" : label === "LEGACY" ? "#B55088" : "#E43B44";
    return { x, y, w: 12, h: 8, vx: fast ? -0.9 : -0.5, vy: 0, label, color, img: spr("BUG", { X: color }), alive: true };
  };

  const makeBoss = (b) => {
    const legacy = b.type === "legacy";
    const color = legacy ? "#7A4B8C" : "#5A6988";
    return {
      type: b.type,
      name: legacy ? "LEGACY MVP" : "반복 업무",
      x: (b.arena + 14) * T,
      y: 10 * T - 36,
      w: 40,
      h: 36,
      vx: 0,
      vy: 0,
      hp: legacy ? 3 : 10,
      max: legacy ? 3 : 10,
      inv: 0,
      t: 0,
      color,
      img: spr("BOSS", { X: color }),
      flashImg: spr("BOSS", { X: "#FFFFFF" }),
      alive: true,
      active: false,
      dead: 0,
    };
  };

  // 배경: 산 두 겹을 미리 그려 둔다
  const makeBg = (th) => {
    const make = (color, seed, h, step) => {
      const c = document.createElement("canvas");
      c.width = 640;
      c.height = H;
      const x = c.getContext("2d");
      x.fillStyle = color;
      for (let i = 0; i < 640; i += step) {
        const y = H - h * (0.5 + 0.3 * Math.sin((i + seed) / 70) + 0.15 * Math.sin((i + seed * 3) / 23));
        x.fillRect(i, Math.round(y / step) * step, step, H);
      }
      return c;
    };
    const stars = th.stars ? Array.from({ length: 50 }, (_, i) => [(i * 97) % 640, (i * 53) % 110]) : null;
    return { far: make(th.far, 0, 110, 8), near: make(th.near, 300, 70, 6), stars, th };
  };

  const player = {
    x: 0, y: 0, w: 10, h: 14, vx: 0, vy: 0, face: 1, onGround: false, coyote: 0, jumpBuf: 0,
    hp: 3, inv: 0, atk: 0, atkCd: 0, speed: 1.6, sword: 0, walkT: 0,
  };

  // 동료 봇이 따라올 플레이어 발자취 (최근 200프레임)
  const TRAIL = 200;
  const trail = Array.from({ length: TRAIL }, () => ({ x: 0, y: 0 }));
  let trailHead = 0;
  let trailLen = 0;

  const resetPlayer = (x) => {
    player.x = x;
    player.y = 9 * T - 8;
    player.vx = 0;
    player.vy = 0;
    player.inv = 60;
  };

  const startLevel = (i) => {
    state.levelIndex = i;
    lv = buildLevel(LEVELS[i]);
    player.hp = 3;
    player.atk = 0;
    if (i < 2) player.speed = 1.6;
    if (i < 2) player.sword = 0;
    resetPlayer(2 * T);
    state.paused = false;
    clearInput();
    state.scene = "play";
    addText(player.x, player.y - 20, `WORLD ${lv.def.id}`, "#FEE761", 90);
  };

  // ───────── 효과 ─────────
  const burst = (x, y, colors, n = 12, power = 2.2) => {
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2;
      const s = power * (0.5 + ((i * 37) % 10) / 12);
      lv.particles.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 1, life: 30, c: colors[i % colors.length] });
    }
  };
  const addText = (x, y, text, color = "#FEE761", life = 50) => lv.texts.push({ x, y, text, color, life, max: life });
  const hit = (a, b) => a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;

  // ───────── 물리 ─────────
  const moveBody = (o, onHeadHit) => {
    o.x += o.vx;
    const top = Math.floor(o.y / T);
    const bot = Math.floor((o.y + o.h - 1) / T);
    if (o.vx > 0) {
      const tx = Math.floor((o.x + o.w) / T);
      for (let ty = top; ty <= bot; ty++)
        if (solidAt(tx, ty)) {
          o.x = tx * T - o.w;
          o.vx = 0;
          o.hitWall = true;
          break;
        }
    } else if (o.vx < 0) {
      const tx = Math.floor(o.x / T);
      for (let ty = top; ty <= bot; ty++)
        if (solidAt(tx, ty)) {
          o.x = (tx + 1) * T;
          o.vx = 0;
          o.hitWall = true;
          break;
        }
    }
    o.y += o.vy;
    o.onGround = false;
    const left = Math.floor(o.x / T);
    const right = Math.floor((o.x + o.w - 1) / T);
    if (o.vy > 0) {
      const ty = Math.floor((o.y + o.h) / T);
      for (let tx = left; tx <= right; tx++)
        if (solidAt(tx, ty)) {
          o.y = ty * T - o.h;
          o.vy = 0;
          o.onGround = true;
          break;
        }
    } else if (o.vy < 0) {
      const ty = Math.floor(o.y / T);
      for (let tx = left; tx <= right; tx++)
        if (solidAt(tx, ty)) {
          o.y = (ty + 1) * T;
          o.vy = 0;
          onHeadHit && onHeadHit(tx, ty);
          break;
        }
    }
  };

  const hurtPlayer = (fromX) => {
    if (player.inv > 0) return;
    player.hp -= 1;
    player.inv = 90;
    player.vx = player.x < fromX ? -2.5 : 2.5;
    player.vy = -3.5;
    lv.shake = 8;
    SFX.hurt();
    if (player.hp <= 0) {
      addText(player.x, player.y - 24, "RETRY!", "#E43B44", 70);
      player.hp = 3;
      resetPlayer(lv.checkpoint);
    }
  };

  const killEnemy = (e) => {
    e.alive = false;
    burst(e.x + 6, e.y + 4, [e.color, "#FEE761", "#FFFFFF"]);
    addText(e.x + 6, e.y - 8, `${e.label} +500`);
    state.score += 500;
    SFX.kill();
  };

  const damageBoss = (b, dmg, byLaser) => {
    if (b.inv > 0 || !b.alive) return;
    b.hp -= dmg;
    b.inv = byLaser ? 8 : 40;
    lv.shake = byLaser ? 3 : 10;
    burst(b.x + 20, b.y + 18, ["#FFFFFF", b.color], 10, 2.5);
    SFX.boss();
    if (b.type === "legacy" && !byLaser) {
      const steps = ["MVP → MVVM!", "CLEAN + 멀티모듈!", "COMPOSE!"];
      const idx = b.max - b.hp - 1;
      addText(b.x + 20, b.y - 12, steps[idx] || "HIT!", SWORD_COLORS[idx + 1] || "#FEE761", 70);
      player.sword = Math.min(3, idx + 1);
      b.vx = player.x < b.x ? 2.5 : -2.5;
    }
    if (b.hp <= 0) {
      b.alive = false;
      b.dead = 1;
      burst(b.x + 20, b.y + 18, ["#3DDC84", "#FEE761", "#FFFFFF", "#E43B44"], 40, 3.5);
      addText(b.x + 20, b.y - 20, b.type === "legacy" ? "LEGACY CLEARED!" : "AUTOMATED!", "#FEE761", 120);
      state.score += 5000;
      lv.flagX = lv.def.flag * T;
      SFX.clear();
    }
  };

  // ───────── 갱신 ─────────
  const updatePlay = () => {
    const p = player;
    const b = lv.boss;

    // 좌우
    const dir = (keys.right ? 1 : 0) - (keys.left ? 1 : 0);
    if (dir) {
      p.vx += dir * 0.3;
      p.vx = Math.max(-p.speed, Math.min(p.speed, p.vx));
      p.face = dir;
      p.walkT++;
    } else {
      p.vx *= p.onGround ? 0.7 : 0.92;
      if (Math.abs(p.vx) < 0.05) p.vx = 0;
    }
    // 점프 (코요테 타임 + 입력 버퍼)
    p.coyote = p.onGround ? 6 : Math.max(0, p.coyote - 1);
    p.jumpBuf = pressed.jump ? 6 : Math.max(0, p.jumpBuf - 1);
    if (p.jumpBuf && p.coyote) {
      p.vy = -7.0;
      p.jumpBuf = 0;
      p.coyote = 0;
      SFX.jump();
    }
    if (!keys.jump && p.vy < -2) p.vy = -2;
    p.vy = Math.min(6, p.vy + 0.32);

    // 공격
    if (pressed.attack && p.atkCd === 0) {
      p.atk = 14;
      p.atkCd = 20;
      SFX.swing();
    }
    p.atk = Math.max(0, p.atk - 1);
    p.atkCd = Math.max(0, p.atkCd - 1);
    p.inv = Math.max(0, p.inv - 1);

    moveBody(p, (tx, ty) => {
      const blk = lv.blocks.find((k) => k.tx === tx && k.ty === ty && !k.hit);
      if (!blk) return;
      blk.hit = true;
      blk.bump = 8;
      blk.cardT = 1;
      lv.grid[ty][tx] = "u";
      state.score += 2500;
      state.coins += 1;
      burst(tx * T + 8, ty * T, ["#FEE761", "#F77622", "#FFFFFF"], 10);
      SFX.bump();
    });

    // 보스 방: 카메라와 이동 범위를 가둔다
    if (b && b.alive && p.x > lv.arena + T) {
      if (!b.active) {
        b.active = true;
        SFX.boss();
        addText(b.x + 20, b.y - 14, b.name, "#FFFFFF", 90);
      }
    }
    if (b && b.active && b.alive) p.x = Math.max(lv.arena, Math.min(lv.arena + 20 * T - p.w, p.x));
    p.x = Math.max(0, Math.min(lv.len * T - p.w, p.x));

    // 낭떠러지
    if (p.y > H + 20) {
      hurtPlayer(p.x);
      if (player.hp > 0) resetPlayer(lv.checkpoint);
    }

    // 공격 판정 (휘두르는 중간 프레임)
    const atkBox = p.atk > 3 && p.atk < 12 ? { x: p.face > 0 ? p.x + p.w : p.x - 18, y: p.y - 4, w: 18, h: 20 } : null;

    // 적
    lv.enemies.forEach((e) => {
      if (!e.alive) return;
      if (Math.abs(e.x - p.x) > W) return; // 화면 밖은 멈춤
      e.vy = Math.min(5, e.vy + 0.3);
      e.hitWall = false;
      moveBody(e);
      // 벽이나 낭떠러지면 돌아선다
      const ahead = e.vx > 0 ? e.x + e.w + 1 : e.x - 1;
      if (e.hitWall || (e.onGround && !solidAt(Math.floor(ahead / T), Math.floor((e.y + e.h + 2) / T)))) {
        e.vx = e.vx > 0 ? -Math.abs(e.vx || 0.5) : Math.abs(e.vx || 0.5);
        if (e.vx === 0) e.vx = 0.5;
      }
      if (e.y > H + 20) e.alive = false;
      if (atkBox && hit(atkBox, e)) return killEnemy(e);
      if (hit(p, e)) {
        if (p.vy > 0 && p.y + p.h - e.y < 8) {
          killEnemy(e);
          p.vy = -4;
        } else hurtPlayer(e.x);
      }
    });

    // 보스
    if (b && b.active && b.alive) {
      b.t++;
      b.inv = Math.max(0, b.inv - 1);
      const toward = p.x < b.x ? -1 : 1;
      if (Math.abs(b.vx) < 0.7) b.vx = toward * (b.type === "legacy" ? 0.6 : 0.35);
      b.vx *= 0.96;
      if (b.onGround && b.t % 110 === 0) b.vy = b.type === "legacy" ? -5.2 : -3;
      b.vy = Math.min(6, b.vy + 0.3);
      moveBody(b);
      b.x = Math.max(lv.arena, Math.min(lv.arena + 20 * T - b.w, b.x));
      if (b.type === "repeat" && b.t % 150 === 0) {
        lv.enemies.push(makeEnemy(b.x, b.y + 20, "TODO"));
      }
      if (atkBox && hit(atkBox, b)) damageBoss(b, 1, false);
      if (hit(p, b)) {
        if (p.vy > 0 && p.y + p.h - b.y < 8) {
          p.vy = -4.5;
          damageBoss(b, 1, false);
        } else hurtPlayer(b.x + 20);
      }
    }
    if (b && b.dead) b.dead++;

    // 아이템
    lv.items.forEach((it) => {
      it.t++;
      if (it.taken) return;
      if (!(p.x < it.x + 10 && p.x + p.w > it.x - 2 && p.y < it.y + 10 && p.y + p.h > it.y - 2)) return;
      it.taken = true;
      const cx = it.x + 4;
      const cy = it.y;
      if (it.k === "c") {
        state.coins++;
        state.score += 100;
        addText(cx, cy - 6, "+1 APP", "#FEE761", 30);
        SFX.coin();
      } else if (it.k === "h") {
        state.score += 100;
        addText(cx, cy - 6, "♥ MATCH", "#FF6B97", 34);
        SFX.coin();
      } else if (it.k === "g") {
        state.score += 200;
        addText(cx, cy - 6, `${it.label} 재설계`, "#5FCDE4", 50);
        SFX.coin();
      } else if (it.k === "J") {
        p.speed = 2.4;
        state.score += 1000;
        addText(cx, cy - 10, "CI/CD → JENKINS!", "#F77622", 80);
        SFX.power();
      } else if (it.k === "a") {
        lv.bots.push({ i: lv.bots.length, cd: 40 + lv.bots.length * 9, x: p.x, y: p.y });
        state.score += 300;
        addText(cx, cy - 6, `AGENT +1 (${lv.bots.length})`, BOT_COLORS[lv.bots.length - 1], 50);
        SFX.power();
      } else if (it.k === "s") {
        state.skills++;
        state.score += 100;
        addText(cx, cy - 6, `SKILL ${state.skills}`, "#C59BFF", 30);
        SFX.coin();
      }
      burst(cx, cy, ["#FFFFFF", "#FEE761"], 6, 1.5);
    });

    // 동료 봇: 플레이어 뒤를 따라다니며 가까운 적에게 레이저
    trailHead = (trailHead + 1) % TRAIL;
    trail[trailHead].x = p.x;
    trail[trailHead].y = p.y;
    trailLen = Math.min(TRAIL, trailLen + 1);
    lv.bots.forEach((bot, i) => {
      const back = Math.min(trailLen - 1, (i + 1) * 9);
      const tp = trail[(trailHead - back + TRAIL) % TRAIL];
      bot.x += (tp.x - p.face * 6 - bot.x) * 0.2;
      bot.y += (tp.y - 18 - (i % 2) * 12 - bot.y) * 0.2;
      bot.cd--;
      if (bot.cd > 0) return;
      const targets = lv.enemies.filter((e) => e.alive && Math.abs(e.x - bot.x) < 150 && Math.abs(e.y - bot.y) < 80);
      if (b && b.active && b.alive) targets.push(b);
      if (!targets.length) {
        bot.cd = 10;
        return;
      }
      const tg = targets.sort((a, c) => Math.abs(a.x - bot.x) - Math.abs(c.x - bot.x))[0];
      lv.lasers.push({ x1: bot.x + 5, y1: bot.y + 4, x2: tg.x + tg.w / 2, y2: tg.y + tg.h / 2, life: 8, c: BOT_COLORS[i] });
      SFX.laser();
      bot.cd = 70 + i * 6;
      if (tg === b) damageBoss(b, 1, true);
      else killEnemy(tg);
    });

    // 표지판 (가까이 가면 대사창 + 체크포인트)
    lv.sign = null;
    lv.signs.forEach((s) => {
      if (Math.abs(p.x + 5 - (s.x + 6)) < 28) {
        lv.sign = s;
        if (!s.seen) {
          s.seen = true;
          lv.checkpoint = s.x;
          SFX.select();
        }
      }
    });

    // 블록 카드
    lv.blocks.forEach((k) => {
      k.bump = Math.max(0, k.bump - 1);
      if (k.cardT) k.cardT++;
    });

    // 깃발 도착
    if (lv.flagX != null && p.x + p.w >= lv.flagX + 2) {
      state.scene = "clear";
      lv.clearT = 0;
      state.score += 1000;
      SFX.clear();
    }

    // 카메라
    let target = p.x - 130;
    if (b && b.active && b.alive) target = lv.arena;
    lv.camX += (Math.max(0, Math.min(lv.len * T - W, target)) - lv.camX) * 0.15;
  };

  // 수명이 다한 것을 새 배열 없이 제자리에서 지운다
  const prune = (arr) => {
    let n = 0;
    for (let i = 0; i < arr.length; i++) if (arr[i].life > 0) arr[n++] = arr[i];
    arr.length = n;
  };
  const updateFx = () => {
    lv.particles.forEach((q) => {
      q.x += q.vx;
      q.y += q.vy;
      q.vy += 0.12;
      q.life--;
    });
    prune(lv.particles);
    lv.texts.forEach((t) => {
      t.y -= 0.35;
      t.life--;
    });
    prune(lv.texts);
    lv.lasers.forEach((l) => l.life--);
    prune(lv.lasers);
    lv.shake = Math.max(0, lv.shake - 1);
  };

  const update = () => {
    state.t++;
    if (state.scene === "title") {
      if (pressed.confirm || pressed.jump) {
        SFX.select();
        state.score = 0;
        state.coins = 0;
        state.skills = 0;
        startLevel(0);
      }
    } else if (state.scene === "play") {
      if (state.paused && (pressed.confirm || pressed.jump)) {
        setPaused(false);
        pressed.jump = false;
      }
      if (!state.paused) {
        updatePlay();
        updateFx();
      }
    } else if (state.scene === "clear") {
      lv.clearT++;
      updateFx();
      if (lv.clearT > 40 && (pressed.confirm || pressed.jump)) {
        SFX.select();
        if (state.levelIndex + 1 < LEVELS.length) startLevel(state.levelIndex + 1);
        else state.scene = "ending";
        state.endT = 0;
      }
    } else if (state.scene === "ending") {
      state.endT = (state.endT || 0) + 1;
      if (state.endT > 60 && (pressed.confirm || pressed.jump)) {
        SFX.select();
        state.scene = "title";
      }
    }
    pressed.jump = false;
    pressed.attack = false;
    pressed.confirm = false;
  };

  // ───────── 그리기 ─────────
  const text = (s, x, y, color = "#FFFFFF", font = FONT, align = "left") => {
    ctx.font = font;
    ctx.textAlign = align;
    ctx.fillStyle = "#0F0F1B";
    ctx.fillText(s, x + 1, y + 1);
    ctx.fillStyle = color;
    ctx.fillText(s, x, y);
  };
  const box = (x, y, w, h, border = "#FFFFFF") => {
    ctx.fillStyle = "#0F0F1B";
    ctx.fillRect(x - 2, y - 2, w + 4, h + 4);
    ctx.fillStyle = border;
    ctx.fillRect(x, y, w, h);
    ctx.fillStyle = "#0F0F1B";
    ctx.fillRect(x + 2, y + 2, w - 4, h - 4);
  };

  const drawBg = () => {
    const { far, near, stars, th } = lv.bg;
    th.sky.forEach((c, i) => {
      ctx.fillStyle = c;
      ctx.fillRect(0, (i * H) / 4, W, H / 4 + 1);
    });
    if (stars) {
      ctx.fillStyle = "#FFFFFF";
      stars.forEach(([x, y], i) => {
        if ((Math.floor(state.t / 20) + i) % 6 === 0) return;
        ctx.fillRect(Math.round(((x - lv.camX * 0.05) % 640 + 640) % 640) - 160, y, 1, 1);
      });
    }
    const fx = -Math.round((lv.camX * 0.2) % 640);
    ctx.drawImage(far, fx, 0);
    ctx.drawImage(far, fx + 640, 0);
    const nx = -Math.round((lv.camX * 0.45) % 640);
    ctx.drawImage(near, nx, 0);
    ctx.drawImage(near, nx + 640, 0);
  };

  const drawTiles = (cx) => {
    const th = lv.bg.th;
    const x0 = Math.floor(cx / T);
    for (let tx = x0; tx <= x0 + W / T + 1; tx++) {
      if (tx >= lv.len) break;
      for (let ty = 0; ty < ROWS; ty++) {
        const c = lv.grid[ty][tx];
        if (c === ".") continue;
        const sx = tx * T - cx;
        const sy = ty * T;
        if (c === "#") {
          ctx.fillStyle = th.dirt;
          ctx.fillRect(sx, sy, T, T);
          ctx.fillStyle = th.line;
          ctx.fillRect(sx, sy + 7, T, 1);
          ctx.fillRect(sx + (ty % 2 ? 4 : 11), sy, 1, 7);
          ctx.fillRect(sx + (ty % 2 ? 11 : 4), sy + 8, 1, 8);
          if (ty === 0 || lv.grid[ty - 1][tx] === ".") {
            ctx.fillStyle = th.top;
            ctx.fillRect(sx, sy, T, 3);
          }
        } else if (c === "=") {
          ctx.fillStyle = th.brick;
          ctx.fillRect(sx, sy, T, T);
          ctx.fillStyle = "#0F0F1B";
          ctx.fillRect(sx, sy + 7, T, 1);
          ctx.fillRect(sx, sy + 15, T, 1);
          ctx.fillRect(sx + 7, sy, 1, 7);
          ctx.fillRect(sx + 3, sy + 8, 1, 7);
          ctx.fillRect(sx + 11, sy + 8, 1, 7);
          ctx.fillStyle = "rgba(255,255,255,0.25)";
          ctx.fillRect(sx, sy, T, 1);
        } else if (c === "?" || c === "u") {
          const blk = lv.blocks.find((k) => k.tx === tx && k.ty === ty);
          const bump = blk && blk.bump ? Math.round(Math.sin((blk.bump / 8) * Math.PI) * 5) : 0;
          ctx.drawImage(spr(c === "?" ? "BLOCK" : "USED_BLOCK"), sx, sy - bump);
        }
      }
    }
  };

  const drawPlayer = (cx) => {
    const p = player;
    const blink = p.inv && Math.floor(p.inv / 4) % 2;
    if (blink && !reduceMotion) return;
    const sx = Math.round(p.x - 3 - cx);
    const sy = Math.round(p.y - 2);
    const walking = Math.abs(p.vx) > 0.2 && p.onGround;
    const frame = walking && Math.floor(p.walkT / 6) % 2 ? "HERO_B" : "HERO_A";
    ctx.save();
    if (blink) ctx.globalAlpha = 0.5; // 모션 줄이기: 깜빡이는 대신 반투명
    if (p.face < 0) {
      ctx.translate(sx + 16, sy);
      ctx.scale(-1, 1);
    } else ctx.translate(sx, sy);
    ctx.drawImage(spr(frame), 0, 0);
    // 칼: 손잡이를 축으로 회전
    let ang = 20;
    if (p.atk) ang = p.atk > 10 ? -45 : p.atk > 4 ? 120 : 60;
    ctx.translate(15, 11);
    ctx.rotate((ang * Math.PI) / 180);
    ctx.drawImage(SWORD_IMGS[p.sword], -2, -13);
    ctx.restore();
    // 칼 궤적
    if (p.atk > 3 && p.atk < 11) {
      ctx.strokeStyle = p.sword ? SWORD_COLORS[p.sword] : "#FFFFFF";
      ctx.lineWidth = 3;
      ctx.beginPath();
      const ccx = sx + (p.face > 0 ? 14 : 2);
      ctx.arc(ccx, sy + 8, 15, p.face > 0 ? -1.2 : Math.PI - 0.6, p.face > 0 ? 0.6 : Math.PI + 1.2);
      ctx.stroke();
    }
  };

  const drawLevel = () => {
    const shake = reduceMotion ? 0 : lv.shake;
    const shakeX = shake ? Math.round(Math.sin(state.t * 13) * shake * 0.4) : 0;
    const shakeY = shake ? Math.round(Math.cos(state.t * 7) * shake * 0.4) : 0;
    const cx = Math.round(lv.camX) - shakeX;
    ctx.save();
    ctx.translate(0, shakeY);
    drawBg();
    drawTiles(cx);

    // 표지판
    lv.signs.forEach((s) => ctx.drawImage(spr("SIGN"), s.x - cx, 10 * T - 12));
    // 깃발
    if (lv.flagX != null) ctx.drawImage(spr("FLAG"), lv.flagX - cx, 10 * T - 16);

    // 아이템
    lv.items.forEach((it) => {
      if (it.taken) return;
      const bob = Math.round(Math.sin(it.t / 10) * 1.5);
      ctx.drawImage(it.img, Math.round(it.x - cx), it.y + bob);
      if (it.k === "J") text("JENKINS", it.x - cx + 4, it.y - 12, "#F77622", FONT, "center");
      if (it.k === "g") text(it.label, it.x - cx + 4, it.y - 12, "#FFFFFF", FONT, "center");
    });

    // 적
    lv.enemies.forEach((e) => {
      if (!e.alive || e.x - cx < -20 || e.x - cx > W + 20) return;
      ctx.save();
      ctx.translate(Math.round(e.x - cx) + (e.vx > 0 ? 12 : 0), Math.round(e.y));
      if (e.vx > 0) ctx.scale(-1, 1);
      ctx.drawImage(e.img, 0, Math.floor(state.t / 8) % 2);
      ctx.restore();
    });

    // 보스
    const b = lv.boss;
    if (b && (b.alive || (b.dead && b.dead < 40 && (reduceMotion || b.dead % 4 < 2)))) {
      const flash = !reduceMotion && b.inv && b.inv % 4 < 2;
      ctx.drawImage(flash ? b.flashImg : b.img, Math.round(b.x - cx), Math.round(b.y), 40, 36);
    }

    // 동료 봇
    lv.bots.forEach((bot, i) => ctx.drawImage(BOT_IMGS[i], Math.round(bot.x - cx), Math.round(bot.y + Math.sin((state.t + i * 9) / 8) * 2)));

    drawPlayer(cx);

    // 레이저
    lv.lasers.forEach((l) => {
      ctx.strokeStyle = l.c;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(l.x1 - cx, l.y1);
      ctx.lineTo(l.x2 - cx, l.y2);
      ctx.stroke();
    });
    // 파티클
    lv.particles.forEach((q) => {
      ctx.fillStyle = q.c;
      ctx.fillRect(Math.round(q.x - cx), Math.round(q.y), 2, 2);
    });
    // 블록에서 나온 성과 카드 (세계 좌표에 고정)
    lv.blocks.forEach((k) => {
      if (!k.cardT) return;
      const rise = Math.min(1, k.cardT / 12);
      const x = k.tx * T + 8 - cx - 40;
      const y = k.ty * T - 14 - rise * 38;
      box(x, y, 80, 44, "#FEE761");
      text(k.info[0], x + 6, y + 5, "#8B9BB4");
      text(k.info[1], x + 6, y + 17, "#3DDC84", FONT_B);
      text(k.info[2], x + 6, y + 29, "#C0CBDC");
    });
    // 떠오르는 글자
    lv.texts.forEach((t) => {
      ctx.globalAlpha = Math.min(1, t.life / 15);
      text(t.text, Math.round(t.x - cx), Math.round(t.y), t.color, FONT_B, "center");
      ctx.globalAlpha = 1;
    });
    ctx.restore();

    drawHud();
    if (lv.sign && state.scene === "play") drawDialog(lv.sign.text);
    if (b && b.active && b.alive) {
      text(b.name, W - 110, 30, "#FFFFFF");
      box(W - 110, 43, 100, 8);
      ctx.fillStyle = b.hp / b.max > 0.34 ? "#3DDC84" : "#E43B44";
      ctx.fillRect(W - 108, 45, Math.round((96 * b.hp) / b.max), 4);
    }
  };

  const drawHud = () => {
    ctx.textBaseline = "top";
    text("SEUNGJUN", 8, 6, "#8B9BB4");
    text(String(state.score).padStart(6, "0"), 8, 17);
    ctx.drawImage(spr("COIN"), 76, 17);
    text(`×${String(state.coins).padStart(2, "0")}`, 87, 17);
    text("WORLD", 140, 6, "#8B9BB4");
    text(lv.def.id, 140, 17);
    for (let i = 0; i < 3; i++) ctx.drawImage(i < player.hp ? ITEM_IMGS.h : HEART_EMPTY, 196 + i * 11, 17);
    if (lv.bots.length) text(`PARTY ${lv.bots.length} · SKILL ${state.skills}`, W - 8, 6, "#C59BFF", FONT, "right");
    if (state.paused) {
      box(W / 2 - 80, H / 2 - 20, 160, 40);
      text("PAUSE", W / 2, H / 2 - 13, "#FEE761", FONT_B, "center");
      text("ENTER / 탭 으로 계속", W / 2, H / 2 + 2, "#FFFFFF", FONT, "center");
    }
  };

  // 표지판 문구: 캐릭터를 가리지 않도록 HUD 바로 아래에 글 길이만큼만 띄운다
  const drawDialog = (msg) => {
    const lines = msg.split("\n");
    ctx.font = FONT;
    const w = Math.min(W - 16, Math.max(...lines.map((l) => ctx.measureText(l).width)) + 20);
    const h = 8 + lines.length * 13;
    const x = Math.round((W - w) / 2);
    box(x, 32, w, h);
    lines.forEach((l, i) => text(l, x + 10, 36 + i * 13, i === 0 ? "#FEE761" : "#FFFFFF"));
  };

  const drawTitle = () => {
    ctx.fillStyle = "#2A1B4D";
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = "#3B2A6B";
    ctx.fillRect(0, H / 2, W, H / 2);
    ctx.fillStyle = "#FFFFFF";
    for (let i = 0; i < 40; i++) if ((Math.floor(state.t / 20) + i) % 5) ctx.fillRect((i * 83) % W, (i * 41) % 90, 1, 1);
    ctx.fillStyle = "#8F563B";
    ctx.fillRect(0, H - 24, W, 24);
    ctx.fillStyle = "#3DDC84";
    ctx.fillRect(0, H - 24, W, 3);
    ctx.textBaseline = "top";
    text("SEUNGJUN", W / 2, 22, "#FEE761", FONT_L, "center");
    text("QUEST", W / 2, 48, "#FEE761", FONT_L, "center");
    text("- 안드로이드 개발자 10년의 모험 -", W / 2, 80, "#FFFFFF", FONT, "center");
    text("← → 이동   Z/↑/스페이스 점프   X 공격", W / 2, 104, "#C0CBDC", FONT, "center");
    text("몬스터는 베거나 밟아서 처치 · M 소리 · ESC 닫기", W / 2, 118, "#8B9BB4", FONT, "center");
    if (Math.floor(state.t / 30) % 2 === 0) text("PRESS ENTER / TAP", W / 2, 140, "#3DDC84", FONT_B, "center");
    ctx.drawImage(spr(Math.floor(state.t / 15) % 2 ? "HERO_A" : "HERO_B"), W / 2 - 8, H - 40);
  };

  const drawClear = () => {
    drawLevel();
    const k = Math.min(1, lv.clearT / 20);
    ctx.fillStyle = `rgba(0,0,0,${0.75 * k})`;
    ctx.fillRect(0, 0, W, H);
    if (lv.clearT < 10) return;
    const lines = lv.def.clear;
    text("STAGE CLEAR!", W / 2, 34, "#FEE761", FONT_L, "center");
    text(`WORLD ${lv.def.id}`, W / 2, 64, "#8B9BB4", FONT, "center");
    lines.forEach((l, i) => text(l, W / 2, 86 + i * 15, i === 0 ? "#3DDC84" : "#FFFFFF", i === 0 ? FONT_B : FONT, "center"));
    if (lv.clearT > 40 && Math.floor(state.t / 30) % 2 === 0) text("NEXT ▶ ENTER / TAP", W / 2, H - 22, "#FEE761", FONT, "center");
  };

  const drawEnding = () => {
    ctx.fillStyle = "#0B0B24";
    ctx.fillRect(0, 0, W, H);
    ctx.textBaseline = "top";
    text("ALL STAGES CLEAR!", W / 2, 10, "#FEE761", FONT_L, "center");
    box(14, 42, W - 28, 100);
    const rows = [
      ["NAME", "이승준", "#FFFFFF"],
      ["CLASS", "Android Engineer", "#3DDC84"],
      ["LV", "10 (2016 → NOW)", "#FFFFFF"],
      ["ULT", "Claude Code 멀티에이전트", "#C59BFF"],
      ["SCORE", String(state.score).padStart(6, "0"), "#FEE761"],
      ["CONTACT", "6951004@gmail.com", "#FFFFFF"],
    ];
    rows.forEach(([k, v, c], i) => {
      if ((state.endT || 0) < 10 + i * 6) return;
      text(k, 26, 50 + i * 14, "#FEE761");
      text(v, 92, 50 + i * 14, c);
    });
    text("github.com/ESeungJun", W / 2, 150, "#C0CBDC", FONT, "center");
    if ((state.endT || 0) > 60 && Math.floor(state.t / 30) % 2 === 0) text("THANK YOU FOR PLAYING · ENTER", W / 2, 170, "#3DDC84", FONT, "center");
  };

  const draw = () => {
    ctx.imageSmoothingEnabled = false;
    ctx.textBaseline = "top";
    if (state.scene === "title") drawTitle();
    else if (state.scene === "play") drawLevel();
    else if (state.scene === "clear") drawClear();
    else if (state.scene === "ending") drawEnding();
  };

  // ───────── 루프 ─────────
  let raf = 0;
  let last = 0;
  let acc = 0;
  const STEP = 1000 / 60;
  const loop = (now) => {
    raf = requestAnimationFrame(loop);
    acc += Math.min(100, now - last);
    last = now;
    let n = 0;
    while (acc >= STEP && n < 4) {
      update();
      acc -= STEP;
      n++;
    }
    draw();
  };

  // 화면에 맞는 정수 배율 (작은 화면은 비율 유지)
  const fit = () => {
    const touch = matchMedia("(pointer: coarse)").matches;
    const landscape = window.innerWidth > window.innerHeight;
    // 터치 가로: 버튼이 좌우에 겹쳐 뜨므로 그만큼 비우고, 세로: 아래에 버튼 줄
    const availH = window.innerHeight - (touch ? (landscape ? 44 : 150) : 60);
    const availW = window.innerWidth - (touch && landscape ? 300 : 16);
    let s = Math.min(availW / W, availH / H);
    if (s >= 2) s = Math.floor(s);
    canvas.width = W;
    canvas.height = H;
    canvas.style.width = `${Math.floor(W * s)}px`;
    canvas.style.height = `${Math.floor(H * s)}px`;
    root.classList.toggle("is-touch", touch);
  };

  // BGM 은 게임이 보이고, 멈추지 않았고, 소리가 켜져 있을 때만 튼다
  const syncBgm = () => {
    if (!root.hidden && !document.hidden && !state.paused && !muted) bgm.play().catch(() => {});
    else bgm.pause();
  };
  const setPaused = (v) => {
    state.paused = v;
    syncBgm();
  };

  const muteBtn = document.getElementById("game-mute");
  const toggleMute = () => {
    muted = !muted;
    bgm.muted = muted;
    muteBtn.textContent = muted ? "♪ OFF" : "♪ ON";
    muteBtn.setAttribute("aria-pressed", String(!muted));
    syncBgm();
  };

  // 게임이 열려 있는 동안 뒤쪽 페이지는 포커스·클릭이 닿지 않게 한다
  const page = [document.querySelector("main"), document.querySelector("header")];
  let lastFocus = null;
  const open = async () => {
    lastFocus = document.activeElement;
    root.hidden = false;
    page.forEach((el) => (el.inert = true));
    document.body.classList.add("is-gaming");
    state.paused = false;
    clearInput();
    fit();
    if (!actx) actx = new (window.AudioContext || window.webkitAudioContext)();
    actx.resume?.();
    try {
      await document.fonts.load(FONT);
      await document.fonts.load(FONT_B);
    } catch {}
    // 폰트를 기다리는 사이 닫혔으면 다시 시작하지 않는다
    if (root.hidden) return;
    bgm.volume = 0.35;
    bgm.currentTime = 0;
    syncBgm();
    state.scene = "title";
    last = performance.now();
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(loop);
    canvas.focus();
  };

  const close = () => {
    root.hidden = true;
    page.forEach((el) => (el.inert = false));
    document.body.classList.remove("is-gaming");
    cancelAnimationFrame(raf);
    bgm.pause();
    clearInput();
    lastFocus && lastFocus.focus();
  };

  window.addEventListener("resize", () => !root.hidden && fit());
  document.getElementById("game-close").addEventListener("click", close);
  muteBtn.addEventListener("click", () => {
    toggleMute();
    canvas.focus(); // 키 입력이 다시 게임으로 가게
  });
  document.querySelectorAll("[data-open-game]").forEach((b) => b.addEventListener("click", open));
  // 창을 떠나면 keyup 이 안 오므로 눌린 키를 모두 놓는다
  window.addEventListener("blur", clearInput);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      clearInput();
      if (!root.hidden && state.scene === "play") state.paused = true;
    }
    syncBgm();
  });

  // 테스트용 진입점 (?debug 일 때만)
  if (new URLSearchParams(location.search).has("debug")) {
    window.__quest = { state, player, startLevel, get lv() { return lv; }, LEVELS };
  }
})();
