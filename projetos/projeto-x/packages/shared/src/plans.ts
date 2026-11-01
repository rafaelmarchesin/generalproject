import type { GiftConfig, Phase, PlanId, Shell } from './config.js';

export interface Plan {
  id: PlanId;
  name: string;
  /** Preço em centavos de real. */
  priceCents: number;
  phases: Phase[];
  maxPhotos: number;
  maxQuiz: number;
  allShells: boolean;
  sealedAndPassword: boolean;
  /** Disponível para venda no MVP (o Inesquecível entra em 1º/12). */
  onSale: boolean;
}

export const PLANS: Record<PlanId, Plan> = {
  classico: {
    id: 'classico', name: 'Clássico', priceCents: 2990,
    phases: ['cobrinha', 'corrida', 'quiz'], maxPhotos: 6, maxQuiz: 3,
    allShells: false, sealedAndPassword: false, onSale: true,
  },
  completo: {
    id: 'completo', name: 'Completo', priceCents: 4990,
    phases: ['cobrinha', 'corrida', 'quiz', 'pescaria'], maxPhotos: 12, maxQuiz: 5,
    allShells: true, sealedAndPassword: true, onSale: true,
  },
  inesquecivel: {
    id: 'inesquecivel', name: 'Inesquecível', priceCents: 7990,
    phases: ['cobrinha', 'corrida', 'quiz', 'pescaria'], maxPhotos: 30, maxQuiz: 5,
    allShells: true, sealedAndPassword: true, onSale: false,
  },
};

export const ADDONS = {
  cartucho: { id: 'cartucho', name: 'Cartucho para imprimir', priceCents: 990 },
} as const;

export type AddonId = keyof typeof ADDONS;

/** Console padrão do Clássico, que só tem uma cor. */
export const DEFAULT_SHELL: Shell = 'amarelo';

/** Preço total em centavos. O servidor sempre recalcula com esta função. */
export function orderTotalCents(plan: PlanId, addons: AddonId[] = []): number {
  const base = PLANS[plan].priceCents;
  const included = plan === 'inesquecivel' ? ['cartucho'] : [];
  return addons
    .filter((a, i, all) => all.indexOf(a) === i && !included.includes(a))
    .reduce((sum, a) => sum + ADDONS[a].priceCents, base);
}

export function formatBRL(cents: number): string {
  return 'R$ ' + (cents / 100).toFixed(2).replace('.', ',');
}

/** Ajusta a configuração aos limites do pacote escolhido. */
export function applyPlanLimits(config: GiftConfig, planId: PlanId): GiftConfig {
  const plan = PLANS[planId];
  return {
    ...config,
    plan: planId,
    shell: plan.allShells ? config.shell : DEFAULT_SHELL,
    phases: [...plan.phases],
    memories: config.memories.slice(0, plan.maxPhotos),
    quiz: config.quiz.slice(0, plan.maxQuiz),
  };
}
