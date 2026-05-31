import { Controller, useForm } from 'react-hook-form';
import { registerPlayer } from '../api';
import { cn } from '@core/helpers';
import { useGameContext } from '../context/game-context';
import { useEffect } from 'react';

export function PlayerRegisterForm() {
  const { player, setPlayer } = useGameContext();

  const form = useForm({
    defaultValues: {
      ai_player_name: player?.ai_player_name || 'Meu Jogador',
      ai_player_avatar:
        player?.ai_player_avatar || 'https://example.com/avatar.png',
      group_name: player?.group_name || 'Meu Grupo',
      ai_player_description:
        player?.ai_player_description || 'Descrição do meu jogador de IA',
      ai_player_move_endpoint:
        player?.ai_player_move_endpoint || 'https://example.com/move-endpoint',
    },
  });
  const { formState } = form;
  const { isSubmitting, errors } = formState;

  async function handleSubmit(dto) {
    try {
      const response = await registerPlayer({
        ...dto,
      });

      if (!response?.player_access_token) {
        throw new Error('[ERR]: resposta inesperada ao registrar jogador');
      }

      setPlayer(response);

      form?.reset({
        ai_player_name: response?.ai_player_avatar,
        ai_player_avatar: response?.ai_player_avatar,
        group_name: response?.group_name,
        ai_player_description: response?.ai_player_description,
        ai_player_move_endpoint: response?.ai_player_move_endpoint,
      });
    } catch (err) {
      console.error(err?.message || '[ERR]: erro ao registrar jogador', err);
    }
  }

  useEffect(() => {
    if (player?.id) {
      form.reset({
        ai_player_name: player?.ai_player_name || 'Meu Jogador',
        ai_player_avatar:
          player?.ai_player_avatar || 'https://example.com/avatar.png',
        group_name: player?.group_name || 'Meu Grupo',
        ai_player_description:
          player?.ai_player_description || 'Descrição do meu jogador de IA',
        ai_player_move_endpoint:
          player?.ai_player_move_endpoint ||
          'https://example.com/move-endpoint',
      });
    }
  }, [player]);

  return (
    <form
      onSubmit={form.handleSubmit(handleSubmit)}
      className={cn('flex flex-col gap-2')}
    >
      <Controller
        name={'group_name'}
        control={form.control}
        rules={{ required: 'O nome do grupo é obrigatório' }}
        render={({ field }) => (
          <div className={cn('flex flex-col gap-1')}>
            <label className="text-xs">Nome do grupo</label>
            <input
              className={cn('border rounded-sm px-4 py-2')}
              type={'text'}
              {...field}
            />
            {errors.group_name && (
              <span className={cn('text-red-500 text-xs')}>
                {errors.group_name.message}
              </span>
            )}
          </div>
        )}
      />

      <Controller
        name={'ai_player_name'}
        control={form.control}
        rules={{ required: 'O nome do jogador de IA é obrigatório' }}
        render={({ field }) => (
          <div className={cn('flex flex-col gap-1')}>
            <label className="text-xs">Nome do jogador</label>
            <input
              className={cn('border rounded-sm px-4 py-2')}
              type={'text'}
              {...field}
            />
            {errors.ai_player_name && (
              <span className={cn('text-red-500 text-xs')}>
                {errors.ai_player_name.message}
              </span>
            )}
          </div>
        )}
      />

      <Controller
        name={'ai_player_avatar'}
        control={form.control}
        rules={{ required: 'A URL do avatar do jogador de IA é obrigatória' }}
        render={({ field }) => (
          <div className={cn('flex flex-col gap-1')}>
            <label className="text-xs">URL do avatar</label>
            <input
              className={cn('border rounded-sm px-4 py-2')}
              type={'text'}
              {...field}
            />
            {errors.ai_player_avatar && (
              <span className={cn('text-red-500 text-xs')}>
                {errors.ai_player_avatar.message}
              </span>
            )}
          </div>
        )}
      />

      <Controller
        name={'ai_player_description'}
        control={form.control}
        render={({ field }) => (
          <div className={cn('flex flex-col gap-1')}>
            <label className="text-xs">Descrição do jogador</label>
            <input
              className={cn('border rounded-sm px-4 py-2')}
              type={'text'}
              {...field}
            />
            {errors.ai_player_description && (
              <span className={cn('text-red-500 text-xs')}>
                {errors.ai_player_description.message}
              </span>
            )}
          </div>
        )}
      />

      <Controller
        name={'ai_player_move_endpoint'}
        control={form.control}
        rules={{
          required: 'O endpoint de movimento do jogador de IA é obrigatório',
        }}
        render={({ field }) => (
          <div className={cn('flex flex-col gap-1')}>
            <label className="text-xs">Endpoint de movimento do jogador</label>
            <input
              className={cn('border rounded-sm px-4 py-2')}
              type={'text'}
              {...field}
            />
            {errors.ai_player_move_endpoint && (
              <span className={cn('text-red-500 text-xs')}>
                {errors.ai_player_move_endpoint.message}
              </span>
            )}
          </div>
        )}
      />

      <button
        type={'submit'}
        disabled={isSubmitting}
        className={cn(
          'mt-4',
          'px-4',
          'py-2',
          'bg-green-500',
          'text-white',
          'rounded-md',
          'hover:bg-green-600',
          isSubmitting && 'opacity-50 cursor-not-allowed'
        )}
      >
        {isSubmitting ? 'Registrando...' : 'Registrar Jogador'}
      </button>
    </form>
  );
}
