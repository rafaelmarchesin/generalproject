import { useEffect, useReducer, useState } from 'preact/hooks';
import { ConsolePreview } from './components/ConsolePreview.js';
import { initialDraft, loadDraft, reducer, saveDraft, STEPS } from './state.js';
import { MemoriesStep, MessagesStep, OccasionStep, PeopleStep, QuizStep, VisualStep } from './steps/Steps.js';
import { CheckoutStep } from './steps/Checkout.js';

export function App() {
  const [draft, dispatch] = useReducer(reducer, undefined, () => loadDraft() ?? initialDraft());
  const [full, setFull] = useState(false);
  useEffect(() => { const t = setTimeout(() => saveDraft(draft), 300); return () => clearTimeout(t); }, [draft]);
  useEffect(() => { window.scrollTo({ top: 0 }); }, [draft.step]);

  const props = { draft, dispatch };
  const step = draft.step;
  const last = step === STEPS.length - 1;

  return (
    <div class="page">
      <header class="top">
        <h1>Projeto X</h1>
        <span class="tag">Editor</span>
        <button class="link" type="button" onClick={() => { if (confirmReset()) dispatch({ type: 'reset' }); }}>Recomeçar</button>
      </header>
      <div class="layout">
        <aside class="preview">
          <ConsolePreview config={draft.config} full={full} />
          <p class="hint">{full ? 'Presente completo' : 'Prévia: a primeira fase. O resto é surpresa.'} Use os botões, as setas ou toque na tela.</p>
        </aside>
        <main class="editor">
          <nav class="progress" aria-label="Passos">
            <span>Passo {step + 1} de {STEPS.length}</span>
            <b>{STEPS[step]}</b>
            <div class="bar"><i style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} /></div>
          </nav>
          {step === 0 && <OccasionStep {...props} />}
          {step === 1 && <PeopleStep {...props} />}
          {step === 2 && <MemoriesStep {...props} />}
          {step === 3 && <QuizStep {...props} />}
          {step === 4 && <MessagesStep {...props} />}
          {step === 5 && <VisualStep {...props} />}
          {step === 6 && <CheckoutStep {...props} onPlayFull={() => setFull(true)} />}
          <div class="nav">
            {step > 0 && <button class="btn" type="button" onClick={() => dispatch({ type: 'step', step: step - 1 })}>Voltar</button>}
            {!last && <button class="btn primary" type="button" onClick={() => dispatch({ type: 'step', step: step + 1 })}>Continuar</button>}
          </div>
        </main>
      </div>
    </div>
  );
}

/** Confirmação dentro da página (diálogos do navegador nem sempre funcionam em navegadores internos). */
let armed = 0;
function confirmReset(): boolean {
  const now = Date.now();
  if (now - armed < 3000) { armed = 0; return true; }
  armed = now;
  const el = document.querySelector('.top .link');
  if (el) { el.textContent = 'Toque de novo para apagar'; setTimeout(() => { el.textContent = 'Recomeçar'; }, 3000); }
  return false;
}
