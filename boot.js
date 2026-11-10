// <head> 에서 먼저 읽는다. 스크립트가 도는 환경임을 표시하고, 같은 탭 재방문이면 부팅 화면을 건너뛴다.
(() => {
  const root = document.documentElement;
  root.classList.add("js");
  try {
    if (sessionStorage.getItem("sq.booted")) root.classList.add("skip-boot");
    sessionStorage.setItem("sq.booted", "1");
  } catch {}
  // 페이지 스크립트(lib.js·main.js)가 준비를 마치기 전에 실패하면 스크립트 없는 화면(정적 본문)으로 되돌린다.
  // 그림·영상·스프라이트를 못 받은 것은 본문과 상관없으므로 넘긴다.
  const fallback = (e) => {
    if (window.__questReady) return;
    const t = e && e.target;
    if (t && t !== window && !(t.tagName === "SCRIPT" && /(?:^|\/)(?:lib|main)\.js(?:\?|$)/.test(t.src || ""))) return;
    root.classList.remove("js");
  };
  window.addEventListener("error", fallback, true);
  window.addEventListener("unhandledrejection", fallback);
})();
