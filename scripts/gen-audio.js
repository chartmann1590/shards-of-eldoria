'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');

function writeWav(filename, samples, sampleRate) {
  const numSamples = samples.length;
  const dataSize = numSamples * 2;
  const bufferSize = 44 + dataSize;
  const buf = Buffer.alloc(bufferSize);
  let off = 0;
  buf.write('RIFF', off); off += 4;
  buf.writeUInt32LE(bufferSize - 8, off); off += 4;
  buf.write('WAVE', off); off += 4;
  buf.write('fmt ', off); off += 4;
  buf.writeUInt32LE(16, off); off += 4;
  buf.writeUInt16LE(1, off); off += 2;
  buf.writeUInt16LE(1, off); off += 2;
  buf.writeUInt32LE(sampleRate, off); off += 4;
  buf.writeUInt32LE(sampleRate * 2, off); off += 4;
  buf.writeUInt16LE(2, off); off += 2;
  buf.writeUInt16LE(16, off); off += 2;
  buf.write('data', off); off += 4;
  buf.writeUInt32LE(dataSize, off); off += 4;
  for (let i = 0; i < numSamples; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    buf.writeInt16LE(Math.round(s * 32767), off);
    off += 2;
  }
  const outPath = path.join(ROOT, 'assets', 'audio', filename);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, buf);
}

function sine(freq, t) {
  return Math.sin(2 * Math.PI * freq * t);
}

function noise() {
  return Math.random() * 2 - 1;
}

function genSamples(durationSec, fn) {
  const sr = 22050;
  const num = Math.round(sr * durationSec);
  const samples = new Float64Array(num);
  for (let i = 0; i < num; i++) {
    samples[i] = fn(i / sr, i, num);
  }
  return samples;
}

function envelope(t, dur, attack, decay) {
  if (t < attack) return t / attack;
  if (t > dur - decay) return (dur - t) / decay;
  return 1;
}

const SAMPLE_RATE = 22050;
let count = 0;

writeWav('menu_nav.wav', genSamples(0.1, (t) => {
  return sine(800, t) * envelope(t, 0.1, 0.005, 0.02) * 0.5;
}), SAMPLE_RATE);
count++;

writeWav('menu_select.wav', genSamples(0.2, (t, i, num) => {
  const half = num / 2;
  const freq = i < half ? 600 : 900;
  const localT = i < half ? t : t - 0.1;
  const segFrac = i < half ? i / half : (i - half) / half;
  const env = segFrac < 0.05 ? segFrac / 0.05 : segFrac > 0.9 ? (1 - segFrac) / 0.1 : 1;
  return sine(freq, localT) * env * 0.5;
}), SAMPLE_RATE);
count++;

writeWav('hit.wav', genSamples(0.15, (t) => {
  return noise() * Math.exp(-t * 30) * 0.7;
}), SAMPLE_RATE);
count++;

writeWav('heal.wav', genSamples(0.2, (t) => {
  const phase = 2 * Math.PI * (400 * t + 200 * (t * t / 0.2));
  return Math.sin(phase) * envelope(t, 0.2, 0.01, 0.03) * 0.5;
}), SAMPLE_RATE);
count++;

const C5 = 523.25, E5 = 659.25, G5 = 783.99, C6 = 1046.50;
writeWav('victory.wav', genSamples(0.4, (t) => {
  const noteIdx = Math.min(3, Math.floor(t / 0.1));
  const freqs = [C5, E5, G5, C6];
  const localT = t - noteIdx * 0.1;
  const env = envelope(localT, 0.1, 0.005, 0.02);
  return sine(freqs[noteIdx], t) * env * 0.5;
}), SAMPLE_RATE);
count++;

writeWav('level_up.wav', genSamples(0.3, (t) => {
  const phase = 2 * Math.PI * (400 * t + 300 * (t * t / 0.3));
  return Math.sin(phase) * envelope(t, 0.3, 0.01, 0.05) * 0.5;
}), SAMPLE_RATE);
count++;

writeWav('damage.wav', genSamples(0.15, (t) => {
  const phase = 2 * Math.PI * (600 * t - 400 * (t * t / 0.15) / 2);
  return Math.sin(phase) * envelope(t, 0.15, 0.003, 0.04) * 0.6;
}), SAMPLE_RATE);
count++;

writeWav('step.wav', genSamples(0.05, (t) => {
  return sine(1000, t) * Math.exp(-t * 80) * 0.2;
}), SAMPLE_RATE);
count++;

writeWav('encounter.wav', genSamples(0.2, (t, i, num) => {
  const half = num / 2;
  const freq = i < half ? 400 : 800;
  const localT = i < half ? t : t - 0.1;
  const segFrac = i < half ? i / half : (i - half) / half;
  const env = segFrac < 0.05 ? segFrac / 0.05 : segFrac > 0.9 ? (1 - segFrac) / 0.1 : 1;
  return sine(freq, localT) * env * 0.5;
}), SAMPLE_RATE);
count++;

writeWav('magic.wav', genSamples(0.3, (t) => {
  const carrierFreq = 600;
  const modFreq = 200;
  const modDepth = 300 * (1 - t / 0.3);
  const modulator = modDepth * sine(modFreq, t);
  const env = envelope(t, 0.3, 0.01, 0.05);
  return sine(carrierFreq, t + modulator / (2 * Math.PI)) * env * 0.5;
}), SAMPLE_RATE);
count++;

console.log('Generated ' + count + ' audio files.');
