import { cn } from '@core/helpers';
import { Controller, useForm } from 'react-hook-form';
import { registerSpectator } from '../api';
import { useGameContext } from '../context/game-context';

export function SpectatorRegisterForm({ gameId }) {

  const { setSpectator } = useGameContext();

  const form = useForm({
    defaultValues: {
      spectator_avatar: 'https://example.com/avatar.png',
      spectator_name: 'Meu Espectador',
    },
  });
  const { formState } = form;
  const { isSubmitting, errors } = formState;

  async function handleSubmit(dto) {
    try {
      const response = await registerSpectator(gameId, {
        ...dto,
      });

      if (!response?.spectator_access_token) {
        throw new Error('[ERR]: resposta inesperada ao registrar espectador');
      }

      setSpectator(response);


    } catch (err) {
      console.error(err?.message || '[ERR]: erro ao registrar espectador', err);
    }
  }

  return (
    <form
      onSubmit={form.handleSubmit(handleSubmit)}
      className={cn('flex flex-col gap-2')}
    >
      <Controller
        name={'spectator_name'}
        control={form.control}
        rules={{ required: 'O nome do espectador é obrigatório' }}
        render={({ field }) => (
          <div className={cn('flex flex-col gap-1')}>
            <label className="text-xs">Nome do espectador</label>
            <input
              className={cn('border rounded-sm px-4 py-2')}
              type={'text'}
              {...field}
            />
            {errors.spectator_name && (
              <span className={cn('text-red-500 text-xs')}>
                {errors.spectator_name.message}
              </span>
            )}
          </div>
        )}
      />

      <Controller
        name={'spectator_avatar'}
        control={form.control}
        rules={{ required: 'A URL do avatar do espectador é obrigatória' }}
        render={({ field }) => (
          <div className={cn('flex flex-col gap-1')}>
            <label className="text-xs">URL do avatar</label>
            <input
              className={cn('border rounded-sm px-4 py-2')}
              type={'text'}
              {...field}
            />
            {errors.spectator_avatar && (
              <span className={cn('text-red-500 text-xs')}>
                {errors.spectator_avatar.message}
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
        {isSubmitting ? 'Registrando...' : 'Registrar Espectador'}
      </button>
    </form>
  );
}
