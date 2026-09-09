// WhatsApp-like synthesized notification sounds using Web Audio API

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Play authentic WhatsApp "Pop" incoming message chime
 */
export function playIncomingSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    
    // Primary chime
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(880, now); // A5
    osc1.frequency.exponentialRampToValueAtTime(1760, now + 0.08); // A6

    gain1.gain.setValueAtTime(0, now);
    gain1.gain.linearRampToValueAtTime(0.2, now + 0.02);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

    osc1.connect(gain1);
    gain1.connect(ctx.destination);

    osc1.start(now);
    osc1.stop(now + 0.25);

    // Second subtle harmonic bell
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(1318.5, now + 0.05); // E6
    osc2.frequency.exponentialRampToValueAtTime(2093, now + 0.12); // C7

    gain2.gain.setValueAtTime(0, now + 0.05);
    gain2.gain.linearRampToValueAtTime(0.12, now + 0.07);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

    osc2.connect(gain2);
    gain2.connect(ctx.destination);

    osc2.start(now + 0.05);
    osc2.stop(now + 0.3);
  } catch {
    // AudioContext might be blocked until first user interaction
  }
}

/**
 * Play subtle outgoing message "Swoosh / Tick"
 */
export function playOutgoingSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(520, now);
    osc.frequency.exponentialRampToValueAtTime(840, now + 0.06);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.09);
  } catch {
    // Ignore error
  }
}

/**
 * Play authentic green "ACCESS AUTHORIZED" high-contrast confirmation chime
 */
export function playAccessAuthorizedSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // Harmonic chord: D5 (587Hz) -> A5 (880Hz) -> D6 (1174Hz)
    const freqs = [587.33, 880, 1174.66];
    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      gain.gain.setValueAtTime(0, now + idx * 0.08);
      gain.gain.linearRampToValueAtTime(0.18, now + idx * 0.08 + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.45);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.48);
    });
  } catch {
    // Ignore
  }
}

/**
 * Play authentic industrial warning buzzer sound for flagged/hoarding alert
 */
export function playAlertSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // Double burst warning buzzer
    [0, 0.2].forEach((delay) => {
      // Primary low buzz
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(185, now + delay);
      osc1.frequency.linearRampToValueAtTime(160, now + delay + 0.15);

      gain1.gain.setValueAtTime(0.25, now + delay);
      gain1.gain.linearRampToValueAtTime(0.01, now + delay + 0.16);

      osc1.connect(gain1);
      gain1.connect(ctx.destination);

      osc1.start(now + delay);
      osc1.stop(now + delay + 0.17);

      // Harsh dissonant harmonic
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'square';
      osc2.frequency.setValueAtTime(277.18, now + delay); // C#4

      gain2.gain.setValueAtTime(0.12, now + delay);
      gain2.gain.linearRampToValueAtTime(0.01, now + delay + 0.14);

      osc2.connect(gain2);
      gain2.connect(ctx.destination);

      osc2.start(now + delay);
      osc2.stop(now + delay + 0.15);
    });
  } catch {
    // Ignore
  }
}

