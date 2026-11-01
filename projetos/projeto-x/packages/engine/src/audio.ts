/** Sons chiptune sintetizados no próprio aparelho (nenhum arquivo de áudio). */
export class Sfx {
  private ac: AudioContext | null = null;
  muted = false;

  /** Precisa ser chamado a partir de um toque/clique (regra dos navegadores). */
  unlock(): void {
    if (!this.ac) {
      try {
        const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        this.ac = Ctor ? new Ctor() : null;
      } catch { this.ac = null; }
    }
    if (this.ac && this.ac.state === 'suspended') void this.ac.resume().catch(() => undefined);
  }

  beep(freq: number, dur = 0.08, type: OscillatorType = 'square', vol = 0.05, when = 0): void {
    if (this.muted || !this.ac) return;
    try {
      const t0 = this.ac.currentTime + when;
      const o = this.ac.createOscillator();
      const g = this.ac.createGain();
      o.type = type;
      o.frequency.setValueAtTime(freq, t0);
      g.gain.setValueAtTime(vol, t0);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
      o.connect(g); g.connect(this.ac.destination);
      o.start(t0); o.stop(t0 + dur + 0.02);
    } catch { /* som é opcional */ }
  }

  move() { this.beep(660, 0.03, 'square', 0.02); }
  select() { this.beep(523, 0.06, 'square', 0.04); }
  coin() { this.beep(988, 0.06); this.beep(1319, 0.14, 'square', 0.05, 0.06); }
  hit() { this.beep(98, 0.18, 'sawtooth', 0.05); }
  wrong() { this.beep(330, 0.1, 'square', 0.04); this.beep(247, 0.18, 'square', 0.04, 0.1); }
  reveal() { [523, 659, 784, 1047].forEach((f, i) => this.beep(f, 0.11, 'square', 0.045, i * 0.09)); }
  win() { [523, 659, 784, 1047, 784, 1047, 1319].forEach((f, i) => this.beep(f, 0.15, 'triangle', 0.07, i * 0.13)); }
  drum(n: number) { this.beep(140 + n * 60, 0.14, 'square', 0.06); }
}
