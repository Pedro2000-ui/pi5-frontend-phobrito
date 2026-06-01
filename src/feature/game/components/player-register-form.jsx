import { Controller, useForm } from 'react-hook-form';
import { registerPlayer } from '../api';
import { cn } from '@core/helpers';
import { useGameContext } from '../context/game-context';
import { useEffect } from 'react';

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

function Field({ label, children, error }) {
  return (
    <div className="flex flex-col">
      <label style={labelStyle}>{label}</label>
      {children}
      {error && (
        <span style={{ fontFamily: 'Share Tech Mono', fontSize: '0.7rem', color: '#ff2d55', marginTop: 4 }}>
          ⚠ {error}
        </span>
      )}
    </div>
  );
}

export function PlayerRegisterForm() {
  const { player, setPlayer } = useGameContext();

  const form = useForm({
    defaultValues: {
      ai_player_name: player?.ai_player_name || 'Meu Jogador',
      ai_player_avatar: player?.ai_player_avatar || 'https://example.com/avatar.png',
      group_name: player?.group_name || 'Meu Grupo',
      ai_player_description: player?.ai_player_description || 'Descrição do meu jogador de IA',
      ai_player_move_endpoint: player?.ai_player_move_endpoint || 'https://example.com/move-endpoint',
    },
  });
  const { formState } = form;
  const { isSubmitting, errors } = formState;

  async function handleSubmit(dto) {
    try {
      const response = await registerPlayer({ ...dto });
      if (!response?.player_access_token) throw new Error('[ERR]: resposta inesperada ao registrar jogador');
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
        ai_player_avatar: player?.ai_player_avatar || 'https://example.com/avatar.png',
        group_name: player?.group_name || 'Meu Grupo',
        ai_player_description: player?.ai_player_description || 'Descrição do meu jogador de IA',
        ai_player_move_endpoint: player?.ai_player_move_endpoint || 'https://example.com/move-endpoint',
      });
    }
  }, [player]);

  const onFocus = (e) => { e.target.style.borderColor = '#00ff88'; e.target.style.boxShadow = '0 0 12px #00ff8844'; };
  const onBlur = (e) => { e.target.style.borderColor = '#1e3a4a'; e.target.style.boxShadow = 'none'; };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className={cn('flex flex-col gap-4')}>
      {[
        { name: 'group_name', label: 'NOME DO GRUPO', rules: { required: 'O nome do grupo é obrigatório' } },
        { name: 'ai_player_name', label: 'NOME DO JOGADOR', rules: { required: 'O nome do jogador de IA é obrigatório' } },
        { name: 'ai_player_avatar', label: 'URL DO AVATAR', rules: { required: 'A URL do avatar é obrigatória' } },
        { name: 'ai_player_description', label: 'DESCRIÇÃO DO JOGADOR', rules: {} },
        { name: 'ai_player_move_endpoint', label: 'ENDPOINT DE MOVIMENTO', rules: { required: 'O endpoint é obrigatório' } },
      ].map(({ name, label, rules }) => (
        <Controller
          key={name}
          name={name}
          control={form.control}
          rules={rules}
          render={({ field }) => (
            <Field label={label} error={errors[name]?.message}>
              <input style={inputStyle} type="text" {...field} onFocus={onFocus} onBlur={onBlur} />
            </Field>
          )}
        />
      ))}

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
          cursor: isSubmitting ? 'not-allowed' : 'pointer',
          opacity: isSubmitting ? 0.5 : 1,
          transition: 'all 0.2s',
          alignSelf: 'flex-start',
        }}
      >
        {isSubmitting ? 'REGISTRANDO...' : '▶ REGISTRAR JOGADOR'}
      </button>
    </form>
  );
}
