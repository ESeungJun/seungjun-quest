// Cloudflare Pages 에서 _worker.js 로 올라간다. _routes.json 에 적힌 영상·음악 요청만 이 코드를 거치고 나머지는 정적 파일로 바로 나간다.
// 정적 파일 응답은 Range 요청을 처리하지 않아서, iOS Safari 가 영상을 재생할 수 있도록 206 응답을 직접 만든다.
// 이 코드가 만든 응답에는 _headers 가 붙지 않으므로 필요한 보안 헤더는 여기서 붙인다.
const SECURITY = {
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
};

// "bytes=시작-끝" 하나만 받는다. null 이면 Range 를 무시하고 전체를 보낸다.
const parseRange = (header, size) => {
  const m = /^bytes=(\d*)-(\d*)$/.exec(header);
  if (!m || (!m[1] && !m[2])) return null; // 여러 범위(쉼표)·형식 오류·"bytes=-"
  if (!m[1]) {
    // bytes=-N : 마지막 N 바이트
    const n = Number(m[2]);
    return n > 0 ? { start: Math.max(0, size - n), end: size - 1 } : "unsatisfiable";
  }
  const start = Number(m[1]);
  if (m[2] && Number(m[2]) < start) return null; // 끝이 시작보다 앞이면 잘못된 범위라 무시
  if (start >= size) return "unsatisfiable";
  return { start, end: m[2] ? Math.min(Number(m[2]), size - 1) : size - 1 };
};

// 파일 전체를 메모리에 올리지 않고, 흘러가는 스트림에서 start~end 만 골라 낸다.
const sliceStream = (body, start, end) => {
  let pos = 0; // 지금까지 지나간 바이트 수
  return body.pipeThrough(
    new TransformStream({
      transform(chunk, ctl) {
        const from = Math.max(0, start - pos);
        const to = Math.min(chunk.byteLength, end + 1 - pos);
        pos += chunk.byteLength;
        if (from < to) ctl.enqueue(chunk.subarray(from, to));
        if (pos > end) ctl.terminate(); // 끝을 넘으면 원본 읽기를 멈춘다
      },
    }),
  );
};

// 정적 파일 응답에는 Content-Length 가 없어서 크기를 따로 알아낸다.
// 한 번 끝까지 흘려 바이트만 세고(메모리에 쌓지 않음), ETag 별로 기억해 같은 Worker 에서는 다시 세지 않는다.
const sizes = new Map();
const assetSize = async (env, url, res) => {
  const known = Number(res.headers.get("Content-Length"));
  if (known > 0) return known;
  const key = `${url.pathname} ${res.headers.get("ETag")}`;
  if (!sizes.has(key)) {
    const reader = (await env.ASSETS.fetch(new Request(url, { method: "GET" }))).body.getReader();
    let n = 0;
    for (let c = await reader.read(); !c.done; c = await reader.read()) n += c.value.byteLength;
    sizes.set(key, n);
  }
  return sizes.get(key);
};

export default {
  async fetch(request, env) {
    const head = request.method === "HEAD";
    if (!head && request.method !== "GET") {
      return new Response("Method Not Allowed", { status: 405, headers: { Allow: "GET, HEAD", ...SECURITY } });
    }

    const res = await env.ASSETS.fetch(new Request(request.url, { method: "GET" }));
    const headers = new Headers(res.headers); // Content-Type · ETag 는 그대로 넘긴다
    headers.set("Accept-Ranges", "bytes");
    for (const [k, v] of Object.entries(SECURITY)) headers.set(k, v);

    const range = request.headers.get("Range");
    const size = range && res.status === 200 && res.body ? await assetSize(env, new URL(request.url), res) : 0;
    const r = size > 0 ? parseRange(range, size) : null;

    if (r === "unsatisfiable") {
      res.body?.cancel();
      headers.set("Content-Range", `bytes */${size}`);
      headers.delete("Content-Length");
      return new Response(null, { status: 416, headers });
    }
    if (!r) {
      if (head && res.status === 200 && res.body) {
        headers.set("Content-Length", String(size || (await assetSize(env, new URL(request.url), res))));
        res.body.cancel();
      }
      return new Response(head ? null : res.body, { status: res.status, headers });
    }

    const length = r.end - r.start + 1;
    headers.set("Content-Range", `bytes ${r.start}-${r.end}/${size}`);
    headers.set("Content-Length", String(length));
    if (head) {
      res.body.cancel();
      return new Response(null, { status: 206, headers });
    }
    // FixedLengthStream 을 거쳐야 Workers 가 Content-Length 를 그대로 보낸다
    const out = typeof FixedLengthStream === "function" ? new FixedLengthStream(length) : new TransformStream();
    sliceStream(res.body, r.start, r.end).pipeTo(out.writable).catch(() => {});
    return new Response(out.readable, { status: 206, headers });
  },
};
