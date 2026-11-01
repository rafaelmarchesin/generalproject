import { z } from 'zod';

export const OCCASIONS = ['namoro', 'pedido', 'natal', 'cha', 'aniversario'] as const;
export const SHELLS = ['amarelo', 'preto', 'roxo', 'rosa', 'natal'] as const;
export const PHASES = ['cobrinha', 'corrida', 'quiz', 'pescaria'] as const;
export const PLAN_IDS = ['classico', 'completo', 'inesquecivel'] as const;

export type Occasion = (typeof OCCASIONS)[number];
export type Shell = (typeof SHELLS)[number];
export type Phase = (typeof PHASES)[number];
export type PlanId = (typeof PLAN_IDS)[number];

/** Data no formato AAAA-MM-DD. */
const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use o formato AAAA-MM-DD');

/** Imagem já pixelizada: URL do Storage ou data URL PNG gerada no aparelho. */
const image = z.string().max(200_000).optional();

export const personSchema = z.object({
  name: z.string().trim().min(1, 'Informe um nome').max(14, 'Use até 14 caracteres'),
  avatar: image,
});

export const memorySchema = z.object({
  caption: z.string().trim().max(38, 'Use até 38 caracteres'),
  image,
});

export const quizSchema = z.object({
  question: z.string().trim().min(1).max(60),
  options: z.tuple([z.string().trim().min(1).max(15), z.string().trim().min(1).max(15), z.string().trim().min(1).max(15)]),
  correct: z.number().int().min(0).max(2),
});

export const giftConfigSchema = z.object({
  schemaVersion: z.literal(1),
  occasion: z.enum(OCCASIONS),
  plan: z.enum(PLAN_IDS),
  shell: z.enum(SHELLS),
  giver: personSchema,
  receiver: personSchema,
  phases: z.array(z.enum(PHASES)).min(1).max(5),
  /** Cartinhas mostradas antes de cada fase (mesma ordem de `phases`). */
  letters: z.array(z.string().trim().max(120)).max(5),
  memories: z.array(memorySchema).min(1).max(30),
  quiz: z.array(quizSchema).min(1).max(5),
  message: z.string().trim().min(1).max(280),
  specialDate: isoDate.optional(),
  reveal: z.enum(['menina', 'menino']).optional(),
});

export type GiftConfig = z.infer<typeof giftConfigSchema>;
export type Memory = z.infer<typeof memorySchema>;
export type QuizItem = z.infer<typeof quizSchema>;
