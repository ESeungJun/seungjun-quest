// 페이지 연출. 내용(경력·성과·프로젝트·기술)의 원본은 index.html 이고, 여기서는 그 위에 동작만 얹는다.
(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const L = window.QuestLib;
  const root = document.documentElement;
  // boot.js 나 lib.js 가 없으면 아무것도 바꾸지 않는다. 정적 본문이 그대로 보인다.
  if (!L || !root.classList.contains("js")) {
    root.classList.remove("js");
    return;
  }
  // sprites.js 를 못 받았으면 그림 없이 간다
  const paintSprites = window.paintSprites || (() => {});
  const spriteSVG = window.spriteSVG || (() => "");
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const el = (tag, cls, text) => {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  };
  const isNarrow = () => window.innerWidth <= 900;

  // 기능 하나가 실패해도 나머지는 돈다. 본문을 바꾸는 기능이 실패하면 스크립트 없는 화면으로 되돌린다.
  const feature = (name, fn, content = false) => {
    try {
      fn();
    } catch (e) {
      console.error(`[quest] ${name}`, e);
      if (content) root.classList.remove("js");
    }
  };

  // ───────── 소리: 페이지와 게임이 같은 상태를 쓴다 (기본 꺼짐) ─────────
  let audio = null;
  let soundOn = false;
  const soundListeners = new Set();
  const setSound = (on) => {
    soundOn = Boolean(on);
    if (soundOn && !audio) {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (Ctx) audio = new Ctx();
    }
    const btn = $("#sound");
    if (btn) {
      btn.setAttribute("aria-pressed", String(soundOn));
      $("#sound-label").textContent = soundOn ? "ON" : "OFF";
    }
    soundListeners.forEach((fn) => fn(soundOn));
  };
  window.QuestSound = {
    get on() {
      return soundOn;
    },
    set: setSound,
    onChange: (fn) => soundListeners.add(fn),
  };
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
  feature("sound", () => {
    $("#sound").addEventListener("click", () => {
      setSound(!soundOn);
      sfx.coin();
    });
  });

  // ───────── 점수 · 코인 (블록 치기, 경력 지점 통과, 퀘스트 열기에만 오른다) ─────────
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
  const burst = (x, y, colors, n = 10, text) => {
    if (reduceMotion || !fx) return;
    for (let i = 0; i < n; i++) {
      const p = el("i", "particle");
      const a = (i / n) * Math.PI * 2;
      const d = 40 + Math.random() * 40;
      p.style.left = `${x}px`;
      p.style.top = `${y}px`;
      p.style.background = colors[i % colors.length];
      p.style.setProperty("--dx", `${Math.round((Math.cos(a) * d) / 4) * 4}px`);
      p.style.setProperty("--dy", `${Math.round((Math.sin(a) * d) / 4) * 4}px`);
      fx.appendChild(p);
      setTimeout(() => p.remove(), 650);
    }
    if (text) {
      const t = el("span", "float-score", text);
      t.style.left = `${x - 24}px`;
      t.style.top = `${y - 32}px`;
      fx.appendChild(t);
      setTimeout(() => t.remove(), 750);
    }
  };
  const FX_GOLD = ["#FEE761", "#F77622", "#FFFFFF"];
  const FX_GREEN = ["#3DDC84", "#FEE761", "#FFFFFF"];

  feature("sprites", () => paintSprites());

  // ───────── 게임: 처음 누를 때 game.js 를 받는다 ─────────
  feature("game-loader", () => {
    let loading = null;
    const openGame = () => {
      if (window.QuestGame) return window.QuestGame.open();
      if (!loading) {
        loading = new Promise((resolve, reject) => {
          const s = document.createElement("script");
          s.src = "game.js";
          s.onload = resolve;
          s.onerror = reject;
          document.body.appendChild(s);
        });
      }
      loading
        .then(() => window.QuestGame.open())
        .catch((e) => {
          loading = null;
          console.error("[quest] game.js 를 받지 못했습니다", e);
        });
    };
    $$("[data-open-game]").forEach((b) => b.addEventListener("click", openGame));
  });

  // ───────── 소개 영상: 기본 컨트롤 대신 화면 가운데 버튼으로 시작 ─────────
  feature("video", () => {
    const video = $("#intro-video");
    const play = $("#play");
    video.controls = false;
    play.hidden = false;
    play.addEventListener("click", () => {
      play.hidden = true;
      video.controls = true;
      // 재생이 막혀도 컨트롤이 켜져 있으니 직접 누르면 된다
      video.play().catch(() => {});
      sfx.open();
    });
  });

  // ───────── 스크롤: HUD WORLD 표시 · 메뉴 강조 · 폰 메뉴 접기 · 하단 연락 줄 ─────────
  const hud = $("#hud");
  const dock = $("#dock");
  const title = $(".title");
  const layers = $$("[data-parallax]");
  const track = $("#map-track");
  const mapHero = $("#map-hero");
  const nodes = $$(".node", track).map((node) => ({ el: node, top: 0, done: false }));
  let trackTop = 0;
  let trackHeight = 1;
  let titleHeight = 1;
  let titleVisible = true;
  let contactVisible = false;
  let lastStepY = 0;
  let lastY = 0;
  let ticking = false;

  feature("spy", () => {
    const sections = $$("main section[data-world]");
    const navLinks = $$(".hud-nav a");
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (!en.isIntersecting) return;
          $("#world").textContent = en.target.dataset.world;
          navLinks.forEach((a) => {
            const on = a.getAttribute("href") === `#${en.target.id}`;
            a.classList.toggle("is-active", on);
            if (on) a.setAttribute("aria-current", "true");
            else a.removeAttribute("aria-current");
            // 폰의 가로 메뉴에서는 지금 섹션이 보이게 민다
            if (on && isNarrow()) a.parentElement.scrollTo({ left: a.offsetLeft - 16, behavior: reduceMotion ? "auto" : "smooth" });
          });
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => spy.observe(s));
    new IntersectionObserver(([en]) => {
      titleVisible = en.isIntersecting;
      title.classList.toggle("is-off", !titleVisible);
    }).observe(title);
    new IntersectionObserver(([en]) => {
      contactVisible = en.isIntersecting;
      onScroll();
    }, { threshold: 0.3 }).observe($("#contact"));
  });

  // 스크롤마다 레이아웃을 다시 계산하지 않도록 위치는 미리 재 두고, rAF 한 번에 쓰기만 한다.
  const measure = () => {
    trackTop = track.getBoundingClientRect().top + window.scrollY;
    trackHeight = track.offsetHeight;
    titleHeight = title.offsetHeight;
    nodes.forEach((n) => (n.top = n.el.offsetTop));
  };
  const render = () => {
    ticking = false;
    const y = window.scrollY;
    if (titleVisible && !reduceMotion) layers.forEach((l) => (l.style.transform = `translate3d(${Math.round(-y * Number(l.dataset.parallax))}px,0,0)`));

    // 폰: 아래로 읽는 동안 메뉴 줄을 접고, 위로 올리면 다시 편다
    if (y < 80 || y < lastY - 4) hud.classList.remove("is-compact");
    else if (y > lastY + 4) hud.classList.add("is-compact");
    lastY = y;
    // 타이틀의 버튼이 지나간 뒤부터, 연락처 섹션에 닿기 전까지 하단 연락 줄을 보인다
    dock.classList.toggle("is-on", y > titleHeight * 0.6 && !contactVisible);

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
      burst(fr.left + fr.width / 2, fr.top + fr.height / 2, FX_GREEN, 14, "+500");
    });
  };
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(render);
  };
  feature("scroll", () => {
    window.addEventListener("scroll", onScroll, { passive: true });
    let resizing = false;
    window.addEventListener("resize", () => {
      if (resizing) return;
      resizing = true;
      requestAnimationFrame(() => {
        resizing = false;
        measure();
        render();
      });
    });
    // 글꼴이 늦게 붙으면 높이가 바뀐다
    window.addEventListener("load", () => {
      measure();
      onScroll();
    });
    measure();
    render();
  });

  // ───────── 퀘스트 저널 ─────────
  const RARITY = {
    "AI 활용 작업": "LEGENDARY",
    "신규 기능 개발": "EPIC",
    "핵심 지면 작업": "RARE",
    아키텍처: "RARE",
    "협업·프로세스": "UNCOMMON",
  };
  // 다른 기능(성과 블록, 주소)이 프로젝트를 열 때 쓴다
  let openQuestByN = () => false;

  feature(
    "journal",
    () => {
      const list = $("#quest-list");
      const detail = $("#quest-detail");
      const status = $("#quest-status");
      const countEl = $("#journal-count");
      const tabs = $$(".tab");
      const viewed = new Set();
      let details = null; // null: 아직 안 받음, false: 실패, 객체: 받음
      let loading = null;
      let current = 0;

      // index.html 의 목록을 읽는다 (원본은 HTML 한 곳)
      const QUESTS = $$(":scope > li", list).map((li) => ({
        li,
        n: Number(li.dataset.n),
        cat: li.dataset.cat,
        party: li.dataset.party || "",
        title: $("h3", li).textContent,
        line: $(".q-line", li).textContent,
        results: $$(".q-result li", li).map((x) => x.textContent),
        keys: $$(".q-keys li", li).map((x) => x.textContent),
      }));
      if (!QUESTS.length) throw new Error("프로젝트 목록이 비어 있습니다");

      const loadDetails = () => {
        if (details) return Promise.resolve(details);
        if (!loading) {
          loading = fetch("data/quests-detail.json")
            .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
            .then((json) => {
              details = json;
            })
            .catch((e) => {
              console.error("[quest] 상세 기록을 받지 못했습니다", e);
              details = false;
              loading = null;
            })
            .then(() => showQuest(current, { count: false }));
        }
        return loading;
      };

      // 노션 본문 블록을 DOM 으로. 모든 글은 textContent 로만 넣는다.
      const renderBlocks = (sections) => {
        const body = el("div", "qd-body");
        let meta = null;
        sections.forEach((sec, si) => {
          if (!sec.blocks.length && !sec.heading) return;
          if (sec.heading) body.appendChild(el("h4", null, sec.heading));
          sec.blocks.forEach((b, bi) => {
            if (b.type === "p") {
              const t = b.text.trim();
              // 첫 문단의 "기간 · 역할 · 키워드" 는 위쪽 고정 칸으로 올린다
              if (si === 0 && bi === 0) {
                meta = L.parseMeta(t);
                if (meta) return;
              }
              body.appendChild(el(L.isLabelParagraph(t) ? "h5" : "p", null, t));
            } else if (b.type === "ul") {
              const ul = el("ul");
              b.items.forEach((it) => {
                const sub = it.startsWith("  · ");
                ul.appendChild(el("li", sub ? "sub" : null, sub ? it.slice(4) : it));
              });
              body.appendChild(ul);
            } else if (b.type === "quote") {
              body.appendChild(el("p", "qd-summary", L.stripSummaryMark(b.text)));
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
        return { body, meta };
      };

      const visibleIndexes = () => QUESTS.map((q, i) => i).filter((i) => !QUESTS[i].li.classList.contains("is-hidden"));
      const updateCount = () => {
        countEl.textContent = `본 것 ${viewed.size} / ${QUESTS.length}`;
      };

      function showQuest(i, { focus = false, scroll = false, count = true, hash = false } = {}) {
        const q = QUESTS[i];
        current = i;
        QUESTS.forEach((x, k) => {
          if (k === i) x.row.setAttribute("aria-current", "true");
          else x.row.removeAttribute("aria-current");
        });
        detail.dataset.rarity = RARITY[q.cat];

        const ask = el("div", "qd-box");
        ask.append(el("b", null, "의뢰 내용"), document.createTextNode(q.line));
        const reward = el("div", "qd-box reward");
        const rewardList = el("ul");
        q.results.forEach((r) => rewardList.appendChild(el("li", null, r)));
        reward.append(el("b", null, "보상"), rewardList);
        const keys = el("div", "qd-keys");
        q.keys.forEach((k) => keys.appendChild(el("span", null, k)));

        // 긴 기록은 접어 둔다. 넓은 화면에서는 펼친 채로 시작한다.
        const log = el("details", "qd-log");
        log.open = !isNarrow();
        log.appendChild(el("summary", null, "퀘스트 기록"));
        const d = details && details[String(q.n)];
        let meta = null;
        if (d) {
          const out = renderBlocks(d.sections);
          meta = out.meta;
          log.appendChild(out.body);
        } else if (details === null) {
          log.appendChild(el("p", "qd-empty", "기록을 불러오는 중입니다."));
        } else {
          const p = el("p", "qd-empty", details === false ? "기록을 불러오지 못했습니다. " : "상세 기록이 없습니다.");
          if (details === false) {
            const retry = el("button", "text-link", "다시 불러오기");
            retry.type = "button";
            retry.addEventListener("click", () => {
              details = null;
              showQuest(current, { count: false });
              loadDetails();
            });
            p.appendChild(retry);
          }
          log.appendChild(p);
        }

        // 고정 칸: 기간 · 역할 · 파티(팀 규모). 값이 있는 것만 보인다.
        const metaRows = [
          ["기간", meta && meta.period],
          ["역할", meta && meta.role],
          ["파티", q.party],
        ].filter(([, v]) => v);
        const metaEl = el("dl", "qd-meta");
        metaRows.forEach(([k, v]) => metaEl.append(el("dt", null, k), el("dd", null, v)));

        const nav = el("div", "qd-nav");
        const vis = visibleIndexes();
        const at = vis.indexOf(i);
        [
          [vis[at - 1], "이전 퀘스트"],
          [vis[at + 1], "다음 퀘스트"],
        ].forEach(([k, label]) => {
          if (k == null) return nav.appendChild(el("span"));
          const b = el("button", null, label);
          b.type = "button";
          b.addEventListener("click", () => showQuest(k, { focus: true, scroll: true, hash: true }));
          nav.appendChild(b);
        });

        detail.replaceChildren(
          el("div", "qd-tag", `${RARITY[q.cat]} / ${q.cat}`),
          el("h3", "qd-title", q.title),
          ...(metaRows.length ? [metaEl] : []),
          ask,
          reward,
          keys,
          log,
          nav,
        );
        detail.scrollTop = 0;

        if (hash) history.replaceState(null, "", L.questHash(q.n));
        if (focus) detail.focus({ preventScroll: true });
        // 폰은 상세가 목록 아래에 있으므로 상세로, 넓은 화면은 저널 전체가 보이게 섹션으로 옮긴다
        if (scroll) (isNarrow() ? detail : $("#quests")).scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
        if (count) {
          // 긴 본문 대신 제목만 읽어 준다 (사용자가 고른 경우에만)
          status.textContent = `${q.title} 프로젝트를 열었습니다`;
          loadDetails();
          if (!viewed.has(i)) {
            viewed.add(i);
            q.row.classList.add("is-viewed");
            updateCount();
            addScore(100);
            addCoin();
          }
        }
      }

      // 목록의 각 항목을 누를 수 있는 줄로 바꾼다
      QUESTS.forEach((q, i) => {
        const row = el("button", "quest-row");
        row.type = "button";
        row.dataset.rarity = RARITY[q.cat];
        const name = el("span", null, q.title);
        name.appendChild(el("span", "rar", RARITY[q.cat]));
        row.append(el("span", "mark"), name);
        row.addEventListener("click", () => {
          showQuest(i, { scroll: isNarrow(), hash: true });
          sfx.open();
        });
        row.addEventListener("keydown", (e) => {
          if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
          e.preventDefault();
          const vis = visibleIndexes();
          const k = vis[vis.indexOf(i) + (e.key === "ArrowDown" ? 1 : -1)];
          if (k == null) return;
          QUESTS[k].row.focus();
          showQuest(k, { hash: true });
        });
        q.row = row;
        q.li.replaceChildren(row);
      });

      const setFilter = (f) => {
        tabs.forEach((t) => t.setAttribute("aria-pressed", String(t.dataset.filter === f)));
        QUESTS.forEach((q) => q.li.classList.toggle("is-hidden", f !== "all" && q.cat !== f));
      };
      tabs.forEach((t) =>
        t.addEventListener("click", () => {
          setFilter(t.dataset.filter);
          const first = visibleIndexes()[0];
          if (first != null) showQuest(first, { count: false });
          sfx.click();
        }),
      );

      openQuestByN = (n, opts = {}) => {
        const i = QUESTS.findIndex((q) => q.n === n);
        if (i < 0) return false;
        if (QUESTS[i].li.classList.contains("is-hidden")) setFilter("all");
        showQuest(i, { focus: true, scroll: true, hash: true, ...opts });
        return true;
      };
      // 주소 "#quest/6" 으로 바로 열기
      const fromHash = () => {
        const n = L.parseQuestHash(location.hash);
        if (n != null) openQuestByN(n, { hash: false });
      };
      window.addEventListener("hashchange", fromHash);
      // 글꼴·그림이 붙으면 위치가 밀리므로 다 받은 뒤 한 번 더 맞춘다
      window.addEventListener("load", fromHash);

      detail.hidden = false;
      updateCount();
      showQuest(0, { count: false });
      fromHash();
      // 상세 본문(120KB)은 저널이 화면에 가까워질 때 받는다
      const near = new IntersectionObserver(
        (entries) => {
          if (!entries[0].isIntersecting) return;
          near.disconnect();
          loadDetails();
        },
        { rootMargin: "800px 0px" },
      );
      near.observe($("#quests"));
    },
    true,
  );

  // ───────── 성과 블록: 치면 그 숫자를 만든 프로젝트 기록으로 간다 ─────────
  feature("impact", () => {
    $$(".qblock").forEach((b) => {
      b.addEventListener("click", (e) => {
        const n = L.parseQuestHash(b.getAttribute("href"));
        if (n == null) return;
        e.preventDefault();
        const first = !b.classList.contains("is-used");
        b.classList.remove("is-bump");
        void b.offsetWidth; // 애니메이션을 다시 시작
        b.classList.add("is-bump", "is-used");
        b.querySelector(".qblock-face").innerHTML = spriteSVG("USED_BLOCK", 4);
        const r = b.getBoundingClientRect();
        if (first) {
          burst(r.left + r.width / 2, r.top, FX_GOLD, 12, "+2500");
          addScore(2500);
          addCoin();
        }
        sfx.bump();
        setTimeout(() => openQuestByN(n), reduceMotion ? 0 : 280);
      });
    });
  });

  // ───────── 인벤토리 ─────────
  feature(
    "inventory",
    () => {
      const desc = $("#slot-desc");
      const slots = $$("#slots .slot");
      slots.forEach((btn) => {
        const name = $(".slot-name", btn).textContent;
        const text = $(".slot-text", btn.parentElement).textContent;
        btn.setAttribute("aria-pressed", "false");
        const show = () => {
          slots.forEach((s) => s.setAttribute("aria-pressed", String(s === btn)));
          desc.replaceChildren(el("strong", null, name), document.createTextNode(text));
        };
        btn.addEventListener("click", show);
        btn.addEventListener("focus", show);
        btn.addEventListener("mouseenter", show);
      });
    },
    true,
  );

  // ───────── 글 목록: 나머지 펼치기 ─────────
  feature("posts", () => {
    const posts = $("#posts");
    const more = $$(".is-more", posts).length;
    if (!more) return;
    const btn = el("button", "posts-more", `나머지 ${more}편 보기`);
    btn.type = "button";
    btn.setAttribute("aria-expanded", "false");
    btn.setAttribute("aria-controls", "posts");
    btn.addEventListener("click", () => {
      const open = posts.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", String(open));
      btn.textContent = open ? "접기" : `나머지 ${more}편 보기`;
    });
    posts.after(btn);
  });

  // ───────── 연락처: 카운트다운 · 주소 복사 · 파티 ─────────
  feature("contact", () => {
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
            count.innerHTML = spriteSVG("HEART", 8);
            return;
          }
          count.textContent = String(n);
          sfx.click();
        }, 700);
      },
      { threshold: 0.4 },
    ).observe($("#contact"));

    const copy = $("#copy-mail");
    const label = $("#copy-label");
    let timer = 0;
    copy.addEventListener("click", async () => {
      let ok = false;
      try {
        await navigator.clipboard.writeText(copy.dataset.copy);
        ok = true;
      } catch {}
      label.textContent = ok ? "복사했습니다" : "복사하지 못했습니다";
      if (ok) sfx.coin();
      clearTimeout(timer);
      timer = setTimeout(() => (label.textContent = "주소 복사"), 2000);
    });
    label.setAttribute("aria-live", "polite");

    const party = $("#party");
    ["#3DDC84", "#5FCDE4", "#FEE761", "#FF6B97"].forEach((c, i) => {
      if (i === 2) {
        const hero = el("span");
        hero.dataset.sprite = "HERO_A";
        hero.dataset.px = "7";
        party.appendChild(hero);
      }
      const bot = el("span");
      bot.dataset.sprite = "BOT";
      bot.dataset.px = "5";
      bot.dataset.color = c;
      party.appendChild(bot);
    });
    paintSprites(party);
  });

  // ───────── 코나미 커맨드 ─────────
  feature("konami", () => {
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
      addScore(10000);
      sfx.secret();
      if (reduceMotion) return;
      const r = el("div", "runner");
      r.innerHTML = spriteSVG("HERO_A", 8);
      document.body.appendChild(r);
      setTimeout(() => r.remove(), 2700);
    });
  });

  window.__questReady = true;
})();
