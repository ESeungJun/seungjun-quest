(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  // ───────── 데이터 (노션 포트폴리오 기준) ─────────
  const RARITY = {
    "AI 활용 작업": "LEGENDARY",
    "신규 기능 개발": "EPIC",
    "핵심 지면 작업": "RARE",
    아키텍처: "RARE",
    "협업·프로세스": "UNCOMMON",
  };

  const QUESTS = [
    {
      cat: "AI 활용 작업",
      n: 1,
      title: "프로젝트 내 클로드 AI 시스템 구축",
      line: "에이전트 4종·스킬 7종을 직접 설계, 팀 표준 패턴이 되어 팀원 4명이 에이전트 5개·스킬 10개를 추가 확장",
      result: "권한 격리 한계 실험 검증 · 컨벤션 게이트로 LLM 실패 모드 차단 · 실측 기반 게이트 재설계와 문서 체계 재정비",
      keys: ["Claude Code", "멀티에이전트", "하네스 엔지니어링", "레거시 리팩토링", "Compose 전환"],
    },
    {
      cat: "AI 활용 작업",
      n: 2,
      title: "팀 개발 프로세스 자동화 (n8n)",
      line: "코드리뷰부터 문서화까지 개발 라이프사이클 전 구간 자동화 8종",
      result: "반복적인 업무들의 자동화를 통해 업무 효율성 증대",
      keys: ["n8n", "Claude", "Gemini", "RAG", "DevEx"],
    },
    {
      cat: "AI 활용 작업",
      n: 11,
      title: "App 대시보드 — AOS · iOS 팀 현황 통합 웹",
      line: "구조 · 기능 · 딥링크 · 지라 · PR · 크래시 · 성능 · 리뷰를 한 곳에 모은 사내 앱 대시보드",
      result: "흩어진 앱 현황 10여 종을 보드 3개로 통합, Claude Code 에이전트 지휘로 기획부터 운영 배포까지 1인 완주",
      keys: ["Claude Code", "Next.js", "Supabase", "BigQuery", "Figma", "LLM"],
    },
    {
      cat: "AI 활용 작업",
      n: 5,
      title: "AIPT 활동 (AI를 활용한 사내 서비스 구축)",
      line: "AI 에이전트 협업으로 프로덕션 서비스 2종 구축, VOC 리포트는 설계부터 운영까지 단독 담당",
      result: "K8s 배포·장애 진단 · LLM 분류 17분→9분 최적화",
      keys: ["Claude API", "Kubernetes", "LLM 운영"],
    },
    {
      cat: "AI 활용 작업",
      n: 3,
      title: "사내 AI 스터디",
      line: "직군 무관 14명 대상 3주 Claude Code 커리큘럼 설계·리드",
      result: "참여자 전원 프로젝트 완성 · 결과 사이트 전사 공개",
      keys: ["조직 문화", "교육 설계", "Claude Code"],
    },
    {
      cat: "신규 기능 개발",
      n: 6,
      title: "숏폼 동영상 플레이어",
      line: "Media3 기반 촬영→업로드→재생 전 구간 미디어 인프라",
      result: "일 시청 11만 · 결제 전환율 2배",
      keys: ["Media3", "ExoPlayer", "성능 최적화"],
    },
    {
      cat: "신규 기능 개발",
      n: 4,
      title: "실험실 — 1인 프로덕션 채널",
      line: "기획·디자인·개발을 혼자 운영하는 사내 실험 채널",
      result: "AI 이미지 검색 실험실 MVP → 정규 epic 전환 · 간편검색·알림확인 등 4개 기능 순차 출시",
      keys: ["MVP 검증", "제품 오너십", "솔로 운영"],
    },
    {
      cat: "핵심 지면 작업",
      n: 7,
      title: "핵심 지면 작업",
      line: "핵심 지면 재설계 — UI/UX부터 수익 모델 구조까지",
      result: "핵심 화면·수익 모델 10건 구조 개편 · UP하기 매출 +35% · 광고 대기 0초화",
      keys: ["구조 개편", "UX 리뉴얼", "UP하기", "광고 SDK"],
    },
    {
      cat: "아키텍처",
      n: 8,
      title: "구조 리팩토링 및 Compose 마이그레이션",
      line: "MVP 에서 MVVM까지 구조 리팩토링 및 Compose 마이그레이션",
      result: "MVP→MVVM→Clean+멀티모듈→Compose 점진 전환",
      keys: ["Clean Architecture", "멀티모듈", "레거시 재설계"],
    },
    {
      cat: "아키텍처",
      n: 9,
      title: "CI/CD 자동화 — Bitbucket에서 Jenkins로",
      line: "빌드·배포 파이프라인을 로컬 Jenkins로 이관해 자동화",
      result: "Bitbucket CI/CD → Jenkins 마이그레이션, Slack 배포 연동",
      keys: ["Jenkins", "CI/CD", "자동 배포"],
    },
    {
      cat: "협업·프로세스",
      n: 10,
      title: "디자인 시스템 — 컴포넌트 규칙에서 디자인 플랫폼 팀까지",
      line: "PD-개발 컴포넌트 규칙 정의에서 출발해 웹·AOS·iOS·디자이너가 함께하는 디자인 플랫폼 팀으로 확장",
      result: "3계층 토큰 아키텍처 구축 중 · Figma Code Connect 33개 · Lint 룰 8종으로 컨벤션 강제",
      keys: ["디자인 시스템", "크로스펑셔널 협업", "컴포넌트"],
    },
  ];

  const ITEMS = [
    { icon: "Kt", name: "Kotlin", desc: "주력 언어. 10년 동안 Android 앱을 만들어 온 기본 무기." },
    { icon: "JC", name: "Jetpack Compose", desc: "레거시 구조를 단계적으로 Compose 로 전환." },
    { icon: "M3", name: "Media3", desc: "Media3 / ExoPlayer 로 숏폼 촬영→업로드→재생 전 구간을 구축." },
    { icon: "Co", name: "Coroutine · Flow", desc: "비동기 처리와 데이터 스트림." },
    { icon: "Hi", name: "Hilt", desc: "의존성 주입." },
    { icon: "CA", name: "Clean Arch", desc: "MVP → MVVM → Clean Architecture + 멀티모듈 전환에 참여." },
    { icon: "MM", name: "멀티모듈", desc: "레이어 · 기능 단위 멀티모듈 구조." },
    { icon: "Jk", name: "Jenkins", desc: "Bitbucket CI/CD 를 Jenkins 로 이관하고 Slack 배포 연동." },
    { icon: "CC", name: "Claude Code", desc: "멀티에이전트 파이프라인 · 컨벤션 하네스(AIRU)를 설계해 팀 표준으로 정착.", ai: true },
    { icon: "n8", name: "n8n", desc: "코드리뷰부터 문서화까지 개발 라이프사이클 자동화 8종.", ai: true },
    { icon: "AI", name: "Claude API", desc: "사내 서비스 2종 구축, LLM 분류 17분 → 9분 최적화.", ai: true },
    { icon: "Fg", name: "Code Connect", desc: "디자인 시스템 컴포넌트 33개를 Figma Code Connect 로 연결." },
  ];

  // ───────── 8비트 효과음 (Web Audio, 기본 꺼짐) ─────────
  let audio = null;
  let soundOn = false;
  const tone = (freqs, dur = 0.08, type = "square", vol = 0.06) => {
    if (!soundOn || !audio) return;
    const t0 = audio.currentTime;
    freqs.forEach((f, i) => {
      const o = audio.createOscillator();
      const g = audio.createGain();
      o.type = type;
      o.frequency.value = f;
      g.gain.setValueAtTime(vol, t0 + i * dur);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + (i + 1) * dur);
      o.connect(g).connect(audio.destination);
      o.start(t0 + i * dur);
      o.stop(t0 + (i + 1) * dur + 0.02);
    });
  };
  const sfx = {
    coin: () => tone([988, 1319], 0.07),
    click: () => tone([660], 0.04, "square", 0.04),
    open: () => tone([523, 659, 784], 0.06),
    bump: () => tone([196, 392, 784, 1047], 0.05),
    clear: () => tone([523, 659, 784, 1047, 784, 1047], 0.09),
    secret: () => tone([392, 523, 659, 784, 1047, 1319, 1568], 0.07),
  };
  $("#sound").addEventListener("click", (e) => {
    soundOn = !soundOn;
    if (soundOn && !audio) audio = new (window.AudioContext || window.webkitAudioContext)();
    e.currentTarget.textContent = soundOn ? "♪ ON" : "♪ OFF";
    e.currentTarget.setAttribute("aria-pressed", String(soundOn));
    sfx.coin();
  });

  // ───────── 점수 · 코인 ─────────
  let score = 0;
  let coins = 0;
  const addScore = (n) => {
    score += n;
    $("#score").textContent = String(score).padStart(6, "0");
  };
  const addCoin = () => {
    coins += 1;
    $("#coins").textContent = String(coins).padStart(2, "0");
  };

  // ───────── 파티클 ─────────
  const fx = $("#fx");
  const burst = (x, y, colors = ["#FEE761", "#3DDC84", "#FFFFFF"], n = 10, text) => {
    if (reduceMotion) return;
    for (let i = 0; i < n; i++) {
      const p = document.createElement("i");
      p.className = "particle";
      const a = (i / n) * Math.PI * 2;
      const d = 40 + Math.random() * 40;
      p.style.left = `${x}px`;
      p.style.top = `${y}px`;
      p.style.background = colors[i % colors.length];
      p.style.setProperty("--dx", `${Math.round(Math.cos(a) * d / 4) * 4}px`);
      p.style.setProperty("--dy", `${Math.round(Math.sin(a) * d / 4) * 4}px`);
      fx.appendChild(p);
      setTimeout(() => p.remove(), 650);
    }
    if (text) {
      const t = document.createElement("span");
      t.className = "float-score";
      t.textContent = text;
      t.style.left = `${x - 16}px`;
      t.style.top = `${y - 30}px`;
      fx.appendChild(t);
      setTimeout(() => t.remove(), 750);
    }
  };
  document.addEventListener("pointerdown", (e) => {
    // 상세 본문 읽기와 게임 조작에는 끼어들지 않는다
    if (e.target.closest(".quest-detail, #game")) return;
    burst(e.clientX, e.clientY, undefined, 8, "+10");
    addScore(10);
    sfx.click();
  });

  // ───────── 부팅 화면 ─────────
  paintSprites();
  // 게이지 값은 CSP(style-src 'self') 때문에 style 속성 대신 여기서 넣는다
  $$(".bar i[data-v]").forEach((i) => i.style.setProperty("--v", i.dataset.v));
  setTimeout(() => $("#boot").classList.add("is-done"), reduceMotion ? 0 : 1000);

  // ───────── 별 · 패럴랙스 ─────────
  // 별 70개를 요소 두 개의 box-shadow 로 그린다 (요소별 애니메이션 비용 제거)
  const paintStars = () => {
    const w = window.innerWidth;
    const h = $(".title").offsetHeight * 0.6;
    const layers = [[], []];
    for (let i = 0; i < 70; i++) {
      layers[i % 2].push(`${Math.round(((i * 271) % 100) / 100 * w / 4) * 4}px ${Math.round(((i * 137) % 100) / 100 * h / 4) * 4}px 0 #fff`);
    }
    $(".star-layer.a").style.boxShadow = layers[0].join(",");
    $(".star-layer.b").style.boxShadow = layers[1].join(",");
  };
  paintStars();
  const layers = $$("[data-parallax]");

  // ───────── 소개 영상 ─────────
  const video = $("#intro-video");
  $("#play").addEventListener("click", (e) => {
    e.currentTarget.hidden = true;
    video.controls = true;
    // 재생이 막혀도 컨트롤이 켜져 있으니 직접 누르면 된다
    video.play().catch(() => {});
    sfx.open();
  });

  // ───────── 화면 진입 연출 ─────────
  const io = new IntersectionObserver(
    (entries) => entries.forEach((en) => en.isIntersecting && en.target.classList.add("is-in")),
    { threshold: 0.25 },
  );
  $$(".reveal").forEach((el) => io.observe(el));

  // ───────── 스크롤: HUD WORLD 표시 · 메뉴 강조 ─────────
  const sections = $$("main section[data-world]");
  const navLinks = $$(".hud-nav a");
  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        $("#world").textContent = en.target.dataset.world;
        navLinks.forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === `#${en.target.id}`));
      });
    },
    { rootMargin: "-45% 0px -50% 0px" },
  );
  sections.forEach((s) => spy.observe(s));

  // ───────── 월드맵: 스크롤 따라 걷는 영웅 ─────────
  // 스크롤마다 레이아웃을 다시 계산하지 않도록 위치는 미리 재 두고, rAF 한 번에 쓰기만 한다.
  const title = $(".title");
  const track = $("#map-track");
  const mapHero = $("#map-hero");
  const nodes = $$(".node", track).map((el) => ({ el, top: 0, done: false }));
  let trackTop = 0;
  let trackHeight = 1;
  let titleVisible = true;
  let lastStepY = 0;
  let ticking = false;

  const measure = () => {
    trackTop = track.getBoundingClientRect().top + window.scrollY;
    trackHeight = track.offsetHeight;
    nodes.forEach((n) => (n.top = n.el.offsetTop));
  };

  const render = () => {
    ticking = false;
    const y = window.scrollY;
    if (titleVisible) layers.forEach((l) => (l.style.transform = `translate3d(${-y * Number(l.dataset.parallax)}px,0,0)`));

    const progress = Math.min(1, Math.max(0, (y + window.innerHeight * 0.55 - trackTop) / trackHeight));
    const top = Math.round((progress * (trackHeight - 80)) / 4) * 4;
    mapHero.style.transform = `translate3d(0,${top}px,0)`;
    if (Math.abs(y - lastStepY) > 24) {
      mapHero.classList.toggle("is-step");
      lastStepY = y;
    }
    nodes.forEach((n) => {
      if (n.done || top < n.top + 10) return;
      n.done = true;
      n.el.classList.add("is-cleared");
      addScore(500);
      sfx.clear();
      const fr = n.el.querySelector(".node-flag").getBoundingClientRect();
      burst(fr.left + fr.width / 2, fr.top + fr.height / 2, ["#3DDC84", "#FEE761", "#FFFFFF"], 14, "+500");
    });
  };
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(render);
  };

  new IntersectionObserver(([en]) => {
    titleVisible = en.isIntersecting;
    title.classList.toggle("is-off", !titleVisible);
  }).observe(title);

  window.addEventListener("scroll", onScroll, { passive: true });
  // 크기 변경은 프레임당 한 번만 처리하고, 별은 폭이 바뀔 때만 다시 그린다
  let resizing = false;
  let starsW = window.innerWidth;
  window.addEventListener("resize", () => {
    if (resizing) return;
    resizing = true;
    requestAnimationFrame(() => {
      resizing = false;
      if (window.innerWidth !== starsW) {
        starsW = window.innerWidth;
        paintStars();
      }
      measure();
      render();
    });
  });
  window.addEventListener("load", () => {
    paintStars(); // 폰트가 늦게 붙으면 타이틀 높이가 바뀐다
    measure();
    onScroll();
  });
  measure();
  render();

  // ───────── ? 블록 ─────────
  $$(".qblock").forEach((b) => {
    b.setAttribute("aria-label", `${b.dataset.label} 성과 열기`);
    b.addEventListener("click", () => {
      if (b.classList.contains("is-used")) return;
      b.classList.add("is-bump", "is-used");
      b.querySelector(".qblock-face").innerHTML = spriteSVG("USED_BLOCK", 7);
      const prize = document.createElement("div");
      prize.className = "prize";
      [
        ["prize-label", b.dataset.label],
        ["prize-value", b.dataset.value],
        ["prize-note", b.dataset.note],
      ].forEach(([cls, text]) => {
        const d = document.createElement("div");
        d.className = cls;
        d.textContent = text;
        prize.appendChild(d);
      });
      b.appendChild(prize);
      b.setAttribute("aria-label", `${b.dataset.label} ${b.dataset.value} · ${b.dataset.note}`);
      b.setAttribute("aria-disabled", "true");
      const r = b.getBoundingClientRect();
      burst(r.left + r.width / 2, r.top, ["#FEE761", "#F77622", "#FFFFFF"], 12, "+2500");
      addScore(2500);
      addCoin();
      sfx.bump();
      setTimeout(sfx.coin, 160);
    });
  });

  // ───────── 퀘스트 저널 ─────────
  const list = $("#quest-list");
  const detail = $("#quest-detail");
  const status = $("#quest-status");
  const viewed = new Set();
  let details = null;
  let current = 0;

  const el = (tag, cls, text) => {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  };

  // 노션 본문 블록을 DOM 으로. 모든 글은 textContent 로만 넣는다.
  const renderBlocks = (sections) => {
    const body = el("div", "qd-body");
    sections.forEach((sec) => {
      if (!sec.blocks.length && !sec.heading) return;
      if (sec.heading) body.appendChild(el("h4", null, sec.heading));
      sec.blocks.forEach((b) => {
        if (b.type === "p") {
          // "목적", "설계 방향" 처럼 짧은 단독 문단은 소제목으로
          const t = b.text.trim();
          const isLabel = t.length <= 16 && !/[.!?。:)]$/.test(t) && !t.includes("\n");
          body.appendChild(el(isLabel ? "h5" : "p", null, t));
        } else if (b.type === "ul") {
          const ul = el("ul");
          b.items.forEach((it) => {
            const sub = it.startsWith("  · ");
            ul.appendChild(el("li", sub ? "sub" : null, sub ? `· ${it.slice(4)}` : it));
          });
          body.appendChild(ul);
        } else if (b.type === "quote") {
          body.appendChild(el("blockquote", null, b.text));
        } else if (b.type === "table") {
          const wrap = el("div", "table-wrap");
          const table = el("table");
          b.rows.forEach((row, i) => {
            const tr = el("tr");
            row.forEach((c) => tr.appendChild(el(i === 0 ? "th" : "td", null, c)));
            table.appendChild(tr);
          });
          wrap.appendChild(table);
          body.appendChild(wrap);
        }
      });
    });
    return body;
  };

  const showQuest = (i, { focus = false, scroll = false, count = true } = {}) => {
    const q = QUESTS[i];
    current = i;
    $$(".quest-row", list).forEach((r) => {
      if (Number(r.dataset.i) === i) r.setAttribute("aria-current", "true");
      else r.removeAttribute("aria-current");
    });
    detail.dataset.rarity = RARITY[q.cat];

    const keys = el("div", "qd-keys");
    q.keys.forEach((k) => keys.appendChild(el("span", null, k)));
    const ask = el("div", "qd-box");
    ask.append(el("b", null, "의뢰 내용"), document.createTextNode(q.line));
    const reward = el("div", "qd-box reward");
    reward.append(el("b", null, "보상"), document.createTextNode(q.result));

    const parts = [
      el("div", "qd-tag", `${RARITY[q.cat]} · ${q.cat}`),
      el("h3", "qd-title", q.title),
      ask,
      reward,
      keys,
      el("h4", "qd-log-title", "▶ 퀘스트 기록"),
    ];
    const d = details && details[String(q.n)];
    parts.push(d ? renderBlocks(d.sections) : el("p", "qd-empty", details === null ? "기록을 불러오는 중…" : "상세 기록이 없습니다."));
    detail.replaceChildren(...parts);
    detail.scrollTop = 0;

    if (focus) detail.focus({ preventScroll: true });
    if (scroll) detail.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    // 긴 본문 대신 제목만 읽어 준다 (사용자가 고른 경우에만)
    if (count) status.textContent = `${q.title} 퀘스트를 열었습니다`;
    if (count && !viewed.has(i)) {
      viewed.add(i);
      addScore(100);
      addCoin();
    }
  };

  QUESTS.forEach((q, i) => {
    const li = el("li");
    const row = el("button", "quest-row");
    row.type = "button";
    row.dataset.i = String(i);
    row.dataset.cat = q.cat;
    row.dataset.rarity = RARITY[q.cat];
    const name = el("span", null, q.title);
    name.appendChild(el("span", "rar", RARITY[q.cat]));
    row.append(el("span", "mark"), name);
    row.addEventListener("click", () => {
      showQuest(i, { scroll: window.innerWidth <= 900 });
      sfx.open();
    });
    row.addEventListener("keydown", (e) => {
      if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
      e.preventDefault();
      const rows = $$("li:not(.is-hidden) > .quest-row", list);
      const k = rows.indexOf(row) + (e.key === "ArrowDown" ? 1 : -1);
      if (rows[k]) {
        rows[k].focus();
        rows[k].click();
      }
    });
    li.appendChild(row);
    list.appendChild(li);
  });

  $$(".tab").forEach((t) =>
    t.addEventListener("click", () => {
      $$(".tab").forEach((x) => {
        x.classList.toggle("is-active", x === t);
        x.setAttribute("aria-selected", String(x === t));
      });
      const f = t.dataset.filter;
      const rows = $$(".quest-row", list);
      rows.forEach((r) => r.parentElement.classList.toggle("is-hidden", f !== "all" && r.dataset.cat !== f));
      const first = rows.find((r) => !r.parentElement.classList.contains("is-hidden"));
      if (first) showQuest(Number(first.dataset.i));
      sfx.click();
    }),
  );

  $("#journal-count").textContent = `CLEAR ${QUESTS.length} / ${QUESTS.length}`;
  showQuest(0, { count: false });
  fetch("data/quests-detail.json")
    .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
    .then((json) => {
      details = json;
      showQuest(current, { count: false });
    })
    .catch(() => {
      details = {};
      showQuest(current, { count: false });
    });

  // ───────── 인벤토리 ─────────
  const slots = $("#slots");
  const desc = $("#slot-desc");
  ITEMS.forEach((it) => {
    const li = document.createElement("li");
    li.className = `slot${it.ai ? " ai" : ""}`;
    li.tabIndex = 0;
    const b = document.createElement("b");
    b.textContent = it.icon;
    b.style.color = it.ai ? "var(--purple-l)" : "var(--green)";
    const s = document.createElement("span");
    s.textContent = it.name;
    li.append(b, s);
    const show = () => {
      desc.textContent = `${it.name} — ${it.desc}`;
    };
    li.addEventListener("mouseenter", show);
    li.addEventListener("focus", show);
    li.addEventListener("click", show);
    slots.appendChild(li);
  });

  // ───────── CONTINUE 카운트다운 ─────────
  const count = $("#countdown");
  let counting = false;
  new IntersectionObserver(
    (entries) => {
      if (!entries[0].isIntersecting || counting) return;
      counting = true;
      let n = 9;
      const tick = setInterval(() => {
        n -= 1;
        if (n < 0) {
          clearInterval(tick);
          count.textContent = "♥";
          count.style.color = "var(--green)";
          return;
        }
        count.textContent = String(n);
        sfx.click();
      }, 700);
    },
    { threshold: 0.4 },
  ).observe($("#contact"));

  const party = $("#party");
  ["#3DDC84", "#5FCDE4", "#FEE761", "#FF6B97"].forEach((c, i) => {
    const el = document.createElement("span");
    el.dataset.sprite = "BOT";
    el.dataset.px = "5";
    el.dataset.color = c;
    if (i === 2) {
      const hero = document.createElement("span");
      hero.dataset.sprite = "HERO_A";
      hero.dataset.px = "7";
      party.appendChild(hero);
    }
    party.appendChild(el);
  });
  paintSprites(party);

  // ───────── 코나미 커맨드 ─────────
  const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
  let pos = 0;
  const game = $("#game");
  document.addEventListener("keydown", (e) => {
    if (!game.hidden) return; // 게임 조작 키와 겹치지 않게
    const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    // 틀린 키가 ↑ 면 처음부터가 아니라 ↑ 를 센 상태에서 다시 시작한다 (↑↑↑↓… 도 인정)
    pos = k === KONAMI[pos] ? pos + 1 : k === KONAMI[0] ? (pos === 2 ? 2 : 1) : 0;
    if (pos < KONAMI.length) return;
    pos = 0;
    const r = document.createElement("div");
    r.className = "runner";
    r.innerHTML = spriteSVG("HERO_A", 8);
    document.body.appendChild(r);
    setTimeout(() => r.remove(), 2700);
    addScore(10000);
    sfx.secret();
  });
})();
