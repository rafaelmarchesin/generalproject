import { useState } from 'preact/hooks';
import type { Dispatch } from 'preact/hooks';
import { OCCASIONS, PRESETS, SHELLS, type GiftConfig, type QuizItem } from '@projeto-x/shared';
import { avatarDataURL, memoryDataURL, readFile } from '../images.js';
import { PhotoCropper } from '../components/PhotoCropper.js';
import type { Action, Draft } from '../state.js';

export interface StepProps { draft: Draft; dispatch: Dispatch<Action> }

const SHELL_NAMES: Record<GiftConfig['shell'], [string, string]> = {
  amarelo: ['Amarelo clássico', '#f2c230'], preto: ['Preto 9999', '#2d2833'], roxo: ['Roxo transparente', '#7e56d6'], rosa: ['Rosa', '#f7aac6'], natal: ['Edição Natal', '#c8243b'],
};

const patch = (dispatch: Dispatch<Action>, field: string, p: Partial<GiftConfig>) => dispatch({ type: 'patch', patch: p, field });

export function OccasionStep({ draft, dispatch }: StepProps) {
  return (
    <section class="step">
      <h2>Qual é a ocasião?</h2>
      <div class="chips">
        {OCCASIONS.map((o) => (
          <button key={o} type="button" class="chip" aria-pressed={draft.config.occasion === o} onClick={() => dispatch({ type: 'occasion', occasion: o })}>{PRESETS[o].label}</button>
        ))}
      </div>
      <p class="hint">Cada ocasião vem com textos de exemplo. Você troca tudo nos próximos passos.</p>
    </section>
  );
}

function PersonField({ which, draft, dispatch }: StepProps & { which: 'giver' | 'receiver' }) {
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [error, setError] = useState('');
  const p = PRESETS[draft.config.occasion];
  const person = draft.config[which];
  const id = `nome-${which}`;
  const set = (v: Partial<typeof person>) => patch(dispatch, which, { [which]: { ...person, ...v } } as Partial<GiftConfig>);
  return (
    <div class="person">
      <div class="avatar">{person.avatar ? <img src={person.avatar} alt="" /> : <span>sem foto</span>}</div>
      <div class="stack">
        <label class="f" for={id}>{which === 'giver' ? p.giverLabel : p.receiverLabel}
          <input id={id} type="text" maxLength={14} value={person.name} onInput={(e) => set({ name: (e.target as HTMLInputElement).value })} />
        </label>
        <div class="row-actions">
          <label class="filebtn">Enviar foto do rosto
            <input type="file" accept="image/*" onChange={async (e) => {
              const f = (e.target as HTMLInputElement).files?.[0];
              if (!f) return;
              try { setError(''); setImg(await readFile(f)); } catch (err) { setError((err as Error).message); }
            }} />
          </label>
          {person.avatar && <button type="button" class="link" onClick={() => set({ avatar: undefined })}>Usar personagem de exemplo</button>}
        </div>
        {error && <p class="error">{error}</p>}
      </div>
      {img && <PhotoCropper img={img} onCancel={() => setImg(null)} onDone={(crop) => { set({ avatar: avatarDataURL(img, crop, which === 'giver' ? '#29adff' : '#ff77a8') }); setImg(null); }} />}
    </div>
  );
}

export function PeopleStep(props: StepProps) {
  return (
    <section class="step">
      <h2>Quem dá e quem recebe</h2>
      <PersonField which="giver" {...props} />
      <PersonField which="receiver" {...props} />
      <p class="hint">A foto vira pixel art aqui no seu aparelho. A original não é enviada para lugar nenhum.</p>
    </section>
  );
}

export function MemoriesStep({ draft, dispatch }: StepProps) {
  const mems = draft.config.memories;
  const set = (list: GiftConfig['memories']) => patch(dispatch, 'memories', { memories: list });
  return (
    <section class="step">
      <h2>Memórias</h2>
      <p class="hint">Cada memória aparece durante as fases, com a legenda. Até 6 no Clássico e 12 no Completo.</p>
      <div class="mems">
        {mems.map((m, i) => (
          <div class="mem" key={i}>
            <div class="mem-img">{m.image ? <img src={m.image} alt="" /> : <span>foto de exemplo</span>}</div>
            <label class="f" for={`leg-${i}`}>Legenda {i + 1}
              <input id={`leg-${i}`} type="text" maxLength={38} value={m.caption} onInput={(e) => set(mems.map((x, j) => (j === i ? { ...x, caption: (e.target as HTMLInputElement).value } : x)))} />
            </label>
            <div class="row-actions">
              <label class="filebtn">Foto
                <input type="file" accept="image/*" onChange={async (e) => {
                  const f = (e.target as HTMLInputElement).files?.[0];
                  if (!f) return;
                  const img = await readFile(f).catch(() => null);
                  if (img) set(mems.map((x, j) => (j === i ? { ...x, image: memoryDataURL(img) } : x)));
                }} />
              </label>
              {mems.length > 1 && <button type="button" class="link" onClick={() => set(mems.filter((_, j) => j !== i))}>Remover</button>}
            </div>
          </div>
        ))}
      </div>
      {mems.length < 12 && <button type="button" class="btn small" onClick={() => set([...mems, { caption: '' }])}>Adicionar memória</button>}
    </section>
  );
}

export function QuizStep({ draft, dispatch }: StepProps) {
  const quiz = draft.config.quiz;
  const set = (list: QuizItem[]) => patch(dispatch, 'quiz', { quiz: list });
  const upd = (i: number, v: Partial<QuizItem>) => set(quiz.map((q, j) => (j === i ? { ...q, ...v } : q)));
  return (
    <section class="step">
      <h2>Quiz</h2>
      <p class="hint">Marque a resposta certa. Quem errar só tenta de novo: ninguém perde.</p>
      {quiz.map((q, i) => (
        <fieldset class="q" key={i}>
          <legend>Pergunta {i + 1}</legend>
          <input type="text" aria-label={`Pergunta ${i + 1}`} maxLength={60} value={q.question} onInput={(e) => upd(i, { question: (e.target as HTMLInputElement).value })} />
          {q.options.map((o, k) => (
            <div class="opt" key={k}>
              <input type="radio" name={`certa-${i}`} aria-label={`Opção ${k + 1} é a certa`} checked={q.correct === k} onChange={() => upd(i, { correct: k })} />
              <input type="text" aria-label={`Opção ${k + 1}`} maxLength={15} value={o} onInput={(e) => {
                const options = [...q.options] as QuizItem['options'];
                options[k] = (e.target as HTMLInputElement).value;
                upd(i, { options });
              }} />
            </div>
          ))}
          {quiz.length > 1 && <button type="button" class="link" onClick={() => set(quiz.filter((_, j) => j !== i))}>Remover pergunta</button>}
        </fieldset>
      ))}
      {quiz.length < 5 && <button type="button" class="btn small" onClick={() => set([...quiz, { question: '', options: ['', '', ''], correct: 0 }])}>Adicionar pergunta</button>}
    </section>
  );
}

const PHASE_NAMES = ['Cobrinha do Amor', 'Corrida até Você', 'Quiz', 'Pescaria de Memórias'];

export function MessagesStep({ draft, dispatch }: StepProps) {
  const c = draft.config;
  const p = PRESETS[c.occasion];
  const letters = c.letters;
  return (
    <section class="step">
      <h2>Mensagens</h2>
      <p class="hint">Uma cartinha aparece antes de cada fase. A mensagem final fecha o jogo.</p>
      {PHASE_NAMES.map((name, i) => (
        <label class="f" for={`carta-${i}`} key={i}>Antes de: {name}
          <input id={`carta-${i}`} type="text" maxLength={120} value={letters[i] ?? ''} onInput={(e) => {
            const next = [...letters];
            next[i] = (e.target as HTMLInputElement).value;
            patch(dispatch, 'letters', { letters: next });
          }} />
        </label>
      ))}
      <label class="f" for="mensagem">Mensagem final
        <textarea id="mensagem" maxLength={280} value={c.message} onInput={(e) => patch(dispatch, 'message', { message: (e.target as HTMLTextAreaElement).value })} />
      </label>
      <div class="row">
        <label class="f" for="data">{p.dateLabel}
          <input id="data" type="date" value={c.specialDate ?? ''} onInput={(e) => patch(dispatch, 'specialDate', { specialDate: (e.target as HTMLInputElement).value || undefined })} />
        </label>
        {c.occasion === 'cha' && (
          <label class="f" for="revelacao">Resultado do chá
            <select id="revelacao" value={c.reveal ?? 'menina'} onChange={(e) => patch(dispatch, 'reveal', { reveal: (e.target as HTMLSelectElement).value as 'menina' | 'menino' })}>
              <option value="menina">É menina</option>
              <option value="menino">É menino</option>
            </select>
          </label>
        )}
      </div>
    </section>
  );
}

export function VisualStep({ draft, dispatch }: StepProps) {
  return (
    <section class="step">
      <h2>Cor do console</h2>
      <div class="swatches">
        {SHELLS.map((s) => (
          <button key={s} type="button" class="swatch" aria-pressed={draft.config.shell === s} onClick={() => patch(dispatch, 'shell', { shell: s })}>
            <i style={{ background: SHELL_NAMES[s][1] }} />{SHELL_NAMES[s][0]}
          </button>
        ))}
      </div>
      <p class="hint">No pacote Clássico o console é o amarelo clássico.</p>
    </section>
  );
}
