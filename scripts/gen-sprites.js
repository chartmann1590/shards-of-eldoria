'use strict';
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const ROOT = path.resolve(__dirname, '..');

const CRC_T = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
  CRC_T[n] = c;
}

function crc32(buf) {
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) crc = CRC_T[(crc ^ buf[i]) & 0xFF] ^ (crc >>> 8);
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

function pngChunk(type, data) {
  const t = Buffer.from(type, 'ascii');
  const l = Buffer.alloc(4); l.writeUInt32BE(data.length);
  const cv = Buffer.alloc(4); cv.writeUInt32BE(crc32(Buffer.concat([t, data])));
  return Buffer.concat([l, t, data, cv]);
}

function writePng(w, h, rgba, p) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ih = Buffer.alloc(13);
  ih.writeUInt32BE(w, 0); ih.writeUInt32BE(h, 4); ih[8] = 8; ih[9] = 6;
  const raw = Buffer.alloc(h * (1 + w * 4));
  for (let y = 0; y < h; y++) {
    const off = y * (1 + w * 4);
    raw[off] = 0;
    for (let x = 0; x < w; x++) {
      const si = (y * w + x) * 4, di = off + 1 + x * 4;
      raw[di] = rgba[si]; raw[di + 1] = rgba[si + 1]; raw[di + 2] = rgba[si + 2]; raw[di + 3] = rgba[si + 3];
    }
  }
  const png = Buffer.concat([
    sig, pngChunk('IHDR', ih), pngChunk('IDAT', zlib.deflateSync(raw)), pngChunk('IEND', Buffer.alloc(0))
  ]);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, png);
}

function hexRGBA(h) {
  return [
    parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16),
    parseInt(h.slice(5, 7), 16), h.length > 7 ? parseInt(h.slice(7, 9), 16) : 255
  ];
}

function writeSprite(rows, pal, p) {
  const h = rows.length, w = rows[0].length, buf = Buffer.alloc(w * h * 4);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const ch = rows[y][x], i = (y * w + x) * 4;
    if (ch === '.' || !pal[ch]) { buf[i + 3] = 0; }
    else { const c = hexRGBA(pal[ch]); buf[i] = c[0]; buf[i+1] = c[1]; buf[i+2] = c[2]; buf[i+3] = c[3]; }
  }
  writePng(w, h, buf, p);
}

function mirror(r) { return r.map(s => s.split('').reverse().join('')); }

function hashXY(x, y, s) {
  let h = (s | 0) + x * 374761393 + y * 668265263;
  h = (h ^ (h >> 13)) * 1274126177;
  return ((h ^ (h >> 16)) >>> 0) & 0xFF;
}

function emit(name, rows, pal, dir) {
  const w = rows[0].length;
  if (rows.length !== w) throw new Error(name + ': expected ' + w + ' rows, got ' + rows.length);
  for (let i = 0; i < rows.length; i++) {
    if (rows[i].length !== w) throw new Error(name + ' row ' + i + ': expected ' + w + ', got ' + rows[i].length);
  }
  writeSprite(rows, pal, path.join(ROOT, dir, name + '.png'));
  return 1;
}

const SK = '#FFDAB9', EY = '#1A1A2E', MO = '#CC8888';
const PN = '#1F2937', BT = '#4A3728';

const KAEL = { H:'#FFD699', S:SK, E:EY, M:MO, A:'#3B5BD9', a:'#2746A8', W:'#C0C0C0', P:PN, B:BT };
const LYRA = { H:'#654321', S:SK, E:EY, M:MO, R:'#7B2D8E', r:'#5B1D6E', T:'#D4AF37', t:'#B8860B', P:PN, B:BT };
const BRANN = { H:'#8B4513', S:SK, E:EY, M:MO, C:'#2D7A3E', c:'#1B5E2E', X:'#D4AF37', P:PN, B:BT };
const SHOP = { H:'#DEB887', S:SK, E:EY, M:MO, O:'#D2691E', o:'#8B4513', A:'#F5DEB3', P:PN, B:BT };
const KING = { H:'#C0C0C0', S:SK, E:EY, M:MO, C:'#DAA520', c:'#B8860B', R:'#8B0000', P:PN, B:BT, G:'#FFD700' };
const V1 = { H:'#8B4513', S:SK, E:EY, M:MO, D:'#CD853F', d:'#A0522D', P:PN, B:BT };
const V2 = { H:'#FFD699', S:SK, E:EY, M:MO, L:'#4169E1', l:'#2E4A8E', P:PN, B:BT };
const V3 = { H:'#2F1B14', S:SK, E:EY, M:MO, N:'#8B0000', n:'#5C0000', P:PN, B:BT };

const GOB = { G:'#3D8B37', g:'#2D6B27', E:'#FF0000', M:'#228B22', W:'#8B6914', P:PN, B:'#3D2B1F' };
const WLF = { G:'#808080', g:'#5A5A5A', E:'#FFD700', N:'#333333', P:'#696969' };
const SKL = { B:'#E8E8D0', b:'#C8C8B0', E:'#1A1A2E', W:'#D0D0C0', R:'#8B0000' };
const WRT = { P:'#6B3FA0', p:'#6B3FA080', E:'#FF00FF', G:'#9B5FC0', g:'#9B5FC080' };

const TRN = { D:'#388E3C', G:'#4CAF50', L:'#66BB6A', d:'#2E7D32', T:'#5D4037' };
const WTR = { D:'#1565C0', W:'#2196F3', L:'#64B5F6', w:'#42A5F5' };
const STN = { D:'#757575', S:'#9E9E9E', L:'#BDBDBD', d:'#616161' };
const BRI = { R:'#8B4513', r:'#6B3410', B:'#A0522D', b:'#7B3F1D' };
const WAL = { S:'#9E9E9E', D:'#757575', L:'#BDBDBD', T:'#FFD700', t:'#FFA000' };
const DUN = { D:'#4A4A4A', S:'#606060', L:'#787878', T:'#FF6600', t:'#CC5500' };

const LEGS1 = ['....PP..PP......', '...PP....PP.....', '...BB....BB.....', '................'];
const LEGS2 = ['...PP...PP......', '..PP.....PP.....', '..BB.....BB.....', '................'];
const LLEG1 = ['...PP.PP........', '..PP..PP........', '..BB..BB........', '................', '................'];
const LLEG2 = ['..PP..PP........', '.PP...PP........', '.BB...BB........', '................', '................'];

const HEAD_D = [
  '................',
  '.....HHHHH......',
  '....HHSSSHH.....',
  '...HSSSSSSH.....',
  '...SSEEESSS.....',
  '...SSMMMSSS.....',
  '....SSSSSS......',
];
const HEAD_U = [
  '................',
  '.....HHHHH......',
  '....HHHHHHH.....',
  '...HHHHHHHHH....',
  '...HHHHHHHHH....',
  '...HHHHHHHHH....',
  '....HHHHHH......',
];
const HEAD_L = [
  '................',
  '....HHHHHH......',
  '...HSSSSS.......',
  '..HSSEEHS.......',
  '..HSSMMHS.......',
  '...SSSSS........',
];

let count = 0;
function charBody(dir, b, d, acc) {
  if (dir === 'down') return [
    '....' + b+b+b+b+b+b+b + '.....',
    '...' + b+b+b+b+b+b+b+b+b + '....',
    '...' + acc + '....',
    '...' + b+b+b+b+b+b+b+b+b + '....',
    '....' + b+b+b+b+b+b+b + '.....',
  ];
  if (dir === 'up') return [
    '....' + b+b+b+b+b+b+b + '.....',
    '...' + b+b+b+b+b+b+b+b+b + '....',
    '...' + d + b+b+b+b+b + d + b + '....',
    '...' + b+b+b+b+b+b+b+b+b + '....',
    '....' + b+b+b+b+b+b+b + '.....',
  ];
  return [
    '...' + b+b+b+b+b+b + '.......',
    '..' + b+b+b+b+b+b+b+b + '......',
    '..' + d + b+b+b+b + acc + '.....',
    '..' + b+b+b+b+b+b+b+b + '......',
    '...' + b+b+b+b+b+b + '.......',
  ];
}

function buildChar(name, pal, bodyDown, bodyUp, bodyLeft) {
  for (const d of ['down', 'up']) {
    const hd = d === 'down' ? HEAD_D : HEAD_U;
    const bd = d === 'down' ? bodyDown : bodyUp;
    for (let f = 1; f <= 2; f++) {
      const legs = f === 1 ? LEGS1 : LEGS2;
      count += emit(name + '_' + d + '_' + f, [...hd, ...bd, ...legs], pal, 'assets/sprites/characters');
    }
  }
  for (let f = 1; f <= 2; f++) {
    const legs = f === 1 ? LLEG1 : LLEG2;
    count += emit(name + '_left_' + f, [...HEAD_L, ...bodyLeft, ...legs], pal, 'assets/sprites/characters');
    count += emit(name + '_right_' + f, mirror([...HEAD_L, ...bodyLeft, ...legs]), pal, 'assets/sprites/characters');
  }
}

const kaelBD = [
  '....AAAAAAA.....',
  '...AAAAAAAAA....',
  '...AaAAAAAaA....',
  '...AAAAAAAAA....',
  '....AAAAAAA.....',
];
const kaelBU = [
  '....AAAAAAA.....',
  '...AAAAAAAAA....',
  '...aAAAAAAaA....',
  '...AAAAAAAAA....',
  '....AAAAAAA.....',
];
const kaelBL = [
  '...AAAAAA.......',
  '..AAAAAAAA......',
  '..AaAAAAAWW.....',
  '..AAAAAAAA......',
  '...AAAAAA.......',
];
buildChar('kael', KAEL, kaelBD, kaelBU, kaelBL);

const lyraBD = [
  '....RRRRRRR.....',
  '...RRRRRRRRR....',
  '...RrRRRRrRR....',
  '...RRRRRRRRR....',
  '....RRRRRRR.....',
];
const lyraBU = [
  '....RRRRRRR.....',
  '...RRRRRRRRR....',
  '...rRRRRRRrR....',
  '...RRRRRRRRR....',
  '....RRRRRRR.....',
];
const lyraBL = [
  '...RRRRR........',
  '..RRRRRRRR......',
  '..RrRRRRTT......',
  '..RRRRRRRR......',
  '...RRRRR........',
];
buildChar('lyra', LYRA, lyraBD, lyraBU, lyraBL);

const brannBD = [
  '....CCCCCCC.....',
  '...CCCCCCCCC....',
  '...CcCXCcCCC....',
  '...CCCCCCCCC....',
  '....CCCCCCC.....',
];
const brannBU = [
  '....CCCCCCC.....',
  '...CCCCCCCCC....',
  '...cCCCCCCcC....',
  '...CCCCCCCCC....',
  '....CCCCCCC.....',
];
const brannBL = [
  '...CCCCCC.......',
  '..CCCCCCCC......',
  '..CcCXC.........',
  '..CCCCCCCC......',
  '...CCCCCC.......',
];
buildChar('brann', BRANN, brannBD, brannBU, brannBL);

count += emit('shopkeeper', [
  '................',
  '.....HHHHH......',
  '....HHSSSHH.....',
  '...HSSSSSSH.....',
  '...SSEEESSS.....',
  '...SSMMMSSS.....',
  '....SSSSSS......',
  '....OOOOOOO.....',
  '...OOOOOOOOO....',
  '...OoAAAAAoO....',
  '...OOOOOOOOO....',
  '....OOOOOOO.....',
  '....PP..PP......',
  '...PP....PP.....',
  '...BB....BB.....',
  '................',
], SHOP, 'assets/sprites/characters');

count += emit('king', [
  '................',
  '.....GGGGG......',
  '....GCCCCCG.....',
  '...CCCCCCCCC....',
  '...CSSSSSSC.....',
  '...SSEEESSS.....',
  '...SSMMMSSS.....',
  '.....RRRRRR.....',
  '....RRRRRRRR....',
  '...RRcRRRRcRR...',
  '...RRRRRRRRRR...',
  '....RRRRRRRR....',
  '.....PPPPPP.....',
  '....PP....PP....',
  '....BB....BB....',
  '................',
], KING, 'assets/sprites/characters');

count += emit('villager1', [
  '................',
  '.....HHHHH......',
  '....HHSSSHH.....',
  '...HSSSSSSH.....',
  '...SSEEESSS.....',
  '...SSMMMSSS.....',
  '....SSSSSS......',
  '.....DDDDD......',
  '....DDDDDDD.....',
  '....DdDDDdD.....',
  '....DDDDDDD.....',
  '.....DDDDD......',
  '....PP..PP......',
  '...PP....PP.....',
  '...BB....BB.....',
  '................',
], V1, 'assets/sprites/characters');

count += emit('villager2', [
  '................',
  '.....HHHHH......',
  '....HHSSSHH.....',
  '...HSSSSSSH.....',
  '...SSEEESSS.....',
  '...SSMMMSSS.....',
  '....SSSSSS......',
  '.....LLLLL......',
  '....LLLLLLL.....',
  '....LlLLLlL.....',
  '....LLLLLLL.....',
  '.....LLLLL......',
  '....PP..PP......',
  '...PP....PP.....',
  '...BB....BB.....',
  '................',
], V2, 'assets/sprites/characters');

count += emit('villager3', [
  '................',
  '.....HHHHH......',
  '....HHSSSHH.....',
  '...HSSSSSSH.....',
  '...SSEEESSS.....',
  '...SSMMMSSS.....',
  '....SSSSSS......',
  '.....NNNNN......',
  '....NNNNNNN.....',
  '....NnNNNnN.....',
  '....NNNNNNN.....',
  '.....NNNNN......',
  '....PP..PP......',
  '...PP....PP.....',
  '...BB....BB.....',
  '................',
], V3, 'assets/sprites/characters');
// ==================== ENEMIES ====================

count += emit('goblin_idle', [
  '................',
  '.....GGGGG......',
  '....GGGGGGG.....',
  '...GGGGGGGGG....',
  '...GGEEGGEEG....',
  '...GGGGGGGGG....',
  '....GGMMGG......',
  '....GGGGGGG.....',
  '...GGGGGGGGG....',
  '...GGgGGGGgG....',
  '...GGGGGGGGG....',
  '....GGGGGGG.....',
  '.....GG.GG......',
  '....GG...GG.....',
  '....BB...BB.....',
  '................',
], GOB, 'assets/sprites/enemies');

count += emit('goblin_attack', [
  '................',
  '.....GGGGG......',
  '....GGGGGGG.....',
  '...GGGGGGGGG....',
  '...GGEEGGEEG....',
  '...GGGGGGGGG....',
  '....GGMMGG......',
  '..W.GGGGGGG.....',
  '..WWGGGGGGGG....',
  '...WGGgGGGgG....',
  '...GGGGGGGGG....',
  '....GGGGGGG.....',
  '.....GG.GG......',
  '....GG...GG.....',
  '....BB...BB.....',
  '................',
], GOB, 'assets/sprites/enemies');

count += emit('wolf_idle', [
  '................',
  '................',
  '..GG............',
  '..GGGGGG........',
  '..GGEGGEG.......',
  '..GGGGGGGG......',
  '.gGGGGGGGGG.....',
  '.gGGGGGGGGGG....',
  '.gGGGGGGGGG.....',
  '..GGGGGGGG......',
  '..GG.GG.GG......',
  '.GG..GG..GG.....',
  'GG...GG...GG....',
  '................',
  '................',
  '................',
], WLF, 'assets/sprites/enemies');

count += emit('wolf_attack', [
  '................',
  '................',
  '..GG............',
  '..GGGGGG........',
  '..GNGEGEGN......',
  '..GGGGGGGGG.....',
  '.gGGGGGGGGG.....',
  '.gGGGGGGGGGG....',
  '.gGGGGGGGGG.....',
  '..GGGGGGGG......',
  '..GG.GG.GG......',
  '.GG..GG..GG.....',
  'GG...GG...GG....',
  '................',
  '................',
  '................',
], WLF, 'assets/sprites/enemies');

count += emit('skeleton_idle', [
  '................',
  '....BBBBBB......',
  '...BEEBBEEB.....',
  '...BBBBBBBB.....',
  '....BBWBB.......',
  '.....BBB........',
  '....BBBBB.......',
  '...BB.BB.BB.....',
  '...BB.BB.BB.....',
  '....BBBBB.......',
  '.....B.B........',
  '....BB.BB.......',
  '...BB...BB......',
  '..BB.....BB.....',
  '................',
  '................',
], SKL, 'assets/sprites/enemies');

count += emit('skeleton_attack', [
  '................',
  '....BBBBBB......',
  '...BEEBBEEB.....',
  '...BBBBBBBB.....',
  '....BBWBB.......',
  '.....BBB........',
  '.R..BBBBB.......',
  '.RR.BB.BB.BB....',
  '.R..BB.BB.BB....',
  '....BBBBB.......',
  '.....B.B........',
  '....BB.BB.......',
  '...BB...BB......',
  '..BB.....BB.....',
  '................',
  '................',
], SKL, 'assets/sprites/enemies');

count += emit('wraith_idle', [
  '................',
  '.....PPPP.......',
  '....PPPPPP......',
  '...PPPEEPPP.....',
  '...PPPPPPPP.....',
  '....PPPPPP......',
  '...ppPPPPpp.....',
  '..ppPPPPPPpp....',
  '..ppPPPPPPpp....',
  '..ppPPPPPPpp....',
  '...ppPPPPpp.....',
  '....ppPPpp......',
  '.....pppp.......',
  '......pp........',
  '................',
  '................',
], WRT, 'assets/sprites/enemies');

count += emit('wraith_attack', [
  '................',
  '.....PPPP.......',
  '....PPPPPP......',
  '...PPPEEPPP.....',
  '...PPPPPPPP.....',
  '....PPPPPP......',
  '.pp.PPPP.pp.....',
  'pppPPPPPPpppp...',
  'ppPPPPPPPPpppp..',
  '.ppPPPPPPpp.....',
  '...ppPPPPpp.....',
  '....ppPPpp......',
  '.....pppp.......',
  '......pp........',
  '................',
  '................',
], WRT, 'assets/sprites/enemies');

// ==================== CAPTAIN (24x24 procedural) ====================

function genCaptain(attack) {
  const w = 24, h = 24;
  const rgba = Buffer.alloc(w * h * 4);
  const dk = [74, 74, 90], arm = [60, 60, 75], red = [139, 0, 0], eye = [255, 50, 50];
  const skin = [255, 218, 185], helm = [80, 80, 95], swd = [180, 180, 180];
  function px(x, y, c, a) {
    if (x < 0 || x >= w || y < 0 || y >= h) return;
    const i = (y * w + x) * 4;
    rgba[i] = c[0]; rgba[i+1] = c[1]; rgba[i+2] = c[2]; rgba[i+3] = (a || 255);
  }
  function rect(x1, y1, x2, y2, c) {
    for (let y = y1; y <= y2; y++) for (let x = x1; x <= x2; x++) px(x, y, c);
  }
  rect(8, 1, 15, 2, helm);
  rect(7, 3, 16, 3, helm);
  rect(7, 4, 16, 7, skin);
  px(9, 5, eye); px(14, 5, eye);
  rect(7, 8, 7, 8, skin); rect(16, 8, 16, 8, skin);
  rect(6, 9, 17, 9, dk);
  rect(5, 10, 18, 14, arm);
  rect(7, 10, 7, 14, red); rect(16, 10, 16, 14, red);
  if (attack) {
    for (let i = 0; i < 8; i++) { px(19 + i, 10 - i, swd); px(19 + i, 11 - i, swd); }
    px(18, 11, [139, 90, 43]);
  } else {
    rect(19, 10, 20, 14, swd);
    px(19, 15, [139, 90, 43]);
  }
  rect(6, 15, 17, 15, dk);
  rect(8, 16, 15, 17, dk);
  rect(7, 18, 11, 20, dk); rect(12, 18, 16, 20, dk);
  rect(6, 21, 10, 22, [40, 40, 50]); rect(13, 21, 17, 22, [40, 40, 50]);
  rect(5, 23, 9, 23, [30, 30, 40]); rect(14, 23, 18, 23, [30, 30, 40]);
  return { w, h, rgba };
}

for (const atk of [false, true]) {
  const s = genCaptain(atk);
  const p = path.join(ROOT, 'assets/sprites/enemies', (atk ? 'captain_attack' : 'captain_idle') + '.png');
  fs.mkdirSync(path.dirname(p), { recursive: true });
  writePng(s.w, s.h, s.rgba, p);
  count++;
}

// ==================== MALGRITH (32x32 procedural) ====================

function genMalgrith(attack) {
  const w = 32, h = 32;
  const rgba = Buffer.alloc(w * h * 4);
  const body = [26, 26, 46], cape = [139, 0, 0], eye = [255, 0, 0], glow = [200, 50, 50];
  const dark = [15, 15, 30], horn = [60, 60, 80], swd = [100, 0, 0];
  function px(x, y, c, a) {
    if (x < 0 || x >= w || y < 0 || y >= h) return;
    const i = (y * w + x) * 4;
    rgba[i] = c[0]; rgba[i+1] = c[1]; rgba[i+2] = c[2]; rgba[i+3] = (a !== undefined ? a : 255);
  }
  function rect(x1, y1, x2, y2, c) {
    for (let y = y1; y <= y2; y++) for (let x = x1; x <= x2; x++) px(x, y, c);
  }
  px(14, 0, horn); px(17, 0, horn);
  rect(12, 1, 13, 3, horn); rect(18, 1, 19, 3, horn);
  rect(11, 4, 20, 5, body);
  rect(10, 6, 21, 10, body);
  px(13, 7, eye); px(18, 7, eye);
  px(12, 8, glow); px(19, 8, glow);
  rect(10, 11, 10, 14, cape); rect(21, 11, 21, 14, cape);
  rect(9, 11, 22, 11, cape);
  rect(8, 12, 23, 18, body);
  rect(10, 12, 10, 18, cape); rect(21, 12, 21, 18, cape);
  rect(9, 19, 22, 19, dark);
  if (attack) {
    for (let i = 0; i < 10; i++) { px(24 + i, 14 - i, swd); px(24 + i, 15 - i, swd); }
    px(23, 15, [80, 0, 0]);
    for (let i = 0; i < 4; i++) px(24 + i, 16 - i, [255, 100, 100]);
  } else {
    rect(24, 12, 25, 18, swd); px(24, 19, [80, 0, 0]);
  }
  rect(10, 20, 14, 24, body); rect(17, 20, 21, 24, body);
  rect(9, 25, 13, 28, dark); rect(18, 25, 22, 28, dark);
  rect(8, 29, 12, 30, [10, 10, 20]); rect(19, 29, 23, 30, [10, 10, 20]);
  for (let y = 12; y <= 18; y++) {
    px(8, y, cape, 180); px(23, y, cape, 180);
  }
  for (let y = 25; y <= 28; y++) {
    const spread = y - 25;
    px(9 - spread, y, dark, 100); px(22 + spread, y, dark, 100);
  }
  return { w, h, rgba };
}

for (const atk of [false, true]) {
  const s = genMalgrith(atk);
  const p = path.join(ROOT, 'assets/sprites/enemies', (atk ? 'malgrith_attack' : 'malgrith_idle') + '.png');
  fs.mkdirSync(path.dirname(p), { recursive: true });
  writePng(s.w, s.h, s.rgba, p);
  count++;
}
// ==================== TERRAIN TILES ====================

const FLW = { R:'#FF4444', Y:'#FFD700', G:'#228B22' };
const CHR = { W:'#8B6914', B:'#D2691E', G:'#FFD700' };
const DOR = { B:'#8B4513', H:'#FFD700' };
const DRT = { D:'#5D4037', T:'#795548', L:'#8D6E63' };

function genTile(seed, fn) {
  const rows = [];
  for (let y = 0; y < 16; y++) {
    let row = '';
    for (let x = 0; x < 16; x++) row += fn(x, y, hashXY(x, y, seed));
    rows.push(row);
  }
  return rows;
}

for (let v = 1; v <= 3; v++) {
  count += emit('grass_' + v, genTile(v * 111, (x, y, h) => {
    if (h < 25) return 'D'; if (h < 55) return 'd'; if (h < 160) return 'G'; return 'L';
  }), TRN, 'assets/tiles');
}

for (let f = 1; f <= 2; f++) {
  const frame = f;
  count += emit('water_' + f, genTile(f * 222, (x, y, h) => {
    const wave = Math.sin((x + frame * 4) * 0.8 + y * 0.5) > 0;
    if (h < 35) return 'D'; if (wave && h < 180) return 'L'; if (h < 150) return 'W'; return 'w';
  }), WTR, 'assets/tiles');
}

count += emit('stone_path', genTile(333, (x, y, h) => {
  if (h < 25) return 'd'; if (h < 100) return 'S'; return 'L';
}), STN, 'assets/tiles');

count += emit('dirt_path', genTile(444, (x, y, h) => {
  if (h < 35) return 'D'; if (h < 130) return 'T'; return 'L';
}), DRT, 'assets/tiles');

count += emit('fortress_floor', genTile(555, (x, y, h) => {
  if (h < 30) return 'D'; if (h < 120) return 'S'; return 'L';
}), STN, 'assets/tiles');

count += emit('dungeon_stone', genTile(666, (x, y, h) => {
  if (h < 35) return 'D'; if (h < 110) return 'S'; return 'L';
}), DUN, 'assets/tiles');

count += emit('stone_wall', genTile(777, (x, y, h) => {
  if (h < 20) return 'D'; if (h < 90) return 'S'; return 'L';
}), WAL, 'assets/tiles');

count += emit('brick_wall', genTile(888, (x, y, h) => {
  const row = y % 4; const off = (Math.floor(y / 4) % 2) * 4; const bx = (x + off) % 8;
  if (row === 0 || bx === 0) return 'r'; if (h < 80) return 'R'; return 'B';
}), BRI, 'assets/tiles');

count += emit('tree', [
  '......GGG.......',
  '.....GGGGG......',
  '....GGGGGGG.....',
  '...GGGGGGGGG....',
  '..GGGGGGGGGGG...',
  '.GGGGGGGGGGGGG..',
  'GGGGGGdGGdGGGGG.',
  'GGGGGGGGGGGGGGGG',
  '.GGGGGGGGGGGGG..',
  '..GGGGGGGGGGG...',
  '...GGGGGGGGG....',
  '....GGGGGGG.....',
  '.....TTTTT......',
  '......TTT.......',
  '......TTT.......',
  '.....TTTTT......',
], TRN, 'assets/tiles');

count += emit('bush', [
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '.....GGGGG......',
  '....GGGGGGG.....',
  '...GGdGGGdGG....',
  '..GGGGGGGGGGG...',
  '...GGGGGGGGG....',
  '....GGGGGGG.....',
  '................',
], TRN, 'assets/tiles');

count += emit('flower', [
  '................',
  '................',
  '................',
  '......RRR.......',
  '.....RRRRR......',
  '....RRYYYRR.....',
  '.....RRRRR......',
  '......RRR.......',
  '.......G........',
  '......GGG.......',
  '.......G........',
  '.......G........',
  '......GGG.......',
  '.......G........',
  '................',
  '................',
], FLW, 'assets/tiles');

count += emit('torch_1', [
  '................',
  '................',
  '................',
  '.......T........',
  '......TTT.......',
  '.......t........',
  '.......S........',
  '.......S........',
  '.......S........',
  '.......S........',
  '......SSS.......',
  '.......S........',
  '................',
  '................',
  '................',
  '................',
], DUN, 'assets/tiles');

count += emit('torch_2', [
  '................',
  '................',
  '.......T........',
  '......TTT.......',
  '.....TTTTT......',
  '......TtT.......',
  '.......S........',
  '.......S........',
  '.......S........',
  '.......S........',
  '......SSS.......',
  '.......S........',
  '................',
  '................',
  '................',
  '................',
], DUN, 'assets/tiles');

count += emit('door_closed', [
  '................',
  '................',
  '...BBBBBBBBB....',
  '...B.......B....',
  '...B.......B....',
  '...B.......B....',
  '...B.......B....',
  '...B.......B....',
  '...B.......B....',
  '...B.......B....',
  '...B.......B....',
  '...B......BB....',
  '...BBBBBBBBB....',
  '................',
  '................',
  '................',
], DOR, 'assets/tiles');

count += emit('door_open', [
  '................',
  '...B........BB..',
  '...B.........B..',
  '...B.........B..',
  '...B.........B..',
  '...B.........B..',
  '...B.........B..',
  '...B.........B..',
  '...B.........B..',
  '...B.........B..',
  '...B.........B..',
  '...B.........B..',
  '...B........BB..',
  '................',
  '................',
  '................',
], DOR, 'assets/tiles');

count += emit('stairs_up', [
  '................',
  '........SSSS....',
  '........SSSS....',
  '......SSSSSS....',
  '......SSSSSS....',
  '....SSSSSSSS....',
  '....SSSSSSSS....',
  '..SSSSSSSSSS....',
  '..SSSSSSSSSS....',
  'SSSSSSSSSSSS....',
  'SSSSSSSSSSSS....',
  '................',
  '................',
  '................',
  '................',
  '................',
], STN, 'assets/tiles');

count += emit('stairs_down', [
  '................',
  '....SSSSSSSSSSSS',
  '....SSSSSSSSSSSS',
  '....SSSSSSSSSS..',
  '....SSSSSSSSSS..',
  '....SSSSSSSS....',
  '....SSSSSSSS....',
  '....SSSSSS......',
  '....SSSSSS......',
  '....SSSS........',
  '....SSSS........',
  '....SS..........',
  '................',
  '................',
  '................',
  '................',
], STN, 'assets/tiles');

count += emit('chest_closed', [
  '................',
  '................',
  '................',
  '....WWWWWWWW....',
  '...WWWWWWWWWW...',
  '...WBBBBBBBBW...',
  '...WBBBWBBBBW...',
  '...WWWWWWWWWW...',
  '...WBBBBBBBBW...',
  '...WBBBBYBBBW...',
  '...WBBBBBBBBW...',
  '...WWWWWWWWWW...',
  '................',
  '................',
  '................',
  '................',
], CHR, 'assets/tiles');

count += emit('chest_open', [
  '....W......W....',
  '...WW......WW...',
  '...W........W...',
  '................',
  '....WWWWWWWW....',
  '...WBBBBBBBBW...',
  '...WBBBBBBBBW...',
  '...WBBBBBBBBW...',
  '...WBBBGGGBBW...',
  '...WBBBBBBBBW...',
  '...WBBBBBBBBW...',
  '...WWWWWWWWWW...',
  '................',
  '................',
  '................',
  '................',
], CHR, 'assets/tiles');
// ==================== ITEMS ====================

const iPR={C:'#8B6914',R:'#CC0000',r:'#990000',h:'#FF6666'};
const iPB={C:'#8B6914',B:'#2196F3',b:'#1565C0',h:'#64B5F6'};
const iPG={C:'#8B6914',G:'#DAA520',g:'#B8860B',h:'#FFD700'};
const iSW={S:'#C0C0C0',s:'#A0A0A0',H:'#8B6914',h:'#6B4F14'};
const iAL={L:'#8B6914',l:'#6B4F14',h:'#D2B48C'};
const iAC={C:'#A0A0A0',c:'#808080',h:'#C0C0C0'};
const iAP={P:'#C0C0C0',p:'#A0A0A0',h:'#E0E0E0'};
const iSR={R:'#FF3333',r:'#CC0000',h:'#FF8888'};
const iSB={R:'#3366FF',r:'#0033CC',h:'#88AAFF'};
const iSG={R:'#33CC33',r:'#009900',h:'#88FF88'};
const iCN={G:'#FFD700',g:'#DAA520',d:'#B8860B'};
const uCU={Y:'#FFD700',y:'#DAA520'};
const uHT={R:'#FF3333',r:'#CC0000'};
const uMA={B:'#4169E1',b:'#2E4A8E',W:'#FFFFFF'};
const uEX={Y:'#FFD700',y:'#FFA500'};
const uFL={F:'#FF6600',f:'#CC3300'};
const uRN={R:'#228B22',r:'#1B5E2E'};

const bottleBase = [
  '................',
  '................',
  '......CC........',
  '.....CRRrC......',
  '....RRRRRR......',
  '...RRRRRRRR.....',
  '...RRRhRRRR.....',
  '...RRRRRRRR.....',
  '...RRRRRRRR.....',
  '...RRRRRRRR.....',
  '....RRRRRR......',
  '.....RRRR.......',
  '................',
  '................',
  '................',
  '................',
];

count += emit('item_potion', [
  '................','................',
  '......CC........',
  '.....CRRrC......',
  '....RRRRRR......',
  '...RRRRRRRR.....',
  '...RRRhRRRR.....',
  '...RRRRRRRR.....',
  '...RRRRRRRR.....',
  '...RRRRRRRR.....',
  '....RRRRRR......',
  '.....RRRR.......',
  '................','................','................','................',
], iPR, 'assets/tiles');

count += emit('item_mana_potion', [
  '................','................',
  '......CC........',
  '.....CBBbC......',
  '....BBBBBB......',
  '...BBBBBBBB.....',
  '...BBBhBBBB.....',
  '...BBBBBBBB.....',
  '...BBBBBBBB.....',
  '...BBBBBBBB.....',
  '....BBBBBB......',
  '.....BBBB.......',
  '................','................','................','................',
], iPB, 'assets/tiles');

count += emit('item_elixir', [
  '................','................',
  '......CC........',
  '.....CGGgC......',
  '....GGGGGG......',
  '...GGGGGGGG.....',
  '...GGGhGGGGG....',
  '...GGGGGGGG.....',
  '...GGGGGGGG.....',
  '...GGGGGGGG.....',
  '....GGGGGG......',
  '.....GGGG.......',
  '................','................','................','................',
], iPG, 'assets/tiles');

count += emit('item_iron_sword', [
  '................','................',
  '.......SS.......',
  '......SSSS......',
  '......SSSS......',
  '......SSSS......',
  '......SSSS......',
  '......SSSS......',
  '......SSSS......',
  '.......SS.......',
  '......HHHH......',
  '.......Hh.......',
  '.......Hh.......',
  '......HHHH......',
  '................','................',
], iSW, 'assets/tiles');

count += emit('item_steel_sword', [
  '................','................',
  '.......SS.......',
  '......SSSS......',
  '.....SSSSSS.....',
  '.....SSSSSS.....',
  '.....SSSSSS.....',
  '.....SSSSSS.....',
  '......SSSS......',
  '.......SS.......',
  '.....HHHHHH.....',
  '......HhHh......',
  '.......Hh.......',
  '......HHHH......',
  '................','................',
], iSW, 'assets/tiles');

count += emit('item_knight_sword', [
  '................','................',
  '.......SS.......',
  '......SSSS......',
  '.....SSSSSS.....',
  '....SSSSSSSS....',
  '....SSSSSSSS....',
  '.....SSSSSS.....',
  '......SSSS......',
  '.......SS.......',
  '....HHHHHHHH....',
  '...HHHHHHHHHH...',
  '.......Hh.......',
  '......HHHH......',
  '................','................',
], iSW, 'assets/tiles');

count += emit('item_leather_armor', [
  '................','................',
  '.....LLLLLL.....',
  '....LLLLLLLL....',
  '...LLLLLLLLLL...',
  '...LLhLLLLhLL...',
  '...LLLLLLLLLL...',
  '...LLLLLLLLLL...',
  '...LLLLLLLLLL...',
  '....LLLLLLLL....',
  '.....LLLLLL.....',
  '................','................','................','................',
  '................',
], iAL, 'assets/tiles');

count += emit('item_chainmail', [
  '................','................',
  '....CCCCCCCC....',
  '...CCCCCCCCCC...',
  '...CcCCCCCCcC...',
  '...CCCCCCCCCC...',
  '...CcCCCCCCcC...',
  '...CCCCCCCCCC...',
  '...CCCCCCCCCC...',
  '....CCCCCCCC....',
  '................','................','................','................',
  '................','................',
], iAC, 'assets/tiles');

count += emit('item_plate_armor', [
  '................','................',
  '....PPPPPPPP....',
  '...PPPPPPPPPP...',
  '...PPpPPPPpPP...',
  '...PPPPPPPPPP...',
  '...PPPPPPPPPP...',
  '...PPpPPPPpPP...',
  '...PPPPPPPPPP...',
  '....PPPPPPPP....',
  '................','................','................','................',
  '................','................',
], iAP, 'assets/tiles');

const shardShape = (pal, D, H) => {
  count += emit('item_' + D + '_shard', [
    '................','................',
    '.......R........',
    '......RhR.......',
    '.....RRRRRR.....',
    '....RhRRRhR.....',
    '...RRRRRRRRR....',
    '...RRRRRRRRR....',
    '....RRRRRRR.....',
    '.....RRRRR......',
    '......RRR.......',
    '.......R........',
    '................','................','................','................',
  ], pal, 'assets/tiles');
};
shardShape(iSR, 'red');
shardShape(iSB, 'blue');
shardShape(iSG, 'green');
count += emit('item_gold_coin', [
  '................','................',
  '.....GGGG.......',
  '....GGGGGG......',
  '...GGGGGGGG.....',
  '...GGGddGGGg....',
  '...GGGGGGGG.....',
  '...GGGddGGGg....',
  '...GGGGGGGG.....',
  '....GGGGGG......',
  '.....GGGG.......',
  '................','................','................','................',
  '................',
], iCN, 'assets/tiles');

// ==================== UI ====================

count += emit('cursor', [
  'YY..............',
  'YYY.............',
  'YYYY............',
  'YYYYY...........',
  'YYYYYY..........',
  'YYYYYYY.........',
  'YYYYYYYY........',
  'YYYYYYY.........',
  'YYYYYY..........',
  'YYYYY...........',
  'YY.YYY..........',
  'Y...YY..........',
  '....YY..........',
  '................',
  '................',
  '................',
], uCU, 'assets/ui');

count += emit('heart', [
  '................',
  '................',
  '..RR....RR......',
  '.RRRR..RRRR.....',
  'RRRRRRRRRRRR....',
  'RRRRRRRRRRRRR...',
  'RRRRRRRRRRRRR...',
  '.RRRRRRRRRRR....',
  '..RRRRRRRRR.....',
  '...RRRRRRR......',
  '....RRRRR.......',
  '.....RRR........',
  '......R.........',
  '................',
  '................',
  '................',
], uHT, 'assets/ui');

count += emit('mana', [
  '................',
  '................',
  '......BB........',
  '.....BBBB.......',
  '....BBBBBB......',
  '...BBBBBBBB.....',
  '...BBBWWBBBB....',
  '...BBBBBBBB.....',
  '....BBBBBB......',
  '.....BBBB.......',
  '......BB........',
  '................',
  '................',
  '................',
  '................',
  '................',
], uMA, 'assets/ui');

count += emit('exp', [
  '................',
  '................',
  '.......Y........',
  '......YYY.......',
  '.....YYYYY......',
  '...YYYYYYYYY....',
  'YYYYYYYYYYYYY...',
  '.....YYYYY......',
  '....YY.YY.......',
  '...YY...YY......',
  '..YY.....YY.....',
  '................',
  '................',
  '................',
  '................',
  '................',
], uEX, 'assets/ui');

count += emit('sword_action', [
  '................',
  '..SS............',
  '..SSSS..........',
  '..SSSSSS........',
  '...SSSSSS.......',
  '....SSSSSS......',
  '.....SSSSSS.....',
  '......SSSSSS....',
  '.......SSSSSS...',
  '........SSSSSS..',
  '..........SSSS..',
  '................',
  '................',
  '................',
  '................',
  '................',
], iSW, 'assets/ui');

count += emit('flame_action', [
  '................',
  '......F.........',
  '.....FFF........',
  '....FFFFF.......',
  '...FFfFFFfF.....',
  '....FFFFF.......',
  '...FFFFFFF......',
  '..FFFfFFfFF.....',
  '...FFFFFFF......',
  '....FFFFF.......',
  '.....FFF........',
  '......F.........',
  '................',
  '................',
  '................',
  '................',
], uFL, 'assets/ui');

count += emit('potion_action', [
  '................',
  '................',
  '......CC........',
  '.....CRRrC......',
  '....RRRRRR......',
  '...RRRRRRRR.....',
  '...RRRhRRRR.....',
  '...RRRRRRRR.....',
  '....RRRRRR......',
  '.....RRRR.......',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
], iPR, 'assets/ui');

count += emit('run_action', [
  '................',
  '................',
  '.......R........',
  '......RR........',
  '.....RRR........',
  '....RRRR........',
  '...RRRRR........',
  '.RRRRRRRRRRR....',
  '...RRRRR........',
  '....RRRR........',
  '.....RRR........',
  '......RR........',
  '.......R........',
  '................',
  '................',
  '................',
], uRN, 'assets/ui');

console.log('Generated ' + count + ' sprites.');