import { cn } from '@core/helpers';
import { setAccessToken } from '@core/helpers/fetch';
import { PlayerRegisterForm } from '@feature/game/components/player-register-form';
import { PlayerUpdateForm } from '@feature/game/components/player-update-form';
import { useGameContext } from '@feature/game/context/game-context';
import { Typography } from '@ui/text/typography';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { listPlayers } from '@feature/game/api';

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

function InformTokenForm() {
  const { setPlayer } = useGameContext();
  const form = useForm({ defaultValues: { player_access_token: '', player_id: '' } });
  const { formState } = form;
  const { isSubmitting } = formState;
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit({ player_access_token, player_id }) {
    setError(null);

    // Seta o token antes de fazer a requisição autenticada
    setAccessToken(player_access_token.trim());

    try {
      const response = await listPlayers();
      const players = Array.isArray(response) ? response : response?.items ?? [];
      const found = players.find((p) => p.id === Number(player_id));

      if (!found) {
        setAccessToken(null);
        setError('Jogador não encontrado. Verifique o ID informado.');
        return;
      }

      setPlayer({ ...found, player_access_token: player_access_token.trim() });
      setSuccess(true);
    } catch (err) {
      setAccessToken(null);
      console.error(err);
      setError('Token inválido ou erro ao buscar jogadores.');
    }
  }

  if (success) {
    return (
      <div style={{ padding: '16px', border: '1px solid #00ff88', background: '#001a0a', fontFamily: 'Share Tech Mono', fontSize: '0.85rem', color: '#00ff88' }}>
        ✓ TOKEN CONFIGURADO COM SUCESSO
      </div>
    );
  }

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-4">
      <Controller
        name="player_access_token"
        control={form.control}
        rules={{ required: 'O token de acesso é obrigatório' }}
        render={({ field }) => (
          <div className="flex flex-col">
            <label style={{ fontFamily: 'Orbitron', fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.15em', color: '#00ff8888', marginBottom: 4 }}>
              TOKEN DE ACESSO
            </label>
            <input
              style={inputStyle}
              type="text"
              placeholder="cole seu player_access_token aqui"
              {...field}
              onFocus={(e) => { e.target.style.borderColor = '#00ff88'; e.target.style.boxShadow = '0 0 12px #00ff8844'; }}
              onBlur={(e) => { e.target.style.borderColor = '#1e3a4a'; e.target.style.boxShadow = 'none'; }}
            />
            {form.formState.errors.player_access_token && (
              <span style={{ fontFamily: 'Share Tech Mono', fontSize: '0.7rem', color: '#ff2d55', marginTop: 4 }}>
                ⚠ {form.formState.errors.player_access_token.message}
              </span>
            )}
          </div>
        )}
      />

      <Controller
        name="player_id"
        control={form.control}
        rules={{ required: 'O ID do jogador é obrigatório' }}
        render={({ field }) => (
          <div className="flex flex-col">
            <label style={{ fontFamily: 'Orbitron', fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.15em', color: '#00ff8888', marginBottom: 4 }}>
              ID DO JOGADOR
            </label>
            <input
              style={inputStyle}
              type="number"
              placeholder="ex: 12"
              {...field}
              onFocus={(e) => { e.target.style.borderColor = '#00ff88'; e.target.style.boxShadow = '0 0 12px #00ff8844'; }}
              onBlur={(e) => { e.target.style.borderColor = '#1e3a4a'; e.target.style.boxShadow = 'none'; }}
            />
            {form.formState.errors.player_id && (
              <span style={{ fontFamily: 'Share Tech Mono', fontSize: '0.7rem', color: '#ff2d55', marginTop: 4 }}>
                ⚠ {form.formState.errors.player_id.message}
              </span>
            )}
          </div>
        )}
      />

      {error && (
        <div style={{ padding: '10px 14px', border: '1px solid #ff2d55', background: '#1a0810', fontFamily: 'Share Tech Mono', fontSize: '0.75rem', color: '#ff2d55' }}>
          ⚠ {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        style={{
          padding: '12px 24px',
          background: isSubmitting ? '#0a1520' : '#00e5ff11',
          border: '1px solid #00e5ff',
          color: '#00e5ff',
          fontFamily: 'Orbitron',
          fontSize: '0.7rem',
          fontWeight: 700,
          letterSpacing: '0.2em',
          textShadow: '0 0 6px #00e5ff',
          cursor: isSubmitting ? 'not-allowed' : 'pointer',
          opacity: isSubmitting ? 0.5 : 1,
          transition: 'all 0.2s',
          alignSelf: 'flex-start',
        }}
        onMouseEnter={(e) => { if (!isSubmitting) e.currentTarget.style.background = '#00e5ff33'; }}
        onMouseLeave={(e) => { if (!isSubmitting) e.currentTarget.style.background = '#00e5ff11'; }}
      >
        {isSubmitting ? 'BUSCANDO...' : '▶ CONFIRMAR'}
      </button>
    </form>
  );
}

function InfoRow({ label, value }) {
  return (
    <div style={{ display: 'flex', gap: 16, padding: '10px 0', borderBottom: '1px solid #1e3a4a', alignItems: 'flex-start' }}>
      <span style={{ fontFamily: 'Orbitron', fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.1em', color: '#00ff8888', minWidth: 180 }}>
        {label}
      </span>
      <span style={{ fontFamily: 'Share Tech Mono', fontSize: '0.85rem', color: '#c8d8e0', wordBreak: 'break-all' }}>
        {value || '—'}
      </span>
    </div>
  );
}

const TAB_REGISTER = 'register';
const TAB_TOKEN = 'token';

export function PlayerPage() {
  const { player } = useGameContext();
  const [activeTab, setActiveTab] = useState(TAB_REGISTER);

  const tabStyle = (active) => ({
    fontFamily: 'Orbitron',
    fontSize: '0.65rem',
    fontWeight: 700,
    letterSpacing: '0.15em',
    padding: '10px 20px',
    border: 'none',
    borderBottom: active ? '2px solid #00ff88' : '2px solid transparent',
    background: 'transparent',
    color: active ? '#00ff88' : '#6a8a9a',
    textShadow: active ? '0 0 8px #00ff88' : 'none',
    cursor: 'pointer',
    transition: 'all 0.2s',
  });

  return (
    <div className={cn('flex flex-col gap-6 py-8', 'flex-1')}>
      <div className="flex items-center gap-4">
        <div style={{ width: 4, height: 40, background: '#00ff88', boxShadow: '0 0 12px #00ff88' }} />
        <div>
          <Typography variant={'h1'} asTag={'h1'} className={cn('text-3xl')}>
            {player?.ai_player_name ? player.ai_player_name.toUpperCase() : 'JOGADOR'}
          </Typography>
          {player?.group_name && (
            <p style={{ fontFamily: 'Share Tech Mono', fontSize: '0.65rem', color: '#00ff8866', marginTop: 2 }}>
              GRUPO: {player.group_name}
            </p>
          )}
        </div>
      </div>

      {/* Not registered */}
      {!player && (
        <div style={{ border: '1px solid #1e3a4a', background: '#0d1117' }}>
          {/* Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid #1e3a4a' }}>
            <button style={tabStyle(activeTab === TAB_REGISTER)} onClick={() => setActiveTab(TAB_REGISTER)}>
              REGISTRAR JOGADOR
            </button>
            <button style={tabStyle(activeTab === TAB_TOKEN)} onClick={() => setActiveTab(TAB_TOKEN)}>
              JÁ TENHO CADASTRO
            </button>
          </div>

          <div style={{ padding: '24px' }}>
            {activeTab === TAB_REGISTER && (
              <>
                <p style={{ fontFamily: 'Share Tech Mono', fontSize: '0.7rem', color: '#6a8a9a', letterSpacing: '0.08em', marginBottom: 20 }}>
                  Preencha os dados para criar um novo jogador.
                </p>
                <PlayerRegisterForm />
              </>
            )}
            {activeTab === TAB_TOKEN && (
              <>
                <p style={{ fontFamily: 'Share Tech Mono', fontSize: '0.7rem', color: '#6a8a9a', letterSpacing: '0.08em', marginBottom: 20 }}>
                  Já possui um token de acesso? Informe abaixo para continuar de onde parou.
                </p>
                <InformTokenForm />
              </>
            )}
          </div>
        </div>
      )}

      {/* Registered */}
      {player && (
        <>
          <div style={{ border: '1px solid #1e3a4a', background: '#0d1117', padding: '24px' }}>
            <div style={{ fontFamily: 'Orbitron', fontSize: '0.7rem', letterSpacing: '0.15em', color: '#00ff8866', marginBottom: 16 }}>
              INFORMAÇÕES DO JOGADOR
            </div>
            <InfoRow label="GRUPO" value={player?.group_name} />
            <InfoRow label="NOME DO JOGADOR" value={player?.ai_player_name} />
            <InfoRow label="URL DO AVATAR" value={player?.ai_player_avatar} />
            <InfoRow label="DESCRIÇÃO" value={player?.ai_player_description} />
            <InfoRow label="ENDPOINT" value={player?.ai_player_move_endpoint} />
          </div>

          <div style={{ border: '1px solid #1e3a4a', background: '#0d1117', padding: '24px' }}>
            <Typography variant={'h3'} style={{ fontFamily: 'Orbitron', fontSize: '0.9rem', letterSpacing: '0.1em', color: '#00e5ff', marginBottom: 16 }}>
              ATUALIZAR ENDPOINT
            </Typography>
            <PlayerUpdateForm />
          </div>
        </>
      )}
    </div>
  );
}
