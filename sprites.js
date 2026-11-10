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
// 버튼·메뉴 아이콘 (8×8). X 는 글자색(currentColor)을 따른다.
Object.assign(SPRITES, {
  I_PLAY: ["..X.....", "..XX....", "..XXX...", "..XXXX..", "..XXXX..", "..XXX...", "..XX....", "..X....."],
  I_PAUSE: ["........", ".XX..XX.", ".XX..XX.", ".XX..XX.", ".XX..XX.", ".XX..XX.", ".XX..XX.", "........"],
  I_NOTE: ["...XXXXX", "...XXXXX", "...X...X", "...X...X", "...X...X", ".XXX.XXX", ".XXX.XXX", "........"],
  I_MAIL: ["........", "XXXXXXXX", "XX....XX", "X.X..X.X", "X..XX..X", "X......X", "XXXXXXXX", "........"],
  I_STAR: ["...XX...", "...XX...", "XXXXXXXX", ".XXXXXX.", "..XXXX..", ".XXXXXX.", ".XX..XX.", "X......X"],
  I_CLOSE: ["XX....XX", "XXX..XXX", ".XXXXXX.", "..XXXX..", "..XXXX..", ".XXXXXX.", "XXX..XXX", "XX....XX"],
  I_PAD: ["........", ".XXXXXX.", "XX.XX.XX", "X...XXXX", "XX.XX.XX", "XXXXXXXX", "XX....XX", "........"],
  I_DOC: [".XXXXX..", ".X...XX.", ".X....X.", ".X.XX.X.", ".X....X.", ".X.XX.X.", ".X....X.", ".XXXXXX."],
  I_COPY: ["XXXXX...", "X...X...", "X.XXXXXX", "X.X....X", "XXX....X", "..X....X", "..X....X", "..XXXXXX"],
  I_PEN: ["......XX", ".....XXX", "....XXX.", "...XXX..", "..XXX...", ".XXX....", "XXX.....", "XX......"],
  I_ARROW: ["....X...", "....XX..", "XXXXXXX.", "XXXXXXXX", "XXXXXXX.", "....XX..", "....X...", "........"],
});

// 인벤토리 아이템 (12×12)
Object.assign(SPRITES, {
  IT_KOTLIN: [
    "VVVVVVVVVVVV", "VVVVVVVVVVV.", "VVVVVVVVVV..", "VVVVVVVVV...", "VVVVVVVV....", "VVVVVVV.....",
    "HHHHHHH.....", "HHHHHHHH....", "OOOOOOOOO...", "OOOOOOOOOO..", "OOOOOOOOOOO.", "OOOOOOOOOOOO",
  ],
  IT_COMPOSE: [
    "....GGGG....", "..GGGGGGGG..", ".GGGGWWGGGG.", "GGGGWWWWGGGG", "GGGWWBBWWGGG", "BGGWBBBBWGGB",
    "BBGWBBBBWGBB", "BBBWWBBWWBBB", ".BBBWWWWBBB.", "..BBBBBBBB..", "...bbbbbb...", "....bbbb....",
  ],
  IT_MEDIA3: [
    "ssssssssssss", "sKsKsKsKsKss", "ssssssssssss", "sBBBBBBBBBBs", "sBBBWBBBBBBs", "sBBBWWWBBBBs",
    "sBBBWWWWWBBs", "sBBBWWWBBBBs", "sBBBWBBBBBBs", "ssssssssssss", "sKsKsKsKsKss", "ssssssssssss",
  ],
  IT_FLOW: [
    "............", "..BB....BB..", ".BBBB..BBBB.", "BB..BBBB..BB", "B....BB....B", "............",
    "..GG....GG..", ".GGGG..GGGG.", "GG..GGGG..GG", "G....GG....G", "............", "............",
  ],
  IT_HILT: [
    "..........SS", ".........SWS", "........SWS.", ".......SWS..", "......SWS...", ".....SWS....",
    ".Y..SWS.....", ".YYSWS......", "..YYS.......", ".OOYY.......", "OOO.YY......", "OO..........",
  ],
  IT_CLEAN: [
    ".GGGGGGGGGG.", "G..........G", "G.BBBBBBBB.G", "G.B......B.G", "G.B.YYYY.B.G", "G.B.YWWY.B.G",
    "G.B.YWWY.B.G", "G.B.YYYY.B.G", "G.B......B.G", "G.BBBBBBBB.G", "G..........G", ".GGGGGGGGGG.",
  ],
  IT_MODULE: [
    "GGGGG..BBBBB", "GDDDG..BbbbB", "GDDDG..BbbbB", "GDDDG..BbbbB", "GGGGG..BBBBB", "............",
    "............", "YYYYY..HHHHH", "YOOOY..HRRRH", "YOOOY..HRRRH", "YOOOY..HRRRH", "YYYYY..HHHHH",
  ],
  IT_JENKINS: [
    "....SSSS....", ".SS.SSSS.SS.", ".SSSSSSSSSS.", "..SSssssSS..", "SSSs....sSSS", "SSSs....sSSS",
    "SSSs....sSSS", "SSSs....sSSS", "..SSssssSS..", ".SSSSSSSSSS.", ".SS.SSSS.SS.", "....SSSS....",
  ],
  IT_CLAUDE: [
    ".....OO.....", ".O...OO...O.", "..O..OO..O..", "...O.OO.O...", "....OOOO....", "OOOOOOOOOOOO",
    "OOOOOOOOOOOO", "....OOOO....", "...O.OO.O...", "..O..OO..O..", ".O...OO...O.", ".....OO.....",
  ],
  IT_N8N: [
    "............", ".HH.........", "HHHH....VVV.", "HHHHSSSVVVVV", ".HH..S.VVVVV", ".....S..VVV.",
    ".....S......", ".....S..VVV.", ".HH..SSVVVVV", "HHHHSS.VVVVV", "HHHH....VVV.", ".HH.........",
  ],
  IT_API: [
    "..VV....VV..", ".VV......VV.", ".VV......VV.", ".VV......VV.", ".VV..WW..VV.", "VV...WW...VV",
    "VV........VV", ".VV..WW..VV.", ".VV..WW..VV.", ".VV......VV.", ".VV......VV.", "..VV....VV..",
  ],
  IT_LINK: [
    "............", ".BBBBB......", "BB...BB.....", "B.....B.....", "B...GGGGGG..", "BB.GG.BB.GG.",
    ".BBGBBB...G.", "...G......G.", "...GG....GG.", "....GGGGGG..", "............", "............",
  ],
});
SPRITES.USED_BLOCK = SPRITES.BLOCK.map((r) => r.replace(/[YO]/g, "s"));

// 스프라이트를 SVG 문자열로. 같은 색이 이어지는 칸은 한 사각형으로 합친다.
window.spriteSVG = function (name, px, overrides) {
  const map = SPRITES[name];
  if (!map) return "";
  // X 는 따로 색을 주지 않으면 글자색을 따른다 (아이콘용)
  const pal = Object.assign({ X: "currentColor" }, PAL, overrides || {});
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
