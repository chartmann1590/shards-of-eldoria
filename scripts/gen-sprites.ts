const { PNG } = require('pngjs');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

function hexToRgba(hex: string): [number, number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b, 255];
}

function writeSprite(rows: string[], palette: Record<string, string>, outPath: string) {
  const dir = path.dirname(outPath);
  fs.mkdirSync(dir, { recursive: true });
  const w = rows[0].length;
  const h = rows.length;
  const png = new PNG({ width: w, height: h });
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const ch = rows[y][x] || '.';
      const idx = (y * w + x) * 4;
      if (ch === '.' || !palette[ch]) {
        png.data[idx] = 0;
        png.data[idx + 1] = 0;
        png.data[idx + 2] = 0;
        png.data[idx + 3] = 0;
      } else {
        const [r, g, b, a] = hexToRgba(palette[ch]);
        png.data[idx] = r;
        png.data[idx + 1] = g;
        png.data[idx + 2] = b;
        png.data[idx + 3] = a;
      }
    }
  }
  const buf = PNG.sync.write(png);
  fs.writeFileSync(outPath, buf);
}

// ---- PALETTES ----
const P_SKIN = { H: '#FFD699', F: '#FFE4B5', E: '#1E3A8A' };
const P_KAEL = { ...P_SKIN, A: '#3B5BD9', B: '#2746A8', C: '#1B3A7A', S: '#C0C0C0', W: '#8B5A2B', P: '#1F2937', L: '#4A6AE5' };
const P_LYRA = { ...P_SKIN, R: '#7B2D8E', P: '#5B1D6E', S: '#D4AF37', W: '#2D1B3E', L: '#9B4DBE' };
const P_BRANN = { ...P_SKIN, C: '#2D7A3E', G: '#1B5E2E', S: '#D4AF37', W: '#1A3A1E', L: '#3D9A5E' };
const P_MALGRITH = { D: '#1A1A2E', A: '#2D2D44', R: '#8B0000', E: '#FF0000', S: '#4A4A6A', K: '#0D0D1A', G: '#D4AF37', F: '#3D3D5C' };
const P_GOBLIN = { G: '#3D8B37', D: '#2D6B27', E: '#FF0000', B: '#1A4A15', S: '#5DAB57', T: '#8B5A2B', W: '#6B4226' };
const P_WOLF = { G: '#808080', D: '#5A5A5A', E: '#FFD700', B: '#404040', W: '#B0B0B0', N: '#2A2A2A' };
const P_SKELETON = { B: '#E8E8D0', D: '#C0C0A8', E: '#3A0000', S: '#A0A090', R: '#D0D0C0', K: '#F0F0E0' };
const P_WRAITH = { P: '#6B3FA0', G: '#4B1F80', E: '#FF00FF', S: '#8B5FC0', D: '#3B0F60', A: '#2B0040' };
const P_CAPTAIN = { A: '#4A4A5A', D: '#2A2A3A', R: '#8B0000', E: '#FF4444', S: '#6A6A7A', G: '#D4AF37', H: '#5A5A6A', F: '#FFD699' };
const P_TERRAIN = {
  G: '#4CAF50', D: '#388E3C', L: '#66BB6A', B: '#2E7D32',
  S: '#9E9E9E', T: '#6D4C41', N: '#5D4037', W: '#42A5F5',
  A: '#90CAF9', R: '#795548', K: '#4E342E', F: '#FFEB3B',
  C: '#BCAAA4', V: '#A5D6A7', I: '#1B5E20',
  P: '#E8E8E0', O: '#C0C0B8', H: '#D7CCC8',
  U: '#37474F', M: '#263238', X: '#FF6F00', Y: '#FFC107',
};
const P_ITEMS = {
  R: '#F44336', B: '#2196F3', G: '#FFD700', S: '#C0C0C0', D: '#8B5A2B',
  W: '#9E9E9E', A: '#795548', L: '#4CAF50', P: '#E91E63',
  K: '#3F51B5', E: '#00BCD4', N: '#FF9800', M: '#607D8B',
  H: '#F8BBD0', V: '#BBDEFB', I: '#FFF9C4',
};
const P_NPC = { ...P_SKIN, A: '#8D6E63', B: '#6D4C41', S: '#FF8F00' };
const P_NPC2 = { ...P_SKIN, A: '#1565C0', B: '#0D47A1', S: '#FFB300' };
const P_NPC3 = { ...P_SKIN, A: '#C62828', B: '#B71C1C', S: '#F9A825' };

// ---- CHARACTER SPRITES (16x16) ----
// Sir Kael - facing down, frame 1
const KAEL_DOWN_1 = [
  '......BBBB......',
  '.....BHFFHB.....',
  '.....BFEFFEB....',
  '.....BFFFFB.....',
  '....BBFFFFBB....',
  '....BBFFFFBB....',
  '...AABBBBBBAA...',
  '..AABBBBBBBBAA..',
  '..AABBSSSSBBAA..',
  '..AABBBBBBBBAA..',
  '...BBBBBBBBBB...',
  '...BBBB..BBBB...',
  '...BBB....BBB...',
  '..PPP......PPP..',
  '..PPP......PPP..',
  '..PPP......PPP..',
];

const KAEL_DOWN_2 = [
  '......BBBB......',
  '.....BHFFHB.....',
  '.....BFEFFEB....',
  '.....BFFFFB.....',
  '....BBFFFFBB....',
  '....BBFFFFBB....',
  '...AABBBBBBAA...',
  '..AABBBBBBBBAA..',
  '..AABBSSSSBBAA..',
  '..AABBBBBBBBAA..',
  '...BBBBBBBBBB...',
  '...BBBB..BBBB...',
  '...BBB....BBB...',
  '..PPP....PPP...',
  '...PPP..PPP....',
  '...PP....PP....',
];

const KAEL_UP_1 = [
  '......BBBB......',
  '.....BHFFHB.....',
  '.....BFFFFB.....',
  '.....BBBBBB.....',
  '....BBFFFFBB....',
  '....BBFFFFBB....',
  '...AABBBBBBAA...',
  '..AABBBBBBBBAA..',
  '..AABBBBBBBBAA..',
  '..AABBBBBBBBAA..',
  '...BBBBBBBBBB...',
  '...BBBB..BBBB...',
  '...BBB....BBB...',
  '..PPP......PPP..',
  '..PPP......PPP..',
  '..PPP......PPP..',
];

const KAEL_UP_2 = [
  '......BBBB......',
  '.....BHFFHB.....',
  '.....BFFFFB.....',
  '.....BBBBBB.....',
  '....BBFFFFBB....',
  '....BBFFFFBB....',
  '...AABBBBBBAA...',
  '..AABBBBBBBBAA..',
  '..AABBBBBBBBAA..',
  '..AABBBBBBBBAA..',
  '...BBBBBBBBBB...',
  '...BBBB..BBBB...',
  '...BBB....BBB...',
  '..PPP....PPP...',
  '...PPP..PPP....',
  '...PP....PP....',
];

const KAEL_LEFT_1 = [
  '....BBBB........',
  '...BHFFHB.......',
  '...BFEFFB.......',
  '...BFFFFB.......',
  '..BBFFFFBB......',
  '..BBFFFFBB......',
  '.AABBBBBBAA.....',
  '.AABBBBBBAAA....',
  '.SBBSSSSBAAA....',
  '.AABBBBBBAAA....',
  '...BBBBBBBB.....',
  '...BBB.BBBB.....',
  '...BB...BBB.....',
  '..PPP...PPP.....',
  '..PPP...PPP.....',
  '..PPP...PPP.....',
];

const KAEL_LEFT_2 = [
  '....BBBB........',
  '...BHFFHB.......',
  '...BFEFFB.......',
  '...BFFFFB.......',
  '..BBFFFFBB......',
  '..BBFFFFBB......',
  '.AABBBBBBAA.....',
  '.AABBBBBBAAA....',
  '.SBBSSSSBAAA....',
  '.AABBBBBBAAA....',
  '...BBBBBBBB.....',
  '...BBB.BBBB.....',
  '...BB...BBB.....',
  '..PPP..PPP......',
  '...PPP.PPP......',
  '...PP..PP.......',
];

const KAEL_RIGHT_1 = [
  '........BBBB....',
  '.......BHFFHB...',
  '.......BFFEFB...',
  '.......BFFFFB...',
  '......BBFFFFBB..',
  '......BBFFFFBB..',
  '.....AABBBBBBAA.',
  '....AAABBBBBBAA.',
  '....AAABSSSSBBS.',
  '....AAABBBBBBAA.',
  '.....BBBBBBBB...',
  '.....BBBB.BBB...',
  '.....BBB...BB...',
  '.....PPP...PPP..',
  '.....PPP...PPP..',
  '.....PPP...PPP..',
];

const KAEL_RIGHT_2 = [
  '........BBBB....',
  '.......BHFFHB...',
  '.......BFFEFB...',
  '.......BFFFFB...',
  '......BBFFFFBB..',
  '......BBFFFFBB..',
  '.....AABBBBBBAA.',
  '....AAABBBBBBAA.',
  '....AAABSSSSBBS.',
  '....AAABBBBBBAA.',
  '.....BBBBBBBB...',
  '.....BBBB.BBB...',
  '.....BBB...BB...',
  '......PPP..PPP..',
  '......PPP.PPP...',
  '.......PP..PP...',
];

// Lyra - facing down
const LYRA_DOWN_1 = [
  '.......RR.......',
  '......RFFR......',
  '......RFFR......',
  '......RFEFR.....',
  '.....RRFFRR.....',
  '.....RRFFRR.....',
  '....RRRRRRRR....',
  '...RRRRRRRRRR...',
  '..PRRRRRRRRRPP..',
  '..PRRRSSSRRRRP..',
  '..PRRRRRRRRRRP..',
  '...RRRRRRRRRR...',
  '...RRRR..RRRR...',
  '..PPP....PPP...',
  '..PPP....PPP...',
  '..PPP....PPP...',
];

const LYRA_DOWN_2 = [
  '.......RR.......',
  '......RFFR......',
  '......RFFR......',
  '......RFEFR.....',
  '.....RRFFRR.....',
  '.....RRFFRR.....',
  '....RRRRRRRR....',
  '...RRRRRRRRRR...',
  '..PRRRRRRRRRPP..',
  '..PRRRSSSRRRRP..',
  '..PRRRRRRRRRRP..',
  '...RRRRRRRRRR...',
  '...RRRR..RRRR...',
  '..PPP...PPP....',
  '...PPP..PPP....',
  '...PP....PP....',
];

const LYRA_UP_1 = [
  '.......RR.......',
  '......RFFR......',
  '......RFFR......',
  '......RRRRR.....',
  '.....RRFFRR.....',
  '.....RRFFRR.....',
  '....RRRRRRRR....',
  '...RRRRRRRRRR...',
  '..PRRRRRRRRRPP..',
  '..PRRRRRRRRRRP..',
  '..PRRRRRRRRRRP..',
  '...RRRRRRRRRR...',
  '...RRRR..RRRR...',
  '..PPP......PPP..',
  '..PPP......PPP..',
  '..PPP......PPP..',
];

const LYRA_UP_2 = [
  '.......RR.......',
  '......RFFR......',
  '......RFFR......',
  '......RRRRR.....',
  '.....RRFFRR.....',
  '.....RRFFRR.....',
  '....RRRRRRRR....',
  '...RRRRRRRRRR...',
  '..PRRRRRRRRRPP..',
  '..PRRRRRRRRRRP..',
  '..PRRRRRRRRRRP..',
  '...RRRRRRRRRR...',
  '...RRRR..RRRR...',
  '..PPP....PPP....',
  '...PPP..PPP.....',
  '...PP....PP.....',
];

const LYRA_LEFT_1 = [
  '....RR..........',
  '...RFFR.........',
  '...RFFR.........',
  '...RFEFR........',
  '..RRFFRR........',
  '..RRFFRR........',
  '.RRRRRRRR.......',
  'RRRRRRRRRRP.....',
  'SSSRRRRRRRRPP...',
  'RRRRRRRRRRPP....',
  '...RRRRRRRR.....',
  '...RRR.RRRR.....',
  '...RR..RRRR.....',
  '..PPP..PPP......',
  '..PPP..PPP......',
  '..PPP..PPP......',
];

const LYRA_RIGHT_1 = [
  '..........RR....',
  '.........RFFR...',
  '.........RFFR...',
  '........RFEFR...',
  '........RRFFRR..',
  '........RRFFRR..',
  '.......RRRRRRRR.',
  '.....PRRRRRRRRRR',
  '...PPRRRRRRRSSS.',
  '....PRRRRRRRRRR.',
  '.....RRRRRRRR...',
  '.....RRR.RRR...',
  '.....RRRR..RR...',
  '......PPP..PPP..',
  '......PPP..PPP..',
  '......PPP..PPP..',
];

const LYRA_LEFT_2 = [
  '....RR..........',
  '...RFFR.........',
  '...RFFR.........',
  '...RFEFR........',
  '..RRFFRR........',
  '..RRFFRR........',
  '.RRRRRRRR.......',
  'RRRRRRRRRRP.....',
  'SSSRRRRRRRRPP...',
  'RRRRRRRRRRPP....',
  '...RRRRRRRR.....',
  '...RRR.RRRR.....',
  '...RR..RRRR.....',
  '..PPP..PPP......',
  '...PPP.PPP......',
  '...PP..PP.......',
];

const LYRA_RIGHT_2 = [
  '..........RR....',
  '.........RFFR...',
  '.........RFFR...',
  '........RFEFR...',
  '........RRFFRR..',
  '........RRFFRR..',
  '.......RRRRRRRR.',
  '.....PRRRRRRRRRR',
  '...PPRRRRRRRSSS.',
  '....PRRRRRRRRRR.',
  '.....RRRRRRRR...',
  '.....RRR.RRR...',
  '.....RRRR..RR...',
  '......PPP..PPP..',
  '......PPP.PPP...',
  '.......PP..PP...',
];

// Brann - facing down
const BRANN_DOWN_1 = [
  '......CCCC......',
  '.....CHFFHC.....',
  '.....CFEFHC.....',
  '.....CFFFFC.....',
  '....CCFFFFCC....',
  '....CCFFFFCC....',
  '...CCCCCCCCCCC..',
  '..CCCCCCCCCCCCC.',
  '..GCCCCSCCCCCG..',
  '..GCCCCCCCCCGG..',
  '...CCCCCCCCCC...',
  '...CCCC..CCCC...',
  '..GGG....GGG...',
  '..GGG....GGG...',
  '..GGG....GGG...',
  '..GGG....GGG...',
];

const BRANN_DOWN_2 = [
  '......CCCC......',
  '.....CHFFHC.....',
  '.....CFEFHC.....',
  '.....CFFFFC.....',
  '....CCFFFFCC....',
  '....CCFFFFCC....',
  '...CCCCCCCCCCC..',
  '..CCCCCCCCCCCCC.',
  '..GCCCCSCCCCCG..',
  '..GCCCCCCCCCGG..',
  '...CCCCCCCCCC...',
  '...CCCC..CCCC...',
  '..GGG...GGG....',
  '...GGG..GGG....',
  '...GG...GG.....',
  '..GGG...GGG....',
];

const BRANN_UP_1 = [
  '......CCCC......',
  '.....CHFFHC.....',
  '.....CFFFFC.....',
  '.....CCCCCC.....',
  '....CCFFFFCC....',
  '....CCFFFFCC....',
  '...CCCCCCCCCCC..',
  '..CCCCCCCCCCCCC.',
  '..GCCCCCCCCCCGG.',
  '..GCCCCCCCCCCGG.',
  '...CCCCCCCCCC...',
  '...CCCC..CCCC...',
  '..GGG....GGG...',
  '..GGG....GGG...',
  '..GGG....GGG...',
  '..GGG....GGG...',
];

const BRANN_UP_2 = [
  '......CCCC......',
  '.....CHFFHC.....',
  '.....CFFFFC.....',
  '.....CCCCCC.....',
  '....CCFFFFCC....',
  '....CCFFFFCC....',
  '...CCCCCCCCCCC..',
  '..CCCCCCCCCCCCC.',
  '..GCCCCCCCCCCGG.',
  '..GCCCCCCCCCCGG.',
  '...CCCCCCCCCC...',
  '...CCCC..CCCC...',
  '..GGG...GGG....',
  '...GGG..GGG....',
  '...GG..GG.....',
  '..GGG...GGG....',
];

const BRANN_LEFT_1 = [
  '....CCCC........',
  '...CHFFHC.......',
  '...CFEFHC.......',
  '...CFFFFC.......',
  '..CCFFFFCC......',
  '..CCFFFFCC......',
  '.CCCCCCCCCC.....',
  'GCCCCCCCCCCGG...',
  'SCCCCCCCCCCGG...',
  'GCCCCCCCCCCGG...',
  '...CCCCCCCC.....',
  '...CCC.CCCC.....',
  '..GGG..GGG......',
  '..GGG..GGG......',
  '..GGG..GGG......',
  '..GGG..GGG......',
];

const BRANN_RIGHT_1 = [
  '........CCCC....',
  '.......CHFFHC...',
  '.......CFEFHC...',
  '.......CFFFFC...',
  '......CCFFFFCC..',
  '......CCFFFFCC..',
  '.....CCCCCCCCCC.',
  '...GGCCCCCCCCCCG',
  '...GGCCCCCCCCCS.',
  '...GGCCCCCCCCCCG',
  '.....CCCCCCCC...',
  '.....CCCC.CCC...',
  '......GGG..GGG..',
  '......GGG..GGG..',
  '......GGG..GGG..',
  '......GGG..GGG..',
];

const BRANN_LEFT_2 = [
  '....CCCC........',
  '...CHFFHC.......',
  '...CFEFHC.......',
  '...CFFFFC.......',
  '..CCFFFFCC......',
  '..CCFFFFCC......',
  '.CCCCCCCCCC.....',
  'GCCCCCCCCCCGG...',
  'SCCCCCCCCCCGG...',
  'GCCCCCCCCCCGG...',
  '...CCCCCCCC.....',
  '...CCC.CCCC.....',
  '..GGG..GGG......',
  '...GGG.GGG......',
  '...GG..GG.......',
  '..GGG..GGG......',
];

const BRANN_RIGHT_2 = [
  '........CCCC....',
  '.......CHFFHC...',
  '.......CFEFHC...',
  '.......CFFFFC...',
  '......CCFFFFCC..',
  '......CCFFFFCC..',
  '.....CCCCCCCCCC.',
  '...GGCCCCCCCCCCG',
  '...GGCCCCCCCCCS.',
  '...GGCCCCCCCCCCG',
  '.....CCCCCCCC...',
  '.....CCCC.CCC...',
  '......GGG..GGG..',
  '......GGG.GGG...',
  '.......GG..GG...',
  '......GGG..GGG..',
];

// ---- ENEMY SPRITES ----
const GOBLIN_IDLE = [
  '......DDDD......',
  '.....DGGGGD.....',
  '.....GGEgGGD....',
  '....GGEGGEGG....',
  '....GGGGGGGG....',
  '...DDGGGGGGDD...',
  '..DDBBGGBBBDD...',
  '..DDBGGGBBBDD...',
  '..DDGGGGGGDD....',
  '...GGGGGGGG.....',
  '...GGG..GGG.....',
  '..TTT....TTT....',
  '..TTT....TTT....',
  '..WWW....WWW....',
  '................',
  '................',
];

const GOBLIN_ATTACK = [
  '..............DD',
  '.....DGGGGD..DD',
  '.....GGEgGGD.DD',
  '....GGEGGEGG....',
  '....GGGGGGGG....',
  '...DDGGGGGGDD...',
  '..DDBBGGGBBDD...',
  '..DDBGGGBBBDD...',
  '..DDGGGGGGDD....',
  '...GGGGGGGG.....',
  '...GGG..GGG.....',
  '..TTT....TTT....',
  '..TTT....TTT....',
  '..WWW....WWW....',
  '................',
  '................',
];

const WOLF_IDLE = [
  '................',
  '................',
  '.GG....GGGGGGG..',
  'GGGGGGGGGGGGGGG.',
  'GGWGGGGGGGGGGGG.',
  'GGGGEGGGEGGGGGG.',
  'GGGGGGGGGGGGGGGG',
  'GBGGGGGGGGGGGBGG',
  '.GBGGGGGGGGGBG..',
  '..GGGGGGGGGGG...',
  '..GGGG..GGGG....',
  '..GGG....GGG....',
  '.NNNN....NNNN...',
  '................',
  '................',
  '................',
];

const WOLF_ATTACK = [
  '................',
  '................',
  '.GG.............',
  'GGGGGGGGG.......',
  'GGWGGGGGGGGGGG..',
  'GGGGEGGGEGGGGGG.',
  'GGGGGGGGGGGGGGGG',
  'GBGGGGGGGGGGGBGG',
  '.GBGGGGGGGGGBG..',
  '..GGGGGGGGGGG...',
  '..GGGG..GGGG....',
  '..GGG....GGG....',
  '.NNNN....NNNN...',
  '................',
  '................',
  '................',
];

const SKELETON_IDLE = [
  '......BBBB......',
  '.....BRRRRB.....',
  '.....BRERRB.....',
  '.....BRRRRB.....',
  '.....BBBBBB.....',
  '....BBRRRRBB....',
  '...SBBBBBBS.....',
  '..SSBBBBBSS.....',
  '..SBBBBBBBSS....',
  '...BBBBBBB......',
  '...BBB..BBB.....',
  '...BB....BB.....',
  '..KKK....KKK...',
  '..KKK....KKK...',
  '................',
  '................',
];

const SKELETON_ATTACK = [
  '.............BBB',
  '............BRRB',
  '.....BRERRB.BBB',
  '.....BRRRRB.....',
  '.....BBBBBB.....',
  '....BBRRRRBB....',
  '...SBBBBBBS.....',
  '..SSBBBBBSS.....',
  '..SBBBBBBBSS....',
  '...BBBBBBB......',
  '...BBB..BBB.....',
  '...BB....BB.....',
  '..KKK....KKK...',
  '..KKK....KKK...',
  '................',
  '................',
];

const WRAITH_IDLE = [
  '......PPPP......',
  '.....PPPPPP.....',
  '.....PPEPPP.....',
  '....PPPPPPPP....',
  '...PPPPPPPPPP...',
  '..PPPPPPPPPPPP..',
  '..PPPPPPPPPPPP..',
  '..PPPPPPPPPPPP..',
  '...PPPPPPPPPP...',
  '...PPPPPPPPPP...',
  '...PPPP..PPPP...',
  '..PPPP....PPPP..',
  '..PPPP....PPPP..',
  '...PP......PP...',
  '................',
  '................',
];

const WRAITH_ATTACK = [
  '......PPPP......',
  '.....PPPPPP.....',
  '.....PPEPPP.....',
  '....PPPPPPPP....',
  '...PPPPPPPPPP...',
  '..PPPPPPPPPPPP..',
  '..PPPPPPPPPPPP..',
  '..PPPPPPPPPPPP..',
  '...PPPPPPPPPP...',
  '...PPPPPPPPPP...',
  '...PPPP..PPPP...',
  '..PPPP....PPPP..',
  '..PPPP....PPPP..',
  '...PP......PP...',
  '.............PP.',
  '.............PP.',
];

// Fortress Captain (24x24)
const CAPTAIN_IDLE: string[] = [];
const CAPTAIN_ATTACK: string[] = [];
(function() {
  const idle = [
    '........DDDDDDDD........',
    '.......DDFFFFFFDD.......',
    '.......DFEFFFFEFD.......',
    '.......DDFFFFFFDD.......',
    '......DDDFFFFFFDDD......',
    '.....DDDDFFFFFFDDDD.....',
    '....AADDDDDDDDDAA......',
    '...AAADDDDDDDDDAAA.....',
    '..AAAADDSSSSDDAAAA.....',
    '..AAAADDDDDDDAAAAA.....',
    '..AADDDDDDDDDDDDAA.....',
    '...DDDDDDDDDDDDDD......',
    '...DDDDD..DDDDDDD......',
    '...DDDD....DDDDD.......',
    '..HHHH......HHHH.......',
    '..HHHH......HHHH.......',
    '.......................',
    '.......................',
    '.......................',
    '.......................',
    '.......................',
    '.......................',
    '.......................',
    '.......................',
  ];
  CAPTAIN_IDLE.push(...idle);
  const attack = [...idle];
  attack[6] = '....AADDDDDDDDDAA......';
  attack[7] = '...AAADDDDDDDDDAAA..RR.';
  attack[8] = '..AAAADDSSSSDDAAAA..RR.';
  attack[9] = '..AAAADDDDDDDAAAAA.....';
  CAPTAIN_ATTACK.push(...attack);
})();

// Malgrith (32x32)
const MALGRITH_IDLE: string[] = [];
const MALGRITH_ATTACK: string[] = [];
(function() {
  const idle: string[] = [];
  for (let i = 0; i < 32; i++) idle.push('.'.repeat(32));
  // Head
  const headRows = [
    '............DDDDDD............',
    '...........DDDDDDDD...........',
    '..........DDFFFFFFDD..........',
    '..........DFEFFFFEFD..........',
    '..........DDFFFFFFDD..........',
    '.........DDDFFFFFFDDD.........',
    '........DDDDFFFFFFDDDD........',
    '.......DDDDDFFFFFFDDDDD.......',
    '......AADDDDDDDDDDDDDAA.......',
    '.....AAAADDDDDDDDDDDAAA.......',
    '....AAAAADDDDDDDDDDDAAAA......',
    '...AAAAAADDDSSSSDDDDAAAAA.....',
    '...AAAAADDDDDDDDDDDAAAAAA.....',
    '....AAADDDDDDDDDDDDDDAAA......',
    '.....DDDDDDDDDDDDDDDDDD.......',
    '.....DDDDDDD..DDDDDDDDD.......',
    '......DDDDD....DDDDDD.........',
    '.....RRRRRR....RRRRRR.........',
    '....RRRRRRRR..RRRRRRRR........',
    '...RRRRRRRRRRRRRRRRRRRR.......',
    '...RRRRRRRRRRRRRRRRRRRR.......',
    '....RRRRRRRRRRRRRRRRRR........',
    '.....RRRRRRRRRRRRRRRR.........',
    '......RRRRRRRRRRRRRR..........',
  ];
  for (let i = 0; i < headRows.length; i++) {
    idle[i] = headRows[i];
  }
  MALGRITH_IDLE.push(...idle);
  const attack = [...idle.map(r => r)];
  // Lunge forward slightly
  attack[8] = '........AADDDDDDDDDDDAA.......';
  attack[9] = '.......AAAADDDDDDDDDDDAAA..RR.';
  attack[10] = '......AAAAADDDDDDDDDDDAAAARRR.';
  attack[11] = '.....AAAAADDDSSSSDDDDAAAAA....';
  MALGRITH_ATTACK.push(...attack);
})();

// ---- NPC SPRITES ----
const NPC1_DOWN = [
  '......BBBB......',
  '.....BHFFHB.....',
  '.....BFEFFEB....',
  '.....BFFFFB.....',
  '....BBFFFFBB....',
  '....AABBBBBBAA..',
  '...AABBBBBBAA...',
  '..AABBBBBBAAA...',
  '..AABBBBBBAAA...',
  '...BBBBBBBBB....',
  '...BBBB.BBBB....',
  '...BBB...BBB....',
  '..PPP....PPP....',
  '..PPP....PPP....',
  '................',
  '................',
];

const NPC2_DOWN = [
  '......BBBB......',
  '.....BHFFHB.....',
  '.....BFEFFEB....',
  '.....BFFFFB.....',
  '....BBFFFFBB....',
  '....AABBBBBBAA..',
  '...AABBBBBBAA...',
  '..AABBBBBBAAA...',
  '..AABBBBBBAAA...',
  '...BBBBBBBBB....',
  '...BBBB.BBBB....',
  '...BBB...BBB....',
  '..PPP....PPP....',
  '..PPP....PPP....',
  '................',
  '................',
];

const NPC3_DOWN = [
  '......BBBB......',
  '.....BHFFHB.....',
  '.....BFEFFEB....',
  '.....BFFFFB.....',
  '....BBFFFFBB....',
  '....AABBBBBBAA..',
  '...AABBBBBBAA...',
  '..AABBBBBBAAA...',
  '..AABBBBBBAAA...',
  '...BBBBBBBBB....',
  '...BBBB.BBBB....',
  '...BBB...BBB....',
  '..PPP....PPP....',
  '..PPP....PPP....',
  '................',
  '................',
];

const SHOPKEEPER = [
  '......BBBB......',
  '.....BHFFHB.....',
  '.....BFEFFEB....',
  '.....BFFFFB.....',
  '....BBFFFFBB....',
  '....SSSSSSSS....',
  '...SSSSSSSSSS...',
  '..SSSSSSSSSSSS..',
  '..SSSSSSSSSSSS..',
  '...SSSSSSSSSS...',
  '...SSSS..SSSS...',
  '..PPP....PPP....',
  '..PPP....PPP....',
  '................',
  '................',
  '................',
];

const KING = [
  '.....YYYYYY.....',
  '....YYGYYYY.....',
  '......BBBB......',
  '.....BHFFHB.....',
  '.....BFEFFEB....',
  '....BBFFFFBB....',
  '...GGGGGGGGGG...',
  '..GGGGGGGGGGGG..',
  '..GGGGGGGGGGGG..',
  '..GGGGGGGGGGGG..',
  '...GGGGGGGGGG...',
  '...GGGG..GGGG...',
  '..PPP....PPP....',
  '..PPP....PPP....',
  '................',
  '................',
];

// ---- TERRAIN TILES (16x16) ----
const GRASS_1: string[] = [];
const GRASS_2: string[] = [];
const GRASS_3: string[] = [];
for (let y = 0; y < 16; y++) {
  let r1 = '', r2 = '', r3 = '';
  for (let x = 0; x < 16; x++) {
    const h = ((x * 7 + y * 13) % 17);
    if (h < 8) { r1 += 'G'; r2 += h < 4 ? 'G' : 'D'; r3 += h < 6 ? 'L' : 'G'; }
    else if (h < 12) { r1 += 'D'; r2 += 'G'; r3 += 'G'; }
    else { r1 += 'G'; r2 += 'L'; r3 += 'D'; }
  }
  GRASS_1.push(r1);
  GRASS_2.push(r2);
  GRASS_3.push(r3);
}

const STONE_PATH: string[] = [];
for (let y = 0; y < 16; y++) {
  let r = '';
  for (let x = 0; x < 16; x++) {
    const h = ((x * 3 + y * 7) % 11);
    r += h < 5 ? 'S' : h < 9 ? 'C' : 'C';
  }
  STONE_PATH.push(r);
}

const DIRT_PATH: string[] = [];
for (let y = 0; y < 16; y++) {
  let r = '';
  for (let x = 0; x < 16; x++) {
    const h = ((x * 5 + y * 3) % 13);
    r += h < 6 ? 'R' : h < 10 ? 'K' : 'N';
  }
  DIRT_PATH.push(r);
}

const TREE = [
  '......IIII......',
  '.....IIIIII.....',
  '....IIIIIIII....',
  '...IIIIIIIIII...',
  '..IIIIIIIIIIII..',
  '.IIIIIIIIIIIIII.',
  '..IIIIIIIIIIII..',
  '...IIIIIIIIII...',
  '....IIIIIIII....',
  '......TTTT......',
  '......TTTT......',
  '......TTTT......',
  '......TTTT......',
  '......TTTT......',
  '................',
  '................',
];

const BUSH = [
  '................',
  '................',
  '.....IIIIII.....',
  '....IIIIIIII....',
  '...IIIIIIIIII...',
  '..IIIIIIIIIIII..',
  '..IIIIIIIIIIII..',
  '...IIIIIIIIII...',
  '....IIIIIIII....',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
];

const FLOWER = [
  '................',
  '................',
  '................',
  '......FFF.......',
  '.....FFPFF......',
  '.....FPFPFF.....',
  '......FFF.......',
  '.......II.......',
  '.......II.......',
  '.......II.......',
  '.......II.......',
  '................',
  '................',
  '................',
  '................',
  '................',
];

const WATER_1: string[] = [];
const WATER_2: string[] = [];
for (let y = 0; y < 16; y++) {
  let r1 = '', r2 = '';
  for (let x = 0; x < 16; x++) {
    const w1 = ((x + y) % 3 === 0);
    const w2 = ((x + y + 1) % 3 === 0);
    r1 += w1 ? 'A' : 'W';
    r2 += w2 ? 'A' : 'W';
  }
  WATER_1.push(r1);
  WATER_2.push(r2);
}

const STONE_WALL = Array(16).fill('S'.repeat(16));
const BRICK_WALL: string[] = [];
for (let y = 0; y < 16; y++) {
  let r = '';
  for (let x = 0; x < 16; x++) {
    const brickLine = y % 4 < 1;
    const brickGap = (y % 8 < 4) ? (x % 8 < 1) : ((x + 4) % 8 < 1);
    r += (brickLine || brickGap) ? 'K' : 'R';
  }
  BRICK_WALL.push(r);
}

const FORTRESS_FLOOR: string[] = [];
for (let y = 0; y < 16; y++) {
  let r = '';
  for (let x = 0; x < 16; x++) {
    r += ((x + y) % 7 < 2) ? 'P' : 'O';
  }
  FORTRESS_FLOOR.push(r);
}

const DUNGEON_STONE: string[] = [];
for (let y = 0; y < 16; y++) {
  let r = '';
  for (let x = 0; x < 16; x++) {
    const h = ((x * 11 + y * 7) % 13);
    r += h < 4 ? 'U' : h < 9 ? 'M' : 'U';
  }
  DUNGEON_STONE.push(r);
}

const TORCH_1 = [
  '.......KK.......',
  '......KNNK......',
  '......KNNK......',
  '......KNXK......',
  '......KYYK......',
  '.......KK.......',
  '.......KK.......',
  '.......KK.......',
  '.......KK.......',
  '.......KK.......',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
];

const TORCH_2 = [
  '.......KK.......',
  '......KYYK......',
  '......KYXK......',
  '......KNXK......',
  '......KYYK......',
  '.......KK.......',
  '.......KK.......',
  '.......KK.......',
  '.......KK.......',
  '.......KK.......',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
];

const DOOR_CLOSED = [
  'KKKKKKKKKKKKKKKK',
  'K..............K',
  'K..............K',
  'K..............K',
  'K..............K',
  'K..............K',
  'K..............K',
  'K..............K',
  'K..............K',
  'K..............K',
  'K..............K',
  'K..............K',
  'K..............K',
  'K..............K',
  'K.............DK',
  'KKKKKKKKKKKKKKKK',
];

const DOOR_OPEN = [
  'KKKKKKKKKKKKKKKK',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  'KKKKKKKKKKKKKKKK',
];

const STAIRS_UP = [
  'OOOOOOOOOOOOOOOO',
  'O.............OO',
  'O.PPPPPPPPPPPP.O',
  'O.P..........P.O',
  'O.PPPPPPPPPPPP.O',
  'O..P..........PO',
  'O..PPPPPPPPPPP.O',
  'O...P.........PO',
  'O...PPPPPPPPPP.O',
  'O....P........PO',
  'O....PPPPPPPPP.O',
  'O.....P.......PO',
  'O.....PPPPPPPP.O',
  'O......P......PO',
  'O..............O',
  'OOOOOOOOOOOOOOOO',
];

const STAIRS_DOWN = [
  'OOOOOOOOOOOOOOOO',
  'O..............O',
  'O..PPPPPPPPPPP.O',
  'O...P..........O',
  'O...PPPPPPPPPP.O',
  'O....P.........O',
  'O....PPPPPPPPP.O',
  'O.....P........O',
  'O.....PPPPPPPP.O',
  'O......P.......O',
  'O......PPPPPPP.O',
  'O.......P......O',
  'O.......PPPPPP.O',
  'O..............O',
  'O..............O',
  'OOOOOOOOOOOOOOOO',
];

const CHEST_CLOSED = [
  '................',
  '................',
  '................',
  '..KKKKKKKKKKKK..',
  '..KDDDDDDDDDKK..',
  '..KDDDDGDDDDKK..',
  '..KKKKKKKKKKKK..',
  '..KDDDDDDDDDKK..',
  '..KDDDDDDDDDKK..',
  '..KDDDDDDDDDKK..',
  '..KDDDDDDDDDKK..',
  '..KKKKKKKKKKKK..',
  '................',
  '................',
  '................',
  '................',
];

const CHEST_OPEN = [
  '................',
  '................',
  '................',
  '..KKKKKKKKKKKK..',
  '..KDDDDDDDDDKK..',
  '..KDDDDDDDDDKK..',
  '..DDDDDDDDDDKK..',
  '..KDDDDDDDDDKK..',
  '..KDDGDDDDDKKK..',
  '..KDDDDDDDDDKK..',
  '..KDDDDDDDDDKK..',
  '..KKKKKKKKKKKK..',
  '................',
  '................',
  '................',
  '................',
];

// ---- ITEMS (16x16) ----
const POTION = [
  '................',
  '......RR........',
  '.....RRRR.......',
  '.....RRRR.......',
  '....RRRRRR......',
  '....RWRRWR......',
  '....RWRRWR......',
  '....RRRRRR......',
  '....RRRRRR......',
  '...RRRRRRRR.....',
  '...RRRRRRRR.....',
  '...RRRRRRRR.....',
  '...RRRRRRRR.....',
  '....RRRRRR......',
  '................',
  '................',
];

const MANA_POTION = [
  '................',
  '......BB........',
  '.....BBBB.......',
  '.....BBBB.......',
  '....BBBBBB......',
  '....BWBBWB......',
  '....BWBBWB......',
  '....BBBBBB......',
  '....BBBBBB......',
  '...BBBBBBBB.....',
  '...BBBBBBBB.....',
  '...BBBBBBBB.....',
  '...BBBBBBBB.....',
  '....BBBBBB......',
  '................',
  '................',
];

const ELIXIR = [
  '................',
  '......GG........',
  '.....GGGG.......',
  '.....GGGG.......',
  '....GGGGGG......',
  '....GWGGWG......',
  '....GWGGWG......',
  '....GGGGGG......',
  '....GGGGGG......',
  '...GGGGGGGG.....',
  '...GGGGGGGG.....',
  '...GGGGGGGG.....',
  '...GGGGGGGG.....',
  '....GGGGGG......',
  '................',
  '................',
];

const IRON_SWORD = [
  '................',
  '..........SS....',
  '.........SS.....',
  '........SS......',
  '.......SS.......',
  '......SS........',
  '.....SS.........',
  '....SS..........',
  '...SS...........',
  '...SSS..........',
  '....DS..........',
  '.....D..........',
  '....DDD.........',
  '................',
  '................',
  '................',
];

const STEEL_SWORD = [
  '................',
  '..........WW....',
  '.........WW.....',
  '........WW......',
  '.......WW.......',
  '......WW........',
  '.....WW.........',
  '....WW..........',
  '...WW...........',
  '...WWW..........',
  '....DW..........',
  '.....D..........',
  '....DDD.........',
  '................',
  '................',
  '................',
];

const KNIGHT_SWORD = [
  '................',
  '..........SS....',
  '.........SSG....',
  '........SSG.....',
  '.......SSG......',
  '......SSG.......',
  '.....SSG........',
  '....SSG.........',
  '...SSG..........',
  '...SSSG.........',
  '....DG..........',
  '.....DG.........',
  '....DDDG........',
  '................',
  '................',
  '................',
];

const LEATHER_ARMOR = [
  '................',
  '................',
  '...AAAAAAAAAA...',
  '..AAAAAAAAAAAA..',
  '.AAAAAAAAAAAAAA.',
  '.AAAAAAAAAAAAAA.',
  '..AAAAAAAAAAAA..',
  '..AAAAAAAAAAAA..',
  '..AAAAAAAAAAAA..',
  '..AAAAAAAAAAAA..',
  '..AAAAAAAAAAAA..',
  '..AAAAAAAAAAAA..',
  '...AAAAAAAAAA...',
  '................',
  '................',
  '................',
];

const CHAINMAIL = [
  '................',
  '................',
  '...MMMMMMMMMM...',
  '..MOMOMOMOMOMM..',
  '..OMOMOMOMOMOM..',
  '..MOMOMOMOMOMM..',
  '..OMOMOMOMOMOM..',
  '..MOMOMOMOMOMM..',
  '..OMOMOMOMOMOM..',
  '..MOMOMOMOMOMM..',
  '..OMOMOMOMOMOM..',
  '..MOMOMOMOMOMM..',
  '...MMMMMMMMMM...',
  '................',
  '................',
  '................',
];

const PLATE_ARMOR = [
  '................',
  '................',
  '...SSSSSSSSSS...',
  '..SSSSSSSSSSSS..',
  '.SSSSSSSSSSSSSS.',
  '.SSSSSSSSSSSSSS.',
  '.SSSSSSSSSSSSSS.',
  '..SSSSSSSSSSSS..',
  '..SSSSSSSSSSSS..',
  '..SSSSSSSSSSSS..',
  '..SSSSSSSSSSSS..',
  '..SSSSSSSSSSSS..',
  '...SSSSSSSSSS...',
  '................',
  '................',
  '................',
];

const RED_SHARD = [
  '................',
  '................',
  '......RR........',
  '.....RRRR.......',
  '....RRRRRR......',
  '...RRRHHRRRR....',
  '..RRRHHHHRRR....',
  '..RRRHHHHRRR....',
  '...RRRHHRRR.....',
  '....RRRRRR......',
  '.....RRRR.......',
  '......RR........',
  '................',
  '................',
  '................',
  '................',
];

const BLUE_SHARD = [
  '................',
  '................',
  '......BB........',
  '.....BBBB.......',
  '....BBBBBB......',
  '...BBBHHBBBB....',
  '..BBBHHHHBBB....',
  '..BBBHHHHBBB....',
  '...BBBHHBBB.....',
  '....BBBBBB......',
  '.....BBBB.......',
  '......BB........',
  '................',
  '................',
  '................',
  '................',
];

const GREEN_SHARD = [
  '................',
  '................',
  '......LL........',
  '.....LLLL.......',
  '....LLLLLL......',
  '...LLLHHLLLL....',
  '..LLLHHHHLLL....',
  '..LLLHHHHLLL....',
  '...LLLHHLLL.....',
  '....LLLLLL......',
  '.....LLLL.......',
  '......LL........',
  '................',
  '................',
  '................',
  '................',
];

const GOLD_COIN = [
  '................',
  '................',
  '.....GGGG.......',
  '...GGGGGGGG.....',
  '..GGGGGGGGGG....',
  '..GGGGLGGGGGG...',
  '..GGGGGGGGGGGG..',
  '..GGGGGGGGGGGG..',
  '..GGGGLGGGGGG...',
  '..GGGGGGGGGG....',
  '...GGGGGGGG.....',
  '.....GGGG.......',
  '................',
  '................',
  '................',
  '................',
];

// ---- UI SPRITES ----
const CURSOR = [
  '..YY............',
  '.YYY............',
  'YYYY............',
  '.YYY............',
  '..YY............',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
];

const HEART_ICON = [
  '................',
  '................',
  '..RR....RR......',
  '.RRRR..RRRR.....',
  'RRRRRRRRRRRR....',
  'RRRRRRRRRRRR....',
  'RRRRRRRRRRRR....',
  '.RRRRRRRRRR.....',
  '..RRRRRRRR......',
  '...RRRRRR.......',
  '....RRRR........',
  '.....RR.........',
  '................',
  '................',
  '................',
  '................',
];

const MANA_ICON = [
  '................',
  '................',
  '..BB....BB......',
  '.BBBB..BBBB.....',
  'BBBBBBBBBBBB....',
  'BBBBBBBBBBBB....',
  'BBBBBBBBBBBB....',
  '.BBBBBBBBBB.....',
  '..BBBBBBBB......',
  '...BBBBBB.......',
  '....BBBB........',
  '.....BB.........',
  '................',
  '................',
  '................',
  '................',
];

const EXP_ICON = [
  '................',
  '................',
  '................',
  '......LL........',
  '.....LLLL.......',
  '....LLLLLL......',
  '...LLLLLLLL.....',
  '....LLLLLL......',
  '.....LLLL.......',
  '......LL........',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
];

const SWORD_ICON = [
  '................',
  '..........SS....',
  '.........SS.....',
  '........SS......',
  '.......SS.......',
  '......SS........',
  '.....SS.........',
  '....SS..........',
  '...SS...........',
  '...SSS..........',
  '....DS..........',
  '................',
  '................',
  '................',
  '................',
  '................',
];

const FLAME_ICON = [
  '................',
  '......RR........',
  '.....RRRR.......',
  '....RRNRRR......',
  '...RRNNNRRR.....',
  '..RRRNNNRRRR....',
  '..RRRNNNRRRR....',
  '..RRRNNNRRRR....',
  '...RRNNNRRR.....',
  '....RRRRRR......',
  '.....RRRR.......',
  '................',
  '................',
  '................',
  '................',
  '................',
];

const POTION_ICON = [
  '................',
  '......RR........',
  '.....RRRR.......',
  '....RRRRRR......',
  '...RRRWRRWRR....',
  '...RRRWRRWRR....',
  '...RRRRRRRR.....',
  '...RRRRRRRR.....',
  '....RRRRRR......',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
];

const RUN_ICON = [
  '................',
  '......NN........',
  '.....NNNN.......',
  '......NN........',
  '.....NNNN.......',
  '....NN..NN......',
  '...NN....NN.....',
  '..NN......NN....',
  '.NN........NN...',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
];

// ---- GENERATE ALL ----
const chars = path.join(ROOT, 'assets', 'sprites', 'characters');
const enemiesDir = path.join(ROOT, 'assets', 'sprites', 'enemies');
const tiles = path.join(ROOT, 'assets', 'tiles');
const uiDir = path.join(ROOT, 'assets', 'ui');

// Characters - 4 directions x 2 frames
const charSprites: [string, string[], any][] = [
  ['kael_down_1', KAEL_DOWN_1, P_KAEL],
  ['kael_down_2', KAEL_DOWN_2, P_KAEL],
  ['kael_up_1', KAEL_UP_1, P_KAEL],
  ['kael_up_2', KAEL_UP_2, P_KAEL],
  ['kael_left_1', KAEL_LEFT_1, P_KAEL],
  ['kael_left_2', KAEL_LEFT_2, P_KAEL],
  ['kael_right_1', KAEL_RIGHT_1, P_KAEL],
  ['kael_right_2', KAEL_RIGHT_2, P_KAEL],
  ['lyra_down_1', LYRA_DOWN_1, P_LYRA],
  ['lyra_down_2', LYRA_DOWN_2, P_LYRA],
  ['lyra_up_1', LYRA_UP_1, P_LYRA],
  ['lyra_up_2', LYRA_UP_2, P_LYRA],
  ['lyra_left_1', LYRA_LEFT_1, P_LYRA],
  ['lyra_left_2', LYRA_LEFT_2, P_LYRA],
  ['lyra_right_1', LYRA_RIGHT_1, P_LYRA],
  ['lyra_right_2', LYRA_RIGHT_2, P_LYRA],
  ['brann_down_1', BRANN_DOWN_1, P_BRANN],
  ['brann_down_2', BRANN_DOWN_2, P_BRANN],
  ['brann_up_1', BRANN_UP_1, P_BRANN],
  ['brann_up_2', BRANN_UP_2, P_BRANN],
  ['brann_left_1', BRANN_LEFT_1, P_BRANN],
  ['brann_left_2', BRANN_LEFT_2, P_BRANN],
  ['brann_right_1', BRANN_RIGHT_1, P_BRANN],
  ['brann_right_2', BRANN_RIGHT_2, P_BRANN],
  ['npc1_down', NPC1_DOWN, P_NPC],
  ['npc2_down', NPC2_DOWN, P_NPC2],
  ['npc3_down', NPC3_DOWN, P_NPC3],
  ['shopkeeper', SHOPKEEPER, P_NPC],
  ['king', KING, P_NPC2],
];

charSprites.forEach(([name, rows, pal]) => {
  writeSprite(rows as string[], pal as Record<string, string>, path.join(chars, `${name}.png`));
});
console.log(`Generated ${charSprites.length} character sprites`);

// Enemies
const enemySprites: [string, string[], any][] = [
  ['goblin_idle', GOBLIN_IDLE, P_GOBLIN],
  ['goblin_attack', GOBLIN_ATTACK, P_GOBLIN],
  ['wolf_idle', WOLF_IDLE, P_WOLF],
  ['wolf_attack', WOLF_ATTACK, P_WOLF],
  ['skeleton_idle', SKELETON_IDLE, P_SKELETON],
  ['skeleton_attack', SKELETON_ATTACK, P_SKELETON],
  ['wraith_idle', WRAITH_IDLE, P_WRAITH],
  ['wraith_attack', WRAITH_ATTACK, P_WRAITH],
  ['captain_idle', CAPTAIN_IDLE, P_CAPTAIN],
  ['captain_attack', CAPTAIN_ATTACK, P_CAPTAIN],
  ['malgrith_idle', MALGRITH_IDLE, P_MALGRITH],
  ['malgrith_attack', MALGRITH_ATTACK, P_MALGRITH],
];

enemySprites.forEach(([name, rows, pal]) => {
  writeSprite(rows as string[], pal as Record<string, string>, path.join(enemiesDir, `${name}.png`));
});
console.log(`Generated ${enemySprites.length} enemy sprites`);

// Tiles
const tileSprites: [string, string[], any][] = [
  ['grass_1', GRASS_1, P_TERRAIN],
  ['grass_2', GRASS_2, P_TERRAIN],
  ['grass_3', GRASS_3, P_TERRAIN],
  ['stone_path', STONE_PATH, P_TERRAIN],
  ['dirt_path', DIRT_PATH, P_TERRAIN],
  ['tree', TREE, P_TERRAIN],
  ['bush', BUSH, P_TERRAIN],
  ['flower', FLOWER, P_TERRAIN],
  ['water_1', WATER_1, P_TERRAIN],
  ['water_2', WATER_2, P_TERRAIN],
  ['stone_wall', STONE_WALL, P_TERRAIN],
  ['brick_wall', BRICK_WALL, P_TERRAIN],
  ['fortress_floor', FORTRESS_FLOOR, P_TERRAIN],
  ['dungeon_stone', DUNGEON_STONE, P_TERRAIN],
  ['torch_1', TORCH_1, P_TERRAIN],
  ['torch_2', TORCH_2, P_TERRAIN],
  ['door_closed', DOOR_CLOSED, P_TERRAIN],
  ['door_open', DOOR_OPEN, P_TERRAIN],
  ['stairs_up', STAIRS_UP, P_TERRAIN],
  ['stairs_down', STAIRS_DOWN, P_TERRAIN],
  ['chest_closed', CHEST_CLOSED, P_TERRAIN],
  ['chest_open', CHEST_OPEN, P_TERRAIN],
];

tileSprites.forEach(([name, rows, pal]) => {
  writeSprite(rows as string[], pal as Record<string, string>, path.join(tiles, `${name}.png`));
});
console.log(`Generated ${tileSprites.length} tile sprites`);

// Items
const itemSprites: [string, string[], any][] = [
  ['potion', POTION, P_ITEMS],
  ['mana_potion', MANA_POTION, P_ITEMS],
  ['elixir', ELIXIR, P_ITEMS],
  ['iron_sword', IRON_SWORD, P_ITEMS],
  ['steel_sword', STEEL_SWORD, P_ITEMS],
  ['knight_sword', KNIGHT_SWORD, P_ITEMS],
  ['leather_armor', LEATHER_ARMOR, P_ITEMS],
  ['chainmail', CHAINMAIL, P_ITEMS],
  ['plate_armor', PLATE_ARMOR, P_ITEMS],
  ['red_shard', RED_SHARD, P_ITEMS],
  ['blue_shard', BLUE_SHARD, P_ITEMS],
  ['green_shard', GREEN_SHARD, P_ITEMS],
  ['gold_coin', GOLD_COIN, P_ITEMS],
];

itemSprites.forEach(([name, rows, pal]) => {
  writeSprite(rows as string[], pal as Record<string, string>, path.join(tiles, `item_${name}.png`));
});
console.log(`Generated ${itemSprites.length} item sprites`);

// UI
const uiSprites: [string, string[], any][] = [
  ['cursor', CURSOR, { Y: '#f2ca50' }],
  ['heart', HEART_ICON, { R: '#C5364A' }],
  ['mana', MANA_ICON, { B: '#2E6BE6' }],
  ['exp', EXP_ICON, { L: '#2BB673' }],
  ['sword_action', SWORD_ICON, { S: '#C0C0C0', D: '#8B5A2B' }],
  ['flame_action', FLAME_ICON, { R: '#F44336', N: '#FF9800' }],
  ['potion_action', POTION_ICON, { R: '#F44336', W: '#FFFFFF' }],
  ['run_action', RUN_ICON, { N: '#dde1ff' }],
];

uiSprites.forEach(([name, rows, pal]) => {
  writeSprite(rows as string[], pal as Record<string, string>, path.join(uiDir, `${name}.png`));
});
console.log(`Generated ${uiSprites.length} UI sprites`);

const total = charSprites.length + enemySprites.length + tileSprites.length + itemSprites.length + uiSprites.length;
console.log(`\nTotal: ${total} sprites generated`);
