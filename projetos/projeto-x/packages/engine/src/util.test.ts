import { describe, expect, it } from 'vitest';
import { daysSince, wrap } from './util.js';

describe('wrap', () => {
  it('quebra em linhas sem passar do limite', () => {
    const lines = wrap('OBRIGADO POR SER MEU PLAYER 2 EM TODAS AS FASES', 18);
    expect(lines.every((l) => l.length <= 18)).toBe(true);
    expect(lines.join(' ')).toBe('OBRIGADO POR SER MEU PLAYER 2 EM TODAS AS FASES');
  });
  it('corta palavras maiores que a linha', () => {
    expect(wrap('ABCDEFGHIJKLMNOPQRSTUVWXYZ', 10)).toEqual(['ABCDEFGHIJ', 'KLMNOPQRST', 'UVWXYZ']);
  });
});

describe('daysSince', () => {
  const now = new Date('2026-11-01T12:00:00');
  it('conta os dias desde a data', () => { expect(daysSince('2026-10-22', now)).toBe(10); });
  it('ignora datas futuras e inválidas', () => {
    expect(daysSince('2027-01-01', now)).toBeNull();
    expect(daysSince('2026-13-40', now)).toBeNull();
    expect(daysSince(undefined, now)).toBeNull();
  });
});
