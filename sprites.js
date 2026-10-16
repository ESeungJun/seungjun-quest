// 픽셀 아트 정의 (영상과 같은 스프라이트). 문자 하나 = 픽셀 하나, '.' = 투명.
window.PAL = {
  K: "#0F0F1B", G: "#3DDC84", D: "#1E9E5A", W: "#FFFFFF", R: "#E43B44",
  Y: "#FEE761", O: "#F77622", S: "#C0CBDC", s: "#8B9BB4", B: "#0099DB",
  b: "#124E89", H: "#FF6B97", V: "#9B5DE5",
};

const HERO_TOP = [
  "................",
  "...K........K...",
  "....K......K....",
  "....KGGGGGGK....",
  "...KGGGGGGGGK...",
  "..KGGWKGGWKGGK..",
  "..KGGGGGGGGGGK..",
  "..KKKKKKKKKKKK..",
  ".KGKGGGGGGGGKGK.",
  ".KGKGGDDDDGGKGK.",
  ".KGKGGGGGGGGKGK.",
  "..K.KGGGGGGK.K..",
  "....KGGGGGGK....",
];

window.SPRITES = {
  HERO_A: [...HERO_TOP, "....KGK..KGK....", "....KGK..KGK....", "....KKK..KKK...."],
  HERO_B: [...HERO_TOP, "....KGK..KGK....", "...KGK....KGK...", "...KKK....KKK..."],
  BOT: [
    "..K....K..",
    "...KXXK...",
    "..KXXXXK..",
    ".KXWXXWXK.",
    ".KXXXXXXK.",
    ".KKKKKKKK.",
    ".KXXXXXXK.",
    "..KXK.KXK.",
    "..KK...KK.",
  ],
  COIN: [
    "..KKKK..",
    ".KYYYYK.",
    "KYYWYYOK",
    "KYYWYYOK",
    "KYYWYYOK",
    "KYYYYYOK",
    ".KYOOOK.",
    "..KKKK..",
  ],
  HEART: [
    ".KK...KK.",
    "KHHK.KHHK",
    "KHWHKHHHK",
    "KHHHHHHHK",
    ".KHHHHHK.",
    "..KHHHK..",
    "...KHK...",
    "....K....",
  ],
  BLOCK: [
    "KKKKKKKKKKKKKKKK",
    "KYYYYYYYYYYYYYYK",
    "KYOYYYYYYYYYYOYK",
    "KYYYYKKKKKYYYYYK",
    "KYYYKKOOOKKYYYYK",
    "KYYYKKOYYKKOYYYK",
    "KYYYYOOYKKKOYYYK",
    "KYYYYYYKKKOOYYYK",
    "KYYYYYYKKOOYYYYK",
    "KYYYYYYOOOYYYYYK",
    "KYYYYYYKKYYYYYYK",
    "KYYYYYYKKOYYYYYK",
    "KYYYYYYYOOYYYYYK",
    "KYOYYYYYYYYYYOYK",
    "KYYYYYYYYYYYYYYK",
    "KKKKKKKKKKKKKKKK",
  ],
  GEM: [
    "..KKKK..",
    ".KXWXXK.",
    "KXWXXXbK",
    "KXXXXXbK",
    ".KXXXbK.",
    "..KXbK..",
    "...KK...",
  ],
};
Object.assign(SPRITES, {
  SWORD: [".WX.", ".WX.", ".WX.", ".WX.", ".WX.", ".WX.", ".WX.", ".WX.", ".WX.", ".WX.", "YYYY", ".OO.", ".OO.", ".KK."],
  BUG: [
    "..K......K..",
    "...K....K...",
    "..KXXXXXXK..",
    ".KXXWXXWXXK.",
    ".KXXKXXKXXK.",
    "KXXXXXXXXXXK",
    ".KXXXXXXXXK.",
    ".K.K.KK.K.K.",
  ],
  BOSS: [
    "....KK........KK....",
    "...KXXK......KXXK...",
    "...KXXXKKKKKKXXXK...",
    "..KXXXXXXXXXXXXXXK..",
    ".KXXXXXXXXXXXXXXXXK.",
    ".KXXWWWXXXXXXWWWXXK.",
    "KXXXWKKXXXXXXWKKXXXK",
    "KXXXWKKXXXXXXWKKXXXK",
    "KXXXXXXXXXXXXXXXXXXK",
    "KXXXXXKKKKKKKKXXXXXK",
    "KXXXXKWKWKWKWKKXXXXK",
    "KXXXXKKKKKKKKKKXXXXK",
    ".KXXXXXXXXXXXXXXXXK.",
    ".KXXXXXXXXXXXXXXXXK.",
    "..KXXXXXXXXXXXXXXK..",
    "..KXXK.KXXXXK.KXXK..",
    "..KXXK.KXXXXK.KXXK..",
    "..KKKK.KKKKKK.KKKK..",
  ],
  FLAG: [
    "KK.......",
    "KGGGGG...",
    "KGGGGGGG.",
    "KGGWGGGGG",
    "KGGGGGGG.",
    "KGGGGG...",
    "KK.......",
    "KK.......",
    "KK.......",
    "KK.......",
    "KK.......",
    "KK.......",
    "KK.......",
    "KK.......",
    "KK.......",
    "KKKK.....",
  ],
  SIGN: [
    "KKKKKKKKKKKK",
    "KOOOOOOOOOOK",
    "KOKKKKKKKKOK",
    "KOOOOOOOOOOK",
    "KOKKKKKKOOOK",
    "KOOOOOOOOOOK",
    "KKKKKKKKKKKK",
    ".....KK.....",
    ".....KK.....",
    ".....KK.....",
    ".....KK.....",
    "....KKKK....",
  ],
});
SPRITES.USED_BLOCK = SPRITES.BLOCK.map((r) => r.replace(/[YO]/g, "s"));

// 스프라이트를 SVG 문자열로. 같은 색이 이어지는 칸은 한 사각형으로 합친다.
window.spriteSVG = function (name, px, overrides) {
  const map = SPRITES[name];
  const pal = Object.assign({}, PAL, overrides || {});
  const w = map[0].length;
  const h = map.length;
  let rects = "";
  map.forEach((row, y) => {
    let x = 0;
    while (x < w) {
      const c = row[x];
      let run = 1;
      while (x + run < w && row[x + run] === c) run++;
      if (c !== "." && pal[c]) rects += `<rect x="${x}" y="${y}" width="${run}" height="1" fill="${pal[c]}"/>`;
      x += run;
    }
  });
  return `<svg width="${w * px}" height="${h * px}" viewBox="0 0 ${w} ${h}" shape-rendering="crispEdges" aria-hidden="true">${rects}</svg>`;
};

// data-sprite 속성이 달린 요소에 그려 넣는다
window.paintSprites = function (root) {
  (root || document).querySelectorAll("[data-sprite]").forEach((el) => {
    const color = el.dataset.color;
    el.innerHTML = spriteSVG(el.dataset.sprite, Number(el.dataset.px || 4), color ? { X: color } : null);
  });
};
