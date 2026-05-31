import { cn } from '@core/helpers';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { updatePlayerMoveEndpoint } from '../api';
import { useGameContext } from '../context/game-context';

export function PlayerUpdateForm() {
  const { player, setPlayer } = useGameContext();

  const form = useForm({
    defaultValues: {
      ai_player_move_endpoint:
        player?.ai_player_move_endpoint || 'https://example.com/move-endpoint',
    },
  });
  const { formState } = form;
  const { isSubmitting, errors } = formState;

  async function handleSubmit(dto) {
    try {
      const response = await updatePlayerMoveEndpoint(player?.id, {
        ...dto,
      });

      if (!response?.id) {
        throw new Error('[ERR]: resposta inesperada ao atualizar jogador');
      }

      setPlayer(Object.assign({}, player, response));
    } catch (err) {
      console.error(err?.message || '[ERR]: erro ao atualizar jogador', err);
    }
  }

  useEffect(() => {
    if (player?.id) {
      form.reset({
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
        {isSubmitting ? 'Atualizando...' : 'Atualizar Endpoint'}
      </button>
    </form>
  );
}
