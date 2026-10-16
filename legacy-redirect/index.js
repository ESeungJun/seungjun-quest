// 예전 주소(*.workers.dev)로 들어온 요청을 같은 경로의 새 주소로 영구 이동시킨다.
const TARGET = "https://seungjun-quest.pages.dev";

export default {
  fetch(request) {
    const url = new URL(request.url);
    return Response.redirect(TARGET + url.pathname + url.search, 301);
  },
};
