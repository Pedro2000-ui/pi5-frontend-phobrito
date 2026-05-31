import z from 'zod';

export const gameListQuerySchema = z.object({
  player_id: z
    .number()
    .int('O ID do jogador deve ser um número inteiro')
    .positive('O ID do jogador deve ser um número inteiro positivo')
    .optional(),
  started_after: z
    .string()
    .refine((value) => !isNaN(Date.parse(value)), {
      message: 'A data deve estar no formato ISO 8601',
    })
    .optional(),
  started_before: z
    .string()
    .refine((value) => !isNaN(Date.parse(value)), {
      message: 'A data deve estar no formato ISO 8601',
    })
    .optional(),
  created_after: z
    .string()
    .refine((value) => !isNaN(Date.parse(value)), {
      message: 'A data deve estar no formato ISO 8601',
    })
    .optional(),
  created_before: z
    .string()
    .refine((value) => !isNaN(Date.parse(value)), {
      message: 'A data deve estar no formato ISO 8601',
    })
    .optional(),
  status: z.enum(
    ['WAITING_PLAYERS', 'PLAYING', 'PAUSED', 'FINISHED'],
    "O status do jogo deve ser 'WAITING_PLAYERS', 'PLAYING', 'PAUSED' ou 'FINISHED'"
  ),
  page: z
    .number()
    .int('O número da página deve ser um número inteiro')
    .positive('O número da página deve ser um número inteiro positivo')
    .default(1),
  page_size: z
    .number()
    .int('O tamanho da página deve ser um número inteiro')
    .positive('O tamanho da página deve ser um número inteiro positivo')
    .max(100, 'O tamanho da página deve ser no máximo 100')
    .default(10),
});

export const gameCreateSchema = z.object({
  player_id: z
    .number()
    .int('O ID do jogador deve ser um número inteiro')
    .positive('O ID do jogador deve ser um número inteiro positivo'),
  team_slot: z.enum(['1', '2'], 'O slot do time deve ser 1 ou 2'),
  vs_random_bot: z.boolean(),
  auto_start: z.boolean(),
});

export const gameStartSchema = z.object({
  reason: z.string(),
});

export const gameJoinSchema = z.object({
  player_id: z
    .number()
    .int('O ID do jogador deve ser um número inteiro')
    .positive('O ID do jogador deve ser um número inteiro positivo'),
  team_slot: z.enum(['1', '2'], 'O slot do time deve ser 1 ou 2'),
});

export const playerRegisterSchema = z.object({
  group_name: z.string().min(1, 'O nome do grupo é obrigatório'),
  ai_player_name: z.string().min(1, 'O nome do jogador de IA é obrigatório'),
  ai_player_avatar: z
    .url('O avatar do jogador de IA deve ser uma URL válida')
    .min(1, 'O avatar do jogador de IA é obrigatório'),
  ai_player_description: z.string().optional(),
  ai_player_move_endpoint: z
    .url('O endpoint de movimento do jogador de IA deve ser uma URL válida')
    .optional(),
});

export const playerEndpointUpdateSchema = z.object({
  ai_player_move_endpoint: z
    .url('O endpoint de movimento do jogador de IA deve ser uma URL válida')
    .optional(),
});

export const spectatorRegisterSchema = z.object({
  spectator_name: z.string().min(1, 'O nome do espectador é obrigatório'),
  spectator_avatar: z
    .url('O avatar do espectador deve ser uma URL válida')
    .optional(),
});
