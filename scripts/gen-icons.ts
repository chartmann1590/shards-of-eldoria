const { PNG } = require('pngjs');
const fs = require('fs');
const path = require('path');

function createPNG(width: number, height: number): any {
  return new PNG({ width, height });
}

function setPixel(png: any, x: number, y: number, r: number, g: number, b: number, a: number = 255): void {
  if (x < 0 || x >= png.width || y < 0 || y >= png.height) return;
  const idx = (png.width * y + x) << 2;
  png.data[idx] = r;
  png.data[idx + 1] = g;
  png.data[idx + 2] = b;
  png.data[idx + 3] = a;
}

function fillRect(
  png: any,
  x0: number, y0: number,
  w: number, h: number,
  r: number, g: number, b: number,
  a: number = 255
): void {
  for (let y = y0; y < y0 + h; y++) {
    for (let x = x0; x < x0 + w; x++) {
      setPixel(png, x, y, r, g, b, a);
    }
  }
}

function fillBackground(png: any, r: number, g: number, b: number, a: number = 255): void {
  fillRect(png, 0, 0, png.width, png.height, r, g, b, a);
}

function drawDiamond(
  png: any,
  cx: number, cy: number,
  size: number,
  r: number, g: number, b: number,
  a: number = 255
): void {
  for (let dy = -size; dy <= size; dy++) {
    const halfWidth = size - Math.abs(dy);
    for (let dx = -halfWidth; dx <= halfWidth; dx++) {
      setPixel(png, cx + dx, cy + dy, r, g, b, a);
    }
  }
}

function drawCrystal(png: any, cx: number, cy: number, size: number): void {
  const darkR = 0xd4, darkG = 0xaf, darkB = 0x37;
  const lightR = 0xf2, lightG = 0xca, lightB = 0x50;
  const hiR = 0xff, hiG = 0xe8, hiB = 0x80;

  drawDiamond(png, cx, cy, size, darkR, darkG, darkB);

  drawDiamond(png, cx, cy - Math.floor(size * 0.05), Math.floor(size * 0.7), lightR, lightG, lightB);

  for (let dy = -Math.floor(size * 0.5); dy <= 0; dy++) {
    const halfW = Math.floor(size * 0.2 * (1 + dy / (size * 0.5)));
    for (let dx = -halfW; dx <= halfW; dx++) {
      setPixel(png, cx + dx - Math.floor(size * 0.15), cy + dy, hiR, hiG, hiB);
    }
  }

  for (let dy = 0; dy <= Math.floor(size * 0.6); dy++) {
    const halfW = Math.floor(size * 0.25 * (1 - dy / (size * 0.6)));
    for (let dx = 0; dx <= halfW; dx++) {
      const shade = 0.7;
      setPixel(
        png,
        cx + dx + Math.floor(size * 0.1),
        cy + dy,
        Math.floor(lightR * shade),
        Math.floor(lightG * shade),
        Math.floor(lightB * shade)
      );
    }
  }

  for (let dx = -Math.floor(size * 0.3); dx <= Math.floor(size * 0.1); dx++) {
    setPixel(png, cx + dx, cy - Math.floor(size * 0.15), hiR, hiG, hiB);
  }

  for (let dy = -Math.floor(size * 0.2); dy <= Math.floor(size * 0.2); dy++) {
    const x = cx - Math.floor(size * 0.3) + Math.abs(dy);
    setPixel(png, x, cy + dy, darkR, darkG, darkB);
  }

  for (let dy = -Math.floor(size * 0.2); dy <= Math.floor(size * 0.2); dy++) {
    const x = cx + Math.floor(size * 0.3) - Math.abs(dy);
    setPixel(png, x, cy + dy, darkR, darkG, darkB);
  }
}

function drawText(
  png: any,
  text: string,
  startX: number, startY: number,
  scale: number,
  r: number, g: number, b: number,
  a: number = 255
): void {
  const glyphs: Record<string, number[]> = {
    'S': [0b111, 0b100, 0b110, 0b001, 0b111],
    'O': [0b111, 0b101, 0b101, 0b101, 0b111],
    'E': [0b111, 0b100, 0b110, 0b100, 0b111],
    'H': [0b101, 0b101, 0b111, 0b101, 0b101],
    'A': [0b111, 0b101, 0b111, 0b101, 0b101],
    'R': [0b110, 0b101, 0b110, 0b110, 0b101],
    'D': [0b110, 0b101, 0b101, 0b101, 0b110],
    'F': [0b111, 0b100, 0b110, 0b100, 0b100],
    'L': [0b100, 0b100, 0b100, 0b100, 0b111],
    'I': [0b111, 0b010, 0b010, 0b010, 0b111],
    'G': [0b111, 0b100, 0b101, 0b101, 0b111],
    'N': [0b101, 0b111, 0b111, 0b101, 0b101],
    ' ': [0b000, 0b000, 0b000, 0b000, 0b000],
    'T': [0b111, 0b010, 0b010, 0b010, 0b010],
    'P': [0b110, 0b101, 0b110, 0b100, 0b100],
    'C': [0b111, 0b100, 0b100, 0b100, 0b111],
  };

  let curX = startX;
  for (const ch of text) {
    const glyph = glyphs[ch.toUpperCase()];
    if (!glyph) {
      curX += 4 * scale;
      continue;
    }
    for (let row = 0; row < 5; row++) {
      const bits = glyph[row];
      for (let col = 0; col < 3; col++) {
        if (bits & (1 << (2 - col))) {
          fillRect(png, curX + col * scale, startY + row * scale, scale, scale, r, g, b, a);
        }
      }
    }
    curX += 4 * scale;
  }
}

function savePNG(png: any, filePath: string): void {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  const buffer = PNG.sync.write(png);
  fs.writeFileSync(filePath, buffer);
  console.log(`  Wrote ${filePath} (${png.width}x${png.height})`);
}

console.log('Generating icon assets...');

const assetsDir = path.resolve(__dirname, '..', 'assets');

// icon.png - 1024x1024 app icon
const icon = createPNG(1024, 1024);
fillBackground(icon, 0x07, 0x10, 0x33);

for (let y = 0; y < 1024; y++) {
  for (let x = 0; x < 1024; x++) {
    const dx = x - 512;
    const dy = y - 512;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const maxDist = Math.sqrt(512 * 512 * 2);
    const brightness = Math.max(0, 1 - dist / maxDist) * 0.15;
    if (brightness > 0.01) {
      setPixel(
        icon, x, y,
        Math.min(255, Math.floor(0x07 + brightness * 60)),
        Math.min(255, Math.floor(0x10 + brightness * 60)),
        Math.min(255, Math.floor(0x33 + brightness * 80))
      );
    }
  }
}

for (let i = 0; i < 8; i++) {
  const r = 0xd4, g = 0xaf, b = 0x37;
  const alpha = Math.floor(255 * (1 - i / 8));
  for (let x = 40 + i; x < 1024 - 40 - i; x++) {
    setPixel(icon, x, 40 + i, r, g, b, alpha);
    setPixel(icon, x, 1024 - 40 - i, r, g, b, alpha);
  }
  for (let y = 40 + i; y < 1024 - 40 - i; y++) {
    setPixel(icon, 40 + i, y, r, g, b, alpha);
    setPixel(icon, 1024 - 40 - i, y, r, g, b, alpha);
  }
}

drawCrystal(icon, 512, 420, 128);

const textScale = 12;
const soeWidth = 3 * 4 * textScale;
drawText(icon, 'SOE', Math.floor((1024 - soeWidth) / 2), 620, textScale, 0xf2, 0xca, 0x50);

savePNG(icon, path.join(assetsDir, 'icon.png'));

// adaptive-icon.png - 1024x1024 transparent foreground
const adaptive = createPNG(1024, 1024);

drawCrystal(adaptive, 512, 420, 128);

const adaptiveTextScale = 12;
const adaptiveTextWidth = 3 * 4 * adaptiveTextScale;
drawText(
  adaptive, 'SOE',
  Math.floor((1024 - adaptiveTextWidth) / 2), 620,
  adaptiveTextScale, 0xf2, 0xca, 0x50
);

savePNG(adaptive, path.join(assetsDir, 'adaptive-icon.png'));

// splash.png - 1242x2436 splash screen
const splash = createPNG(1242, 2436);
fillBackground(splash, 0x07, 0x10, 0x33);

for (let y = 0; y < 400; y++) {
  const brightness = (1 - y / 400) * 0.12;
  for (let x = 0; x < 1242; x++) {
    setPixel(
      splash, x, y,
      Math.min(255, Math.floor(0x07 + brightness * 40)),
      Math.min(255, Math.floor(0x10 + brightness * 40)),
      Math.min(255, Math.floor(0x33 + brightness * 60))
    );
  }
}

for (let x = 200; x < 1042; x++) {
  setPixel(splash, x, 850, 0xd4, 0xaf, 0x37, 80);
  setPixel(splash, x, 851, 0xd4, 0xaf, 0x37, 40);
  setPixel(splash, x, 1580, 0xd4, 0xaf, 0x37, 40);
  setPixel(splash, x, 1581, 0xd4, 0xaf, 0x37, 80);
}

drawCrystal(splash, 621, 1050, 100);

const titleScale = 16;
const titleText = 'SHARDS OF ELDORIA';
const titleWidth = titleText.length * 4 * titleScale;
drawText(
  splash, titleText,
  Math.floor((1242 - titleWidth) / 2), 1300,
  titleScale, 0xf2, 0xca, 0x50
);

const subScale = 6;
const subText = 'TAP TO BEGIN';
const subWidth = subText.length * 4 * subScale;
drawText(
  splash, subText,
  Math.floor((1242 - subWidth) / 2), 1900,
  subScale, 0xd4, 0xaf, 0x37, 180
);

savePNG(splash, path.join(assetsDir, 'splash.png'));

console.log('Done! All icon assets generated.');
