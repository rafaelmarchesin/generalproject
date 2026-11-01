/** Quebra um texto em linhas de no máximo `max` caracteres, sem cortar palavras curtas. */
export function wrap(text: string, max: number): string[] {
  const words = String(text).split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let cur = '';
  for (const w of words) {
    if (!cur) cur = w;
    else if ((cur + ' ' + w).length <= max) cur += ' ' + w;
    else { lines.push(cur); cur = w; }
    while (cur.length > max) { lines.push(cur.slice(0, max)); cur = cur.slice(max); }
  }
  if (cur) lines.push(cur);
  return lines;
}

/** Dias inteiros entre uma data AAAA-MM-DD e `now`. Retorna null se a data for inválida ou futura. */
export function daysSince(iso: string | undefined, now: Date = new Date()): number | null {
  if (!iso) return null;
  const d = new Date(iso + 'T12:00:00');
  if (Number.isNaN(d.getTime())) return null;
  const days = Math.floor((now.getTime() - d.getTime()) / 86_400_000);
  return days > 0 ? days : null;
}

/** Gerador pseudoaleatório determinístico (para testes e demonstrações reproduzíveis). */
export function rng(seed = Date.now()): () => number {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}
