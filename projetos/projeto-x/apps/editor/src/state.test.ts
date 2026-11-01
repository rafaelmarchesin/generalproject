import { describe, expect, it } from 'vitest';
import { initialDraft, reducer } from './state.js';

describe('rascunho do editor', () => {
  it('troca a ocasião preenchendo os textos de exemplo', () => {
    const d = reducer(initialDraft(), { type: 'occasion', occasion: 'cha' });
    expect(d.config.occasion).toBe('cha');
    expect(d.config.reveal).toBe('menina');
    expect(d.config.receiver.name).toBe('Família');
  });
  it('mantém o que a pessoa já escreveu ao trocar a ocasião', () => {
    let d = reducer(initialDraft(), { type: 'patch', patch: { receiver: { name: 'Lu' } }, field: 'receiver' });
    d = reducer(d, { type: 'patch', patch: { message: 'Te amo' }, field: 'message' });
    d = reducer(d, { type: 'occasion', occasion: 'pedido' });
    expect(d.config.receiver.name).toBe('Lu');
    expect(d.config.message).toBe('Te amo');
    expect(d.config.occasion).toBe('pedido');
  });
  it('não duplica adicionais', () => {
    let d = reducer(initialDraft(), { type: 'addon', addon: 'cartucho', on: true });
    d = reducer(d, { type: 'addon', addon: 'cartucho', on: true });
    expect(d.addons).toEqual(['cartucho']);
    expect(reducer(d, { type: 'addon', addon: 'cartucho', on: false }).addons).toEqual([]);
  });
});
