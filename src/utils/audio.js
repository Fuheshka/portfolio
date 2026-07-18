// High-Fidelity Web Audio API Synthesizer for Frutiger Aero Sounds
let audioCtx = null;
let isSoundEnabled = true;
let masterDelayNode = null;
let delayFeedbackNode = null;

export function setSoundEnabled(enabled) {
  isSoundEnabled = enabled;
  if (!enabled && audioCtx && audioCtx.state === 'running') {
    audioCtx.suspend();
  } else if (enabled && audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// ─── Global Spacious Delay (Echo/Reverb) ────────────────────────────────────
function getDelayLine(ctx) {
  if (!masterDelayNode) {
    masterDelayNode = ctx.createDelay(2.0);
    delayFeedbackNode = ctx.createGain();

    // 0.22s delay for tighter but spacious echoes
    masterDelayNode.delayTime.setValueAtTime(0.22, ctx.currentTime);
    // 0.3 feedback gain for shorter ambient decay trail
    delayFeedbackNode.gain.setValueAtTime(0.3, ctx.currentTime);

    // Feedback loop: delay -> feedback -> delay
    masterDelayNode.connect(delayFeedbackNode);
    delayFeedbackNode.connect(masterDelayNode);

    // Send delay output to master destination
    masterDelayNode.connect(ctx.destination);
  }
  return masterDelayNode;
}

// ─── Physical Modeling Glass Chime (Bell) Synthesizer ───────────────────────
function playGlassChime({
  frequency,
  duration = 0.5,
  volume = 0.05,
  delay = 0,
  sendToDelay = true,
  overtones = [
    { ratio: 1.00, amp: 1.0,  decayMult: 1.0 },
    { ratio: 2.00, amp: 0.55, decayMult: 0.75 },
    { ratio: 2.40, amp: 0.40, decayMult: 0.6 },
    { ratio: 3.00, amp: 0.28, decayMult: 0.45 },
    { ratio: 4.00, amp: 0.18, decayMult: 0.3 },
    { ratio: 5.42, amp: 0.08, decayMult: 0.15 }
  ]
}) {
  if (!isSoundEnabled) return;

  const ctx = getAudioContext();
  const time = ctx.currentTime + delay;

  overtones.forEach((ot) => {
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(frequency * ot.ratio, time);

    // Envelope with quick attack and smooth exponential decay
    gainNode.gain.setValueAtTime(0, time);
    gainNode.gain.linearRampToValueAtTime(volume * ot.amp, time + 0.008);
    
    const decayDuration = duration * ot.decayMult;
    gainNode.gain.exponentialRampToValueAtTime(0.0001, time + decayDuration);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    if (sendToDelay) {
      const delayLine = getDelayLine(ctx);
      gainNode.connect(delayLine);
    }

    osc.start(time);
    osc.stop(time + decayDuration + 0.03);
  });
}

// ─── High-Quality Short UI Sound Effects ────────────────────────────────────

// Boot Chime: Ambient chord sweep, shortened and tightened
export function playBootSound() {
  if (!isSoundEnabled) return;
  
  // C3 to G5 major-9th sweep
  const notes = [
    { freq: 130.81, vol: 0.08, dur: 1.1, delay: 0.00 },
    { freq: 196.00, vol: 0.07, dur: 1.0, delay: 0.07 },
    { freq: 293.66, vol: 0.06, dur: 0.9, delay: 0.14 },
    { freq: 329.63, vol: 0.05, dur: 0.85, delay: 0.21 },
    { freq: 392.00, vol: 0.05, dur: 0.8, delay: 0.28 },
    { freq: 493.88, vol: 0.04, dur: 0.75, delay: 0.35 },
    { freq: 587.33, vol: 0.04, dur: 0.7, delay: 0.42 },
    { freq: 783.99, vol: 0.03, dur: 0.65, delay: 0.49 }
  ];

  notes.forEach((n) => {
    playGlassChime({
      frequency: n.freq,
      duration: n.dur,
      volume: n.vol,
      delay: n.delay,
      sendToDelay: true
    });
  });
}

// Window Open: Shorter ascending chime cascade (0.2s duration)
export function playOpenSound() {
  const notes = [329.63, 392.00, 493.88, 587.33, 783.99]; // E4, G4, B4, D5, G5
  notes.forEach((freq, idx) => {
    playGlassChime({
      frequency: freq,
      duration: 0.32 - idx * 0.04,
      volume: 0.032,
      delay: idx * 0.04,
      sendToDelay: true
    });
  });
}

// Window Close: Shorter descending chime cascade
export function playCloseSound() {
  const notes = [783.99, 587.33, 493.88, 392.00, 329.63]; // G5, D5, B4, G4, E4
  notes.forEach((freq, idx) => {
    playGlassChime({
      frequency: freq,
      duration: 0.28 - idx * 0.03,
      volume: 0.025,
      delay: idx * 0.04,
      sendToDelay: true
    });
  });
}

// Window Minimize: Quick, watery downward slide
export function playMinimizeSound() {
  if (!isSoundEnabled) return;
  const ctx = getAudioContext();
  const time = ctx.currentTime;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();

  osc.type = 'triangle';
  osc.frequency.setValueAtTime(400, time);
  osc.frequency.exponentialRampToValueAtTime(150, time + 0.14);

  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(800, time);
  filter.frequency.exponentialRampToValueAtTime(180, time + 0.14);

  gain.gain.setValueAtTime(0, time);
  gain.gain.linearRampToValueAtTime(0.05, time + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.14);

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  const delayLine = getDelayLine(ctx);
  gain.connect(delayLine);

  osc.start(time);
  osc.stop(time + 0.16);
}

// Click Sound: Shorter water drop click
export function playClickSound() {
  playGlassChime({
    frequency: 920,
    duration: 0.08,
    volume: 0.06,
    sendToDelay: false,
    overtones: [
      { ratio: 1.0, amp: 1.0, decayMult: 1.0 },
      { ratio: 1.8, amp: 0.35, decayMult: 0.45 },
      { ratio: 2.7, amp: 0.15, decayMult: 0.25 }
    ]
  });
}

// Hover Sound: Shorter, ultra-subtle tick
export function playHoverSound() {
  playGlassChime({
    frequency: 2400,
    duration: 0.03,
    volume: 0.008,
    sendToDelay: false
  });
}
