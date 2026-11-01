import { demoConfig, PRESETS, type AddonId, type GiftConfig, type Occasion, type PlanId } from '@projeto-x/shared';

export interface Draft {
  config: GiftConfig;
  step: number;
  plan: PlanId;
  addons: AddonId[];
  email: string;
  /** Lacre e senha (pacote Completo). opensAt no formato do campo datetime-local. */
  delivery: { opensAt?: string; question?: string; answer?: string };
  /** Campos que a pessoa já editou: trocar a ocasião não apaga o que ela escreveu. */
  touched: string[];
}

export type Action =
  | { type: 'occasion'; occasion: Occasion }
  | { type: 'patch'; patch: Partial<GiftConfig>; field?: string }
  | { type: 'step'; step: number }
  | { type: 'plan'; plan: PlanId }
  | { type: 'addon'; addon: AddonId; on: boolean }
  | { type: 'email'; email: string }
  | { type: 'delivery'; delivery: Draft['delivery'] }
  | { type: 'reset' };

export const STEPS = ['Ocasião', 'Personagens', 'Memórias', 'Quiz', 'Mensagens', 'Visual', 'Prévia e pacote'] as const;

export function initialDraft(): Draft {
  return { config: demoConfig('namoro'), step: 0, plan: 'completo', addons: [], email: '', delivery: {}, touched: [] };
}

export function reducer(d: Draft, a: Action): Draft {
  switch (a.type) {
    case 'occasion': {
      const base = demoConfig(a.occasion);
      const keep = (f: string) => d.touched.includes(f);
      const c = d.config;
      return {
        ...d,
        config: {
          ...base,
          shell: keep('shell') ? c.shell : base.shell,
          giver: { name: keep('giver') ? c.giver.name : base.giver.name, avatar: c.giver.avatar },
          receiver: { name: keep('receiver') ? c.receiver.name : base.receiver.name, avatar: c.receiver.avatar },
          memories: [
            ...base.memories.map((m, i): GiftConfig['memories'][number] => ({
              caption: keep('memories') && c.memories[i] ? c.memories[i].caption : m.caption,
              image: c.memories[i]?.image,
            })),
            ...c.memories.slice(base.memories.length),
          ],
          quiz: keep('quiz') ? c.quiz : base.quiz,
          letters: keep('letters') ? c.letters : base.letters,
          message: keep('message') ? c.message : base.message,
          specialDate: keep('specialDate') ? c.specialDate : base.specialDate,
        },
      };
    }
    case 'patch':
      return {
        ...d,
        config: { ...d.config, ...a.patch },
        touched: a.field && !d.touched.includes(a.field) ? [...d.touched, a.field] : d.touched,
      };
    case 'step': return { ...d, step: Math.max(0, Math.min(STEPS.length - 1, a.step)) };
    case 'plan': return { ...d, plan: a.plan };
    case 'addon': return { ...d, addons: a.on ? [...new Set([...d.addons, a.addon])] : d.addons.filter((x) => x !== a.addon) };
    case 'email': return { ...d, email: a.email };
    case 'delivery': return { ...d, delivery: { ...d.delivery, ...a.delivery } };
    case 'reset': return initialDraft();
  }
}

const KEY = 'projetox:rascunho:v1';

export function loadDraft(): Draft | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const d = JSON.parse(raw) as Draft;
    return d?.config?.schemaVersion === 1 ? { ...initialDraft(), ...d } : null;
  } catch { return null; }
}

export function saveDraft(d: Draft): void {
  try { localStorage.setItem(KEY, JSON.stringify(d)); } catch { /* armazenamento indisponível: o rascunho só fica na memória */ }
}

export const labels = (o: Occasion) => PRESETS[o];
