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

function setPixel(rgba, w, x, y, r, g, b, a) {
  if (x < 0 || x >= w || y < 0) return;
  const i = (y * w + x) * 4;
  rgba[i] = r; rgba[i + 1] = g; rgba[i + 2] = b; rgba[i + 3] = a;
}

function drawCrystal(rgba, w, cx, cy, size, r, g, b, alpha) {
  for (let dy = -size; dy <= size; dy++) {
    for (let dx = -size; dx <= size; dx++) {
      const adx = Math.abs(dx), ady = Math.abs(dy);
      const dist = adx + ady;
      if (dist < size) {
        const px = cx + dx, py = cy + dy;
        if (px < 0 || px >= w || py < 0) continue;
        let pr, pg, pb;
        if (dist < size * 0.6) {
          pr = Math.min(255, r + 60);
          pg = Math.min(255, g + 60);
          pb = Math.min(255, b + 40);
        } else if (dist < size * 0.8) {
          pr = r; pg = g; pb = b;
        } else {
          pr = Math.max(0, r - 40);
          pg = Math.max(0, g - 40);
          pb = Math.max(0, b - 30);
        }
        const fade = dist > size * 0.9 ? 1 - (dist - size * 0.9) / (size * 0.1) : 1;
        setPixel(rgba, w, px, py, pr, pg, pb, Math.round(alpha * fade));
      }
    }
  }
}

function drawLine(rgba, w, x1, x2, y, r, g, b, a) {
  for (let x = x1; x <= x2; x++) setPixel(rgba, w, x, y, r, g, b, a);
}

const GOLD_R = 212, GOLD_G = 175, GOLD_B = 55;
const BRIGHT_R = 255, BRIGHT_G = 223, BRIGHT_B = 80;
const BG_R = 7, BG_G = 16, BG_B = 51;
let count = 0;

// 1. icon.png - 1024x1024 app icon
{
  const w = 1024, h = 1024;
  const rgba = Buffer.alloc(w * h * 4);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      setPixel(rgba, w, x, y, BG_R, BG_G, BG_B, 255);
    }
  }
  drawCrystal(rgba, w, w / 2, h / 2, 150, GOLD_R, GOLD_G, GOLD_B, 255);
  writePng(w, h, rgba, path.join(ROOT, 'assets', 'icon.png'));
  count++;
}

// 2. adaptive-icon.png - 1024x1024 foreground with safe zone
{
  const w = 1024, h = 1024;
  const rgba = Buffer.alloc(w * h * 4);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      setPixel(rgba, w, x, y, 0, 0, 0, 0);
    }
  }
  const cx = w / 2, cy = h / 2;
  const safeHalf = w * 0.35;
  for (let dy = -150; dy <= 150; dy++) {
    for (let dx = -150; dx <= 150; dx++) {
      const adx = Math.abs(dx), ady = Math.abs(dy);
      const dist = adx + ady;
      if (dist < 150) {
        const px = cx + dx, py = cy + dy;
        if (px < cx - safeHalf || px > cx + safeHalf || py < cy - safeHalf || py > cy + safeHalf) continue;
        let pr, pg, pb;
        if (dist < 150 * 0.6) {
          pr = BRIGHT_R; pg = BRIGHT_G; pb = BRIGHT_B;
        } else if (dist < 150 * 0.8) {
          pr = GOLD_R; pg = GOLD_G; pb = GOLD_B;
        } else {
          pr = Math.max(0, GOLD_R - 40); pg = Math.max(0, GOLD_G - 40); pb = Math.max(0, GOLD_B - 30);
        }
        const fade = dist > 150 * 0.9 ? 1 - (dist - 150 * 0.9) / (150 * 0.1) : 1;
        setPixel(rgba, w, px, py, pr, pg, pb, Math.round(255 * fade));
      }
    }
  }
  writePng(w, h, rgba, path.join(ROOT, 'assets', 'adaptive-icon.png'));
  count++;
}

// 3. splash.png - 1242x2436 splash screen
{
  const w = 1242, h = 2436;
  const rgba = Buffer.alloc(w * h * 4);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      setPixel(rgba, w, x, y, BG_R, BG_G, BG_B, 255);
    }
  }
  const lineY = Math.round(h * 0.4);
  for (let x = Math.round(w * 0.15); x < Math.round(w * 0.85); x++) {
    for (let t = 0; t < 3; t++) {
      setPixel(rgba, w, x, lineY + t, GOLD_R, GOLD_G, GOLD_B, 200);
    }
  }
  const cx = w / 2, cy = h * 0.35;
  drawCrystal(rgba, w, cx, cy, 100, GOLD_R, GOLD_G, GOLD_B, 255);
  writePng(w, h, rgba, path.join(ROOT, 'assets', 'splash.png'));
  count++;
}

console.log('Generated ' + count + ' icon files.');
