import type { GiftConfig, Occasion, QuizItem } from './config.js';

export interface OccasionPreset {
  label: string;
  /** Texto curto da abertura do jogo, em maiúsculas. */
  title: string;
  giverLabel: string;
  receiverLabel: string;
  dateLabel: string;
  giver: string;
  receiver: string;
  message: string;
  memories: string[];
  quiz: QuizItem[];
  letters: string[];
  suggestedShell: GiftConfig['shell'];
}

const q = (question: string, options: [string, string, string], correct: number): QuizItem => ({ question, options, correct });

const casalQuiz = [
  q('Onde foi nosso primeiro encontro?', ['Na praia', 'No cinema', 'Num café'], 2),
  q('Qual é a nossa música?', ['Evidências', 'Velha Infância', 'Trem-Bala'], 1),
  q('Quem disse "eu te amo" primeiro?', ['Eu', 'Você', 'Os dois juntos'], 1),
];
const casalMemorias = ['Nosso 1º pôr do sol', 'O café onde tudo começou', 'Cinema (a gente dormiu)'];

export const PRESETS: Record<Occasion, OccasionPreset> = {
  namoro: {
    label: 'Namoro', title: 'NOSSA HISTÓRIA',
    giverLabel: 'Seu nome', receiverLabel: 'Nome do seu amor', dateLabel: 'Data em que começou',
    giver: 'Rafa', receiver: 'Ana',
    message: 'Obrigado por ser meu player 2 em todas as fases. Te amo!',
    memories: casalMemorias, quiz: casalQuiz,
    letters: ['Lembra de como tudo começou?', 'Nada nos separa, nem a distância.', 'Vamos ver quanto você lembra de nós.', 'Cada lembrança é um tesouro.'],
    suggestedShell: 'amarelo',
  },
  pedido: {
    label: 'Pedido de casamento', title: 'UMA PERGUNTA',
    giverLabel: 'Seu nome', receiverLabel: 'Nome do seu amor', dateLabel: 'Data em que começou',
    giver: 'Rafa', receiver: 'Ana',
    message: 'Cada fase com você foi a melhor. Agora falta a mais importante.',
    memories: casalMemorias,
    quiz: [casalQuiz[0]!, casalQuiz[1]!, q('Qual é o nosso próximo nível?', ['Viajar', 'Adotar um gato', 'Casar!'], 2)],
    letters: ['Lembra de como tudo começou?', 'Corri muito até chegar em você.', 'Responda com o coração.', 'Falta só uma fase.'],
    suggestedShell: 'rosa',
  },
  natal: {
    label: 'Natal', title: 'FELIZ NATAL',
    giverLabel: 'Seu nome', receiverLabel: 'Para quem', dateLabel: 'Data em que começou',
    giver: 'Rafa', receiver: 'Ana',
    message: 'Que o próximo ano tenha ainda mais fases juntos. Feliz Natal!',
    memories: casalMemorias,
    quiz: [casalQuiz[0]!, casalQuiz[1]!, q('O que não pode faltar na ceia?', ['Rabanada', 'Uva-passa', 'Pavê'], 0)],
    letters: ['Um presente diferente este ano.', 'Corra até a ceia!', 'Hora do quiz natalino.', 'Mais lembranças embaixo da árvore.'],
    suggestedShell: 'natal',
  },
  cha: {
    label: 'Chá revelação', title: 'CHÁ REVELAÇÃO',
    giverLabel: 'Quem prepara o chá', receiverLabel: 'Para quem é o jogo', dateLabel: 'Previsão do nascimento',
    giver: 'Júlia e Léo', receiver: 'Família',
    message: 'Mal podemos esperar para conhecer você!',
    memories: ['O primeiro ultrassom', 'O sapatinho chegou', 'O quartinho pronto'],
    quiz: [
      q('Em que mês o bebê chega?', ['Março', 'Abril', 'Maio'], 1),
      q('Quem vai trocar mais fraldas?', ['A mamãe', 'O papai', 'A vovó'], 1),
      q('Qual será o 1º apelido?', ['Pipoca', 'Feijão', 'Tico'], 1),
    ],
    letters: ['Uma novidade está chegando.', 'Desvie do sono e das fraldas!', 'Quem conhece mais a família?', 'Quase lá...'],
    suggestedShell: 'roxo',
  },
  aniversario: {
    label: 'Aniversário', title: 'FELIZ ANIVERSÁRIO',
    giverLabel: 'Quem dá', receiverLabel: 'Aniversariante', dateLabel: 'Data do aniversário',
    giver: 'Turma da facul', receiver: 'Bia',
    message: 'Mais um nível desbloqueado! Feliz aniversário, a gente te ama!',
    memories: ['A viagem de 2024', 'A festa surpresa', 'Aquele karaokê'],
    quiz: [
      q('Qual é o doce favorito da Bia?', ['Brigadeiro', 'Pudim', 'Pavê'], 0),
      q('Onde a Bia quer morar?', ['Lisboa', 'Floripa', 'Tóquio'], 2),
      q('Qual a mania da Bia?', ['Cantar alto', 'Dormir cedo', 'Atrasar'], 2),
    ],
    letters: ['Mais um ano de aventuras!', 'Corra até a festa!', 'Quem conhece a aniversariante?', 'Pesque as lembranças.'],
    suggestedShell: 'amarelo',
  },
};

/** Configuração de exemplo, usada no editor (ponto de partida) e nas demonstrações. */
export function demoConfig(occasion: Occasion = 'namoro'): GiftConfig {
  const p = PRESETS[occasion];
  return {
    schemaVersion: 1,
    occasion,
    plan: 'completo',
    shell: p.suggestedShell,
    giver: { name: p.giver },
    receiver: { name: p.receiver },
    phases: ['cobrinha', 'corrida', 'quiz', 'pescaria'],
    letters: [...p.letters],
    memories: p.memories.map((caption) => ({ caption })),
    quiz: p.quiz.map((i) => ({ ...i, options: [...i.options] as [string, string, string] })),
    message: p.message,
    specialDate: occasion === 'cha' ? '2027-04-20' : occasion === 'aniversario' ? '2026-11-20' : '2023-02-14',
    ...(occasion === 'cha' ? { reveal: 'menina' as const } : {}),
  };
}
