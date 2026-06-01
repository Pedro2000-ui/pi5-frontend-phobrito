import { cn } from '@core/helpers';
import { Controller, useForm } from 'react-hook-form';
import { registerSpectator } from '../api';
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

const labelStyle = {
  fontFamily: 'Orbitron, sans-serif',
  fontSize: '0.6rem',
  fontWeight: 600,
  letterSpacing: '0.15em',
  color: '#00ff8888',
  marginBottom: 4,
};

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
      const response = await registerSpectator(gameId, { ...dto });
      if (!response?.spectator_access_token) {
        throw new Error('[ERR]: resposta inesperada ao registrar espectador');
      }
      setSpectator(response);
    } catch (err) {
      console.error(err?.message || '[ERR]: erro ao registrar espectador', err);
    }
  }

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className={cn('flex flex-col gap-4')}>
      <Controller
        name={'spectator_name'}
        control={form.control}
        rules={{ required: 'O nome do espectador é obrigatório' }}
        render={({ field }) => (
          <div className={cn('flex flex-col')}>
            <label style={labelStyle}>NOME DO ESPECTADOR</label>
            <input
              style={inputStyle}
              type={'text'}
              {...field}
              onFocus={(e) => { e.target.style.borderColor = '#00ff88'; e.target.style.boxShadow = '0 0 12px #00ff8844'; }}
              onBlur={(e) => { e.target.style.borderColor = '#1e3a4a'; e.target.style.boxShadow = 'none'; }}
            />
            {errors.spectator_name && (
              <span style={{ fontFamily: 'Share Tech Mono', fontSize: '0.7rem', color: '#ff2d55', marginTop: 4 }}>
                ⚠ {errors.spectator_name.message}
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
          <div className={cn('flex flex-col')}>
            <label style={labelStyle}>URL DO AVATAR</label>
            <input
              style={inputStyle}
              type={'text'}
              {...field}
              onFocus={(e) => { e.target.style.borderColor = '#00ff88'; e.target.style.boxShadow = '0 0 12px #00ff8844'; }}
              onBlur={(e) => { e.target.style.borderColor = '#1e3a4a'; e.target.style.boxShadow = 'none'; }}
            />
            {errors.spectator_avatar && (
              <span style={{ fontFamily: 'Share Tech Mono', fontSize: '0.7rem', color: '#ff2d55', marginTop: 4 }}>
                ⚠ {errors.spectator_avatar.message}
              </span>
            )}
          </div>
        )}
      />

      <button
        type={'submit'}
        disabled={isSubmitting}
        style={{
          marginTop: 8,
          padding: '12px 24px',
          background: isSubmitting ? '#0a1520' : '#00ff8811',
          border: '1px solid #00ff88',
          color: '#00ff88',
          fontFamily: 'Orbitron, sans-serif',
          fontSize: '0.7rem',
          fontWeight: 700,
          letterSpacing: '0.2em',
          textShadow: '0 0 6px #00ff88',
          boxShadow: isSubmitting ? 'none' : '0 0 12px #00ff8822',
          cursor: isSubmitting ? 'not-allowed' : 'pointer',
          opacity: isSubmitting ? 0.5 : 1,
          transition: 'all 0.2s',
          alignSelf: 'flex-start',
        }}
        onMouseEnter={(e) => { if (!isSubmitting) { e.currentTarget.style.background = '#00ff8833'; e.currentTarget.style.boxShadow = '0 0 20px #00ff8844'; }}}
        onMouseLeave={(e) => { if (!isSubmitting) { e.currentTarget.style.background = '#00ff8811'; e.currentTarget.style.boxShadow = '0 0 12px #00ff8822'; }}}
      >
        {isSubmitting ? 'REGISTRANDO...' : '▶ REGISTRAR ESPECTADOR'}
      </button>
    </form>
  );
}
