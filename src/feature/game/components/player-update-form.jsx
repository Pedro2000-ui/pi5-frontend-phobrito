import { cn } from '@core/helpers';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { updatePlayerMoveEndpoint } from '../api';
import { useGameContext } from '../context/game-context';

const inputStyle = {
  background: '#0a1520',
  border: '1px solid #1e3a4a',
  color: '#00ff88',
  fontFamily: 'Share Tech Mono, monospace',
  padding: '10px 14px',
  fontSize: '0.85rem',
  width: '100%',
  outline: 'none',
  transition: 'all 0.2s',
};

export function PlayerUpdateForm() {
  const { player, setPlayer } = useGameContext();

  const form = useForm({
    defaultValues: {
      ai_player_move_endpoint: player?.ai_player_move_endpoint || 'https://example.com/move-endpoint',
    },
  });
  const { formState } = form;
  const { isSubmitting, errors } = formState;

  async function handleSubmit(dto) {
    try {
      const response = await updatePlayerMoveEndpoint(player?.id, { ...dto });
      if (!response?.id) throw new Error('[ERR]: resposta inesperada ao atualizar jogador');
      setPlayer(Object.assign({}, player, response));
    } catch (err) {
      console.error(err?.message || '[ERR]: erro ao atualizar jogador', err);
    }
  }

  useEffect(() => {
    if (player?.id) {
      form.reset({ ai_player_move_endpoint: player?.ai_player_move_endpoint || 'https://example.com/move-endpoint' });
    }
  }, [player]);

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className={cn('flex flex-col gap-4')}>
      <Controller
        name={'ai_player_move_endpoint'}
        control={form.control}
        rules={{ required: 'O endpoint de movimento do jogador de IA é obrigatório' }}
        render={({ field }) => (
          <div className="flex flex-col">
            <label style={{ fontFamily: 'Orbitron', fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.15em', color: '#00ff8888', marginBottom: 4 }}>
              ENDPOINT DE MOVIMENTO
            </label>
            <input
              style={inputStyle}
              type={'text'}
              {...field}
              onFocus={(e) => { e.target.style.borderColor = '#00ff88'; e.target.style.boxShadow = '0 0 12px #00ff8844'; }}
              onBlur={(e) => { e.target.style.borderColor = '#1e3a4a'; e.target.style.boxShadow = 'none'; }}
            />
            {errors.ai_player_move_endpoint && (
              <span style={{ fontFamily: 'Share Tech Mono', fontSize: '0.7rem', color: '#ff2d55', marginTop: 4 }}>
                ⚠ {errors.ai_player_move_endpoint.message}
              </span>
            )}
          </div>
        )}
      />

      <button
        type={'submit'}
        disabled={isSubmitting}
        style={{
          padding: '12px 24px',
          background: isSubmitting ? '#0a1520' : '#00e5ff11',
          border: '1px solid #00e5ff',
          color: '#00e5ff',
          fontFamily: 'Orbitron, sans-serif',
          fontSize: '0.7rem',
          fontWeight: 700,
          letterSpacing: '0.2em',
          textShadow: '0 0 6px #00e5ff',
          cursor: isSubmitting ? 'not-allowed' : 'pointer',
          opacity: isSubmitting ? 0.5 : 1,
          transition: 'all 0.2s',
          alignSelf: 'flex-start',
        }}
      >
        {isSubmitting ? 'ATUALIZANDO...' : '▶ ATUALIZAR ENDPOINT'}
      </button>
    </form>
  );
}
