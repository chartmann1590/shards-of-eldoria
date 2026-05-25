const fs = require('fs');
const path = require('path');

const SAMPLE_RATE = 22050;
const BITS_PER_SAMPLE = 16;
const NUM_CHANNELS = 1;

function writeWav(filePath: string, samples: Float32Array): void {
  const numSamples = samples.length;
  const dataSize = numSamples * 2;
  const fileSize = 44 + dataSize;

  const buffer = Buffer.alloc(fileSize);
  let offset = 0;

  const writeString = (str: string) => {
    for (let i = 0; i < str.length; i++) {
      buffer.writeUInt8(str.charCodeAt(i), offset++);
    }
  };

  const writeUint32 = (val: number) => {
    buffer.writeUInt32LE(val, offset);
    offset += 4;
  };

  const writeUint16 = (val: number) => {
    buffer.writeUInt16LE(val, offset);
    offset += 2;
  };

  writeString('RIFF');
  writeUint32(fileSize - 8);
  writeString('WAVE');

  writeString('fmt ');
  writeUint32(16);
  writeUint16(1);
  writeUint16(NUM_CHANNELS);
  writeUint32(SAMPLE_RATE);
  writeUint32(SAMPLE_RATE * NUM_CHANNELS * (BITS_PER_SAMPLE / 8));
  writeUint16(NUM_CHANNELS * (BITS_PER_SAMPLE / 8));
  writeUint16(BITS_PER_SAMPLE);

  writeString('data');
  writeUint32(dataSize);

  for (let i = 0; i < numSamples; i++) {
    const clamped = Math.max(-1, Math.min(1, samples[i]));
    const intVal = clamped < 0 ? clamped * 0x8000 : clamped * 0x7FFF;
    buffer.writeInt16LE(Math.round(intVal), offset);
    offset += 2;
  }

  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(filePath, buffer);
  console.log(`  Wrote ${filePath} (${numSamples} samples, ${(numSamples / SAMPLE_RATE * 1000).toFixed(0)}ms)`);
}

function generateSine(durationMs: number, frequency: number, volume: number = 0.8): Float32Array {
  const numSamples = Math.floor(SAMPLE_RATE * durationMs / 1000);
  const samples = new Float32Array(numSamples);
  for (let i = 0; i < numSamples; i++) {
    const t = i / SAMPLE_RATE;
    samples[i] = Math.sin(2 * Math.PI * frequency * t) * volume;
  }
  return samples;
}

function generateSineWithDecay(durationMs: number, frequency: number, volume: number = 0.8): Float32Array {
  const numSamples = Math.floor(SAMPLE_RATE * durationMs / 1000);
  const samples = new Float32Array(numSamples);
  for (let i = 0; i < numSamples; i++) {
    const t = i / SAMPLE_RATE;
    const decay = 1 - (i / numSamples);
    samples[i] = Math.sin(2 * Math.PI * frequency * t) * volume * decay;
  }
  return samples;
}

function generateWhiteNoise(durationMs: number, volume: number = 0.8): Float32Array {
  const numSamples = Math.floor(SAMPLE_RATE * durationMs / 1000);
  const samples = new Float32Array(numSamples);
  for (let i = 0; i < numSamples; i++) {
    const decay = Math.pow(1 - (i / numSamples), 2);
    samples[i] = (Math.random() * 2 - 1) * volume * decay;
  }
  return samples;
}

function generateSweep(durationMs: number, startFreq: number, endFreq: number, volume: number = 0.8): Float32Array {
  const numSamples = Math.floor(SAMPLE_RATE * durationMs / 1000);
  const samples = new Float32Array(numSamples);
  let phase = 0;
  for (let i = 0; i < numSamples; i++) {
    const progress = i / numSamples;
    const freq = startFreq + (endFreq - startFreq) * progress;
    phase += (2 * Math.PI * freq) / SAMPLE_RATE;
    samples[i] = Math.sin(phase) * volume;
  }
  return samples;
}

function generateArpeggio(notes: number[], noteDurationMs: number, volume: number = 0.8): Float32Array {
  const samplesPerNote = Math.floor(SAMPLE_RATE * noteDurationMs / 1000);
  const totalSamples = samplesPerNote * notes.length;
  const samples = new Float32Array(totalSamples);
  let offset = 0;
  for (const freq of notes) {
    let phase = 0;
    for (let i = 0; i < samplesPerNote; i++) {
      const envelope = i < samplesPerNote * 0.1
        ? i / (samplesPerNote * 0.1)
        : 1 - ((i - samplesPerNote * 0.1) / (samplesPerNote * 0.9));
      phase += (2 * Math.PI * freq) / SAMPLE_RATE;
      samples[offset + i] = Math.sin(phase) * volume * Math.max(0, envelope);
    }
    offset += samplesPerNote;
  }
  return samples;
}

function generateAlternatingTones(
  durationMs: number,
  freq1: number,
  freq2: number,
  switchRateHz: number,
  volume: number = 0.8
): Float32Array {
  const numSamples = Math.floor(SAMPLE_RATE * durationMs / 1000);
  const samples = new Float32Array(numSamples);
  const switchPeriod = SAMPLE_RATE / switchRateHz;
  let phase = 0;
  for (let i = 0; i < numSamples; i++) {
    const halfIndex = Math.floor(i / (switchPeriod / 2));
    const freq = halfIndex % 2 === 0 ? freq1 : freq2;
    phase += (2 * Math.PI * freq) / SAMPLE_RATE;
    const envelope = 1 - (i / numSamples) * 0.3;
    samples[i] = Math.sin(phase) * volume * envelope;
  }
  return samples;
}

function generateShimmer(
  durationMs: number,
  baseFreq: number,
  modDepth: number,
  modRate: number,
  volume: number = 0.8
): Float32Array {
  const numSamples = Math.floor(SAMPLE_RATE * durationMs / 1000);
  const samples = new Float32Array(numSamples);
  let phase = 0;
  for (let i = 0; i < numSamples; i++) {
    const t = i / SAMPLE_RATE;
    const mod = Math.sin(2 * Math.PI * modRate * t) * modDepth;
    const freq = baseFreq + mod;
    phase += (2 * Math.PI * freq) / SAMPLE_RATE;
    const envelope = Math.min(1, i / (numSamples * 0.05)) * (1 - Math.pow(i / numSamples, 2));
    samples[i] = Math.sin(phase) * volume * envelope;
    samples[i] += Math.sin(phase * 2) * volume * 0.3 * envelope;
    samples[i] += Math.sin(phase * 3) * volume * 0.15 * envelope;
  }
  return samples;
}

function concatSamples(...arrays: Float32Array[]): Float32Array {
  const totalLength = arrays.reduce((sum, a) => sum + a.length, 0);
  const result = new Float32Array(totalLength);
  let off = 0;
  for (const arr of arrays) {
    result.set(arr, off);
    off += arr.length;
  }
  return result;
}

const C4 = 261.63;
const E4 = 329.63;
const G4 = 392.00;
const C5 = 523.25;
const E5 = 659.25;
const G5 = 783.99;

console.log('Generating audio assets...');

const outDir = path.resolve(__dirname, '..', 'assets', 'audio');

writeWav(path.join(outDir, 'menu_nav.wav'), generateSine(100, 800, 0.6));

writeWav(
  path.join(outDir, 'menu_select.wav'),
  concatSamples(generateSine(100, 600, 0.6), generateSine(100, 900, 0.6))
);

writeWav(path.join(outDir, 'hit.wav'), generateWhiteNoise(150, 0.9));

writeWav(path.join(outDir, 'heal.wav'), generateSweep(200, 400, 800, 0.7));

writeWav(path.join(outDir, 'victory.wav'), generateArpeggio([C4, E4, G4, C5], 100, 0.8));

writeWav(path.join(outDir, 'level_up.wav'), generateArpeggio([C4, E4, G4, C5, E5, G5], 50, 0.8));

writeWav(path.join(outDir, 'damage.wav'), generateSweep(150, 600, 200, 0.8));

writeWav(path.join(outDir, 'step.wav'), generateSineWithDecay(50, 1000, 0.3));

writeWav(path.join(outDir, 'encounter.wav'), generateAlternatingTones(200, 440, 880, 10, 0.7));

writeWav(path.join(outDir, 'magic.wav'), generateShimmer(300, 500, 200, 6, 0.7));

console.log('Done! All audio assets generated.');
