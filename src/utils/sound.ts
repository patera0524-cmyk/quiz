// Synthesized Web Audio sound effects for cute roulette feedback (no external audio dependencies)

let audioCtx: AudioContext | null = null;
let clapNoiseBuffer: AudioBuffer | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const AudioCtx =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtx) return null;
  if (!audioCtx) {
    audioCtx = new AudioCtx();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

function getClapNoiseBuffer(ctx: AudioContext): AudioBuffer {
  if (clapNoiseBuffer && clapNoiseBuffer.sampleRate === ctx.sampleRate) {
    return clapNoiseBuffer;
  }
  const length = Math.floor(ctx.sampleRate * 0.12);
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i++) {
    // Slightly shaped crisp noise for natural hand-clap snap
    data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.032));
  }
  clapNoiseBuffer = buffer;
  return buffer;
}

export function playStartSound(enabled: boolean): void {
  if (!enabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const notes = [523.25, 659.25, 783.99]; // C5 -> E5 -> G5
  notes.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now + idx * 0.055);
    gain.gain.setValueAtTime(0.001, now + idx * 0.055);
    gain.gain.exponentialRampToValueAtTime(0.14, now + idx * 0.055 + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.055 + 0.14);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now + idx * 0.055);
    osc.stop(now + idx * 0.055 + 0.15);
  });
}

export function playTickSound(enabled: boolean, speedRatio = 1): void {
  if (!enabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'triangle';
  const baseFreq = 680 + Math.min(1, Math.max(0, speedRatio)) * 260;
  osc.frequency.setValueAtTime(baseFreq, now);
  osc.frequency.exponentialRampToValueAtTime(240, now + 0.032);

  gain.gain.setValueAtTime(0.11, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.04);
}

export function playWinFanfare(enabled: boolean): void {
  if (!enabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  // Cheerful bright arpeggio: C5, E5, G5, C6, E6
  const melody = [
    { freq: 523.25, time: 0, dur: 0.18 },
    { freq: 659.25, time: 0.09, dur: 0.18 },
    { freq: 783.99, time: 0.18, dur: 0.18 },
    { freq: 1046.5, time: 0.28, dur: 0.42 },
    { freq: 1318.51, time: 0.36, dur: 0.45 },
  ];

  melody.forEach(({ freq, time, dur }) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now + time);

    gain.gain.setValueAtTime(0.001, now + time);
    gain.gain.exponentialRampToValueAtTime(0.16, now + time + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + time + dur);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now + time);
    osc.stop(now + time + dur + 0.02);
  });
}

export function playApplauseSound(enabled: boolean): void {
  if (!enabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const buffer = getClapNoiseBuffer(ctx);
  const now = ctx.currentTime + 0.22; // Begin cheering right as the fanfare crests

  // 18 overlapping warm classroom claps over ~1.5s
  const clapCount = 18;
  for (let i = 0; i < clapCount; i++) {
    const progress = i / clapCount;
    const offset = i * 0.075 + (Math.random() - 0.5) * 0.03;
    const t = now + Math.max(0, offset);

    const src = ctx.createBufferSource();
    src.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1050 + Math.random() * 900, t);
    filter.Q.setValueAtTime(1.3 + Math.random() * 0.8, t);

    const gain = ctx.createGain();
    // Swell up then gently taper out
    const envelope = Math.sin(Math.PI * (0.15 + progress * 0.85));
    const peak = 0.06 + envelope * 0.11;
    gain.gain.setValueAtTime(0.001, t);
    gain.gain.exponentialRampToValueAtTime(peak, t + 0.006);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.095);

    src.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    src.start(t);
    src.stop(t + 0.11);
  }
}
