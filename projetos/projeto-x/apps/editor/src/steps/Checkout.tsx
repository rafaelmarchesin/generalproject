import { useEffect, useState } from 'preact/hooks';
import { ADDONS, applyPlanLimits, formatBRL, giftConfigSchema, orderTotalCents, PLANS, type PlanId } from '@projeto-x/shared';
import { createOrder, orderStatus, type DeliveryInput, type PixCharge } from '../api.js';
import type { StepProps } from './Steps.js';

const FIELD_NAMES: Record<string, string> = {
  giver: 'nome de quem dá', receiver: 'nome de quem recebe', memories: 'memórias', quiz: 'quiz', message: 'mensagem final', letters: 'cartinhas', specialDate: 'data',
};

export function CheckoutStep({ draft, dispatch, onPlayFull }: StepProps & { onPlayFull: () => void }) {
  const [charge, setCharge] = useState<PixCharge | null>(null);
  const [paid, setPaid] = useState<{ giftUrl?: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const final = applyPlanLimits(draft.config, draft.plan);
  const check = giftConfigSchema.safeParse(final);
  const problems = check.success ? [] : [...new Set(check.error.issues.map((i) => FIELD_NAMES[String(i.path[0])] ?? String(i.path[0])))];
  const total = orderTotalCents(draft.plan, draft.addons);
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email);
  const extraPhotos = draft.config.memories.length - PLANS[draft.plan].maxPhotos;
  const canSeal = PLANS[draft.plan].sealedAndPassword;
  const dl = draft.delivery;
  const delivery: DeliveryInput = !canSeal ? {} : {
    ...(dl.opensAt ? { opensAt: new Date(dl.opensAt).toISOString() } : {}),
    ...(dl.question?.trim() && dl.answer?.trim() ? { password: { question: dl.question.trim(), answer: dl.answer.trim() } } : {}),
  };
  const sealInPast = !!dl.opensAt && canSeal && new Date(dl.opensAt).getTime() < Date.now();

  useEffect(() => {
    if (!charge || charge.demo || paid) return;
    const id = setInterval(async () => {
      try { const s = await orderStatus(charge.orderId); if (s.status === 'paid') setPaid({ giftUrl: s.giftUrl }); } catch { /* tenta de novo */ }
    }, 3000);
    return () => clearInterval(id);
  }, [charge, paid]);

  const pay = async () => {
    setBusy(true); setError('');
    try { setCharge(await createOrder({ config: final, plan: draft.plan, addons: draft.addons, email: draft.email, delivery })); }
    catch (e) { setError((e as Error).message); }
    finally { setBusy(false); }
  };

  const copy = async () => {
    if (!charge) return;
    try { await navigator.clipboard.writeText(charge.pix.copiaECola); setCopied(true); } catch { setCopied(false); }
  };

  if (paid) {
    return (
      <section class="step">
        <h2>Presente pronto!</h2>
        {paid.giftUrl ? (
          <>
            <p>Mande o link no WhatsApp. Antes, se quiser, jogue pelo link de teste: ele não avisa a outra pessoa.</p>
            <p class="code">{paid.giftUrl}</p>
            <a class="btn primary" href={`https://wa.me/?text=${encodeURIComponent('Fiz um presente para você: ' + paid.giftUrl)}`} target="_blank" rel="noopener">Enviar pelo WhatsApp</a>
          </>
        ) : (
          <p class="demo-note">Demonstração: com o pagamento real, aqui aparecem o link secreto, o QR code e o botão do WhatsApp.</p>
        )}
        {paid.giftUrl
          ? <a class="btn" href={`${paid.giftUrl}?teste=1`} target="_blank" rel="noopener">Testar o presente</a>
          : <button class="btn" type="button" onClick={onPlayFull}>Jogar o presente completo</button>}
      </section>
    );
  }

  if (charge) {
    return (
      <section class="step">
        <h2>Pague com Pix</h2>
        {charge.demo && <p class="demo-note">Demonstração: o servidor de pagamentos ainda não está no ar. Nenhuma cobrança foi feita.</p>}
        {charge.pix.qrCodeBase64 && <img class="qr" alt="QR code do Pix" src={`data:image/png;base64,${charge.pix.qrCodeBase64}`} />}
        <p class="hint">Neste celular, copie o código e cole no app do seu banco, em Pix copia e cola.</p>
        <p class="code">{charge.pix.copiaECola}</p>
        <div class="actions">
          <button class="btn primary" type="button" onClick={copy}>{copied ? 'Código copiado' : 'Copiar código Pix'}</button>
          {charge.demo
            ? <button class="btn" type="button" onClick={() => setPaid({})}>Simular pagamento aprovado</button>
            : <button class="btn" type="button" onClick={async () => { const s = await orderStatus(charge.orderId).catch(() => null); if (s?.status === 'paid') setPaid({ giftUrl: s.giftUrl }); }}>Já paguei</button>}
        </div>
        <p class="hint">O código vale 30 minutos. A confirmação chega sozinha em segundos.</p>
      </section>
    );
  }

  return (
    <section class="step">
      <h2>Escolha o pacote</h2>
      <div class="plans">
        {(Object.keys(PLANS) as PlanId[]).map((id) => {
          const p = PLANS[id];
          return (
            <label key={id} class={`plan${p.onSale ? '' : ' off'}`}>
              <input type="radio" name="pacote" checked={draft.plan === id} disabled={!p.onSale} onChange={() => dispatch({ type: 'plan', plan: id })} />
              <span>
                <b>{p.name}</b>
                <small>{p.phases.length} fases + final · até {p.maxPhotos} fotos{p.allShells ? ' · todas as cores' : ''}{p.sealedAndPassword ? ' · lacre e senha' : ''}{p.onSale ? '' : ' · chega em 1º/12'}</small>
              </span>
              <span class="price">{formatBRL(p.priceCents)}</span>
            </label>
          );
        })}
      </div>
      {extraPhotos > 0 && <p class="hint">Este pacote mostra {PLANS[draft.plan].maxPhotos} fotos; as últimas {extraPhotos} ficam de fora.</p>}
      <label class="addon">
        <input type="checkbox" checked={draft.addons.includes('cartucho')} onChange={(e) => dispatch({ type: 'addon', addon: 'cartucho', on: (e.target as HTMLInputElement).checked })} />
        <span>{ADDONS.cartucho.name}</span><span>{formatBRL(ADDONS.cartucho.priceCents)}</span>
      </label>
      {canSeal && (
        <details class="q">
          <summary><b>Lacre e senha</b> (opcional)</summary>
          <label class="f" for="abre">Abrir só a partir de
            <input id="abre" type="datetime-local" value={dl.opensAt ?? ''} onInput={(e) => dispatch({ type: 'delivery', delivery: { opensAt: (e.target as HTMLInputElement).value || undefined } })} />
          </label>
          {sealInPast && <p class="error">Essa data já passou. Escolha uma data futura ou deixe em branco.</p>}
          <label class="f" for="pergunta">Pergunta-senha (ex.: nome do nosso cachorro?)
            <input id="pergunta" type="text" maxLength={60} value={dl.question ?? ''} onInput={(e) => dispatch({ type: 'delivery', delivery: { question: (e.target as HTMLInputElement).value } })} />
          </label>
          <label class="f" for="resposta">Resposta (maiúsculas e acentos não importam)
            <input id="resposta" type="text" maxLength={40} value={dl.answer ?? ''} onInput={(e) => dispatch({ type: 'delivery', delivery: { answer: (e.target as HTMLInputElement).value } })} />
          </label>
        </details>
      )}
      <label class="f" for="email">Seu e-mail (para receber o link e a nota)
        <input id="email" type="email" autoComplete="email" value={draft.email} onInput={(e) => dispatch({ type: 'email', email: (e.target as HTMLInputElement).value })} />
      </label>
      <div class="total"><span>Total · pagamento único</span><span>{formatBRL(total)}</span></div>
      {problems.length > 0 && <p class="error">Confira: {problems.join(', ')}.</p>}
      {error && <p class="error">{error}</p>}
      <button class="btn primary big" type="button" disabled={busy || !check.success || !emailOk || sealInPast} onClick={pay}>{busy ? 'Gerando o Pix…' : 'Pagar com Pix'}</button>
      <p class="hint">Reembolso integral em até 7 dias. Ao pagar, você declara ter autorização das pessoas que aparecem nas fotos.</p>
    </section>
  );
}
