import { describe, expect, it } from 'vitest';
import { applyPlanLimits, demoConfig, formatBRL, giftConfigSchema, OCCASIONS, orderTotalCents } from './index.js';

describe('preços', () => {
  it('soma pacote e adicional', () => {
    expect(orderTotalCents('classico')).toBe(2990);
    expect(orderTotalCents('completo', ['cartucho'])).toBe(5980);
  });
  it('não cobra adicional repetido nem incluso', () => {
    expect(orderTotalCents('completo', ['cartucho', 'cartucho'])).toBe(5980);
    expect(orderTotalCents('inesquecivel', ['cartucho'])).toBe(7990);
  });
  it('formata em reais', () => {
    expect(formatBRL(4990)).toBe('R$ 49,90');
  });
});

describe('configuração do presente', () => {
  it.each(OCCASIONS)('exemplo de %s é válido', (occ) => {
    expect(giftConfigSchema.safeParse(demoConfig(occ)).success).toBe(true);
  });
  it('rejeita nome longo demais', () => {
    const c = demoConfig();
    c.receiver.name = 'Um nome comprido demais';
    expect(giftConfigSchema.safeParse(c).success).toBe(false);
  });
  it('aplica os limites do Clássico', () => {
    const c = { ...demoConfig(), shell: 'roxo' as const, memories: Array.from({ length: 10 }, (_, i) => ({ caption: `m${i}` })) };
    const r = applyPlanLimits(c, 'classico');
    expect(r.phases).toEqual(['cobrinha', 'corrida', 'quiz']);
    expect(r.memories).toHaveLength(6);
    expect(r.shell).toBe('amarelo');
  });
});
