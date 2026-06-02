import { cn } from '@core/helpers';
import { joinGame, listGames, startGame } from '@feature/game/api';
import { useGameContext } from '@feature/game/context/game-context';
import { Typography } from '@ui/text/typography';
import { useState } from 'react';
import { useEffect } from 'react';
import { Link } from 'react-router';

const PAGE_SIZE = 10;

const statusConfig = {
  FINISHED: { label: 'ENCERRADO', color: '#ff2d55', glow: '#ff2d55' },
  WAITING_PLAYERS: { label: 'ESPERANDO JOGADORES', color: '#ffe600', glow: '#ffe600' },
  PAUSED: { label: 'PAUSADO', color: '#00e5ff', glow: '#00e5ff' },
  PLAYING: { label: 'EM ANDAMENTO', color: '#00ff88', glow: '#00ff88' },
};

function getStatus(status) {
  return statusConfig[status] ?? { label: 'EM ANDAMENTO', color: '#00ff88', glow: '#00ff88' };
}

function NavButton({ onClick, disabled, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{
        fontFamily: 'Orbitron',
        fontSize: '0.65rem',
        fontWeight: 700,
        letterSpacing: '0.15em',
        padding: '8px 18px',
        background: disabled ? 'transparent' : '#00ff8811',
        border: `1px solid ${disabled ? '#1e3a4a' : '#00ff88'}`,
        color: disabled ? '#2a4a5a' : '#00ff88',
        textShadow: disabled ? 'none' : '0 0 6px #00ff88',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s',
      }}
      onMouseEnter={(e) => { if (!disabled) e.currentTarget.style.background = '#00ff8833'; }}
      onMouseLeave={(e) => { if (!disabled) e.currentTarget.style.background = '#00ff8811'; }}
    >
      {children}
    </button>
  );
}

function GameRow({ game, player, onRefresh }) {
  const st = getStatus(game?.status);
  const isFinished = game?.status === 'FINISHED';
  const isWaiting = game?.status === 'WAITING_PLAYERS';
  const isPaused = game?.status === 'PAUSED';

  // Verifica se o jogador logado é participante desta partida
  const isPlayerInGame = player && (
    player.id === game?.turing_player?.id ||
    player.id === game?.lovelace_player?.id
  );

  const canJoin = isWaiting && player && !isPlayerInGame;
  const canStart = isPaused && isPlayerInGame;

  const [loadingJoin, setLoadingJoin] = useState(false);
  const [loadingStart, setLoadingStart] = useState(false);
  const [feedback, setFeedback] = useState(null);

  async function handleJoin() {
    setLoadingJoin(true);
    setFeedback(null);
    try {
      await joinGame(game.id, { player_id: player?.id, team_slot: 2 });

      // Registra automaticamente como espectador se ainda não for
      if (!spectator) {
        try {
          const spectatorData = await registerSpectator(gameId, {
            spectator_name: player?.ai_player_name || `Jogador #${player?.id}`,
            spectator_avatar: player?.ai_player_avatar || 'https://example.com/avatar.png',
          });
          saveSpectator(spectatorData);
        } catch (specErr) {
          console.warn('Não foi possível registrar como espectador:', specErr);
        }
      }

      setFeedback({ type: 'success', msg: 'Você entrou na partida!' });
      onRefresh();
    } catch {
      setFeedback({ type: 'error', msg: 'Erro ao entrar na partida.' });
    } finally {
      setLoadingJoin(false);
    }
  }

  async function handleStart() {
    setLoadingStart(true);
    setFeedback(null);
    try {
      await startGame(game.id);

      // Registra automaticamente como espectador se ainda não for
      if (!spectator) {
        try {
          const spectatorData = await registerSpectator(gameId, {
            spectator_name: player?.ai_player_name || `Jogador #${player?.id}`,
            spectator_avatar: player?.ai_player_avatar || 'https://example.com/avatar.png',
          });
          saveSpectator(spectatorData);
        } catch (specErr) {
          console.warn('Não foi possível registrar como espectador:', specErr);
        }
      }

      setFeedback({ type: 'success', msg: 'Partida iniciada!' });
      onRefresh();
    } catch {
      setFeedback({ type: 'error', msg: 'Erro ao iniciar partida.' });
    } finally {
      setLoadingStart(false);
    }
  }

  const actionBtnStyle = (color, disabled) => ({
    fontFamily: 'Orbitron',
    fontSize: '0.6rem',
    fontWeight: 700,
    letterSpacing: '0.12em',
    padding: '7px 14px',
    background: `${color}11`,
    border: `1px solid ${disabled ? '#1e3a4a' : color}`,
    color: disabled ? '#2a4a5a' : color,
    textShadow: disabled ? 'none' : `0 0 6px ${color}`,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    transition: 'all 0.2s',
    whiteSpace: 'nowrap',
    textDecoration: 'none',
    display: 'inline-block',
  });

  return (
    <div style={{ background: '#0d1117', border: '1px solid #1e3a4a', transition: 'all 0.2s', position: 'relative', overflow: 'hidden' }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${st.color}44`; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#1e3a4a'; }}
    >
      {/* Accent bar */}
      <div style={{ width: 3, height: '100%', position: 'absolute', left: 0, top: 0, background: st.color, boxShadow: `0 0 8px ${st.glow}` }} />

      {/* Main row */}
      <div style={{ padding: '14px 20px 14px 20px', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        {/* ID */}
        <div style={{ paddingLeft: 8, minWidth: 90 }}>
          <div style={{ fontFamily: 'Share Tech Mono', fontSize: '0.6rem', color: '#00ff8866', letterSpacing: '0.1em' }}>PARTIDA</div>
          <div style={{ fontFamily: 'Orbitron', fontWeight: 700, fontSize: '1rem', color: '#c8d8e0' }}>#{game.id}</div>
        </div>

        {/* Status */}
        <div style={{ padding: '4px 10px', border: `1px solid ${st.color}`, color: st.color, fontFamily: 'Orbitron', fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.1em', textShadow: `0 0 6px ${st.glow}`, whiteSpace: 'nowrap' }}>
          {st.label}
        </div>

        {/* Buttons — pushed to right */}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          {canJoin && (
            <button type="button" onClick={handleJoin} disabled={loadingJoin} style={actionBtnStyle('#ffe600', loadingJoin)}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#ffe60033'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = '#ffe60011'; }}
            >
              {loadingJoin ? 'ENTRANDO...' : '⚡ ENTRAR'}
            </button>
          )}
          {canStart && (
            <button type="button" onClick={handleStart} disabled={loadingStart} style={actionBtnStyle('#00e5ff', loadingStart)}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#00e5ff33'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = '#00e5ff11'; }}
            >
              {loadingStart ? 'INICIANDO...' : '▶ INICIAR'}
            </button>
          )}

          {/* Assistir / Ver detalhes */}
          {isFinished ? (
            <Link to={`/spectate/${game.id}`} style={actionBtnStyle('#ff2d55', false)}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#ff2d5533'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = '#ff2d5511'; }}
            >
              ◉ VER DETALHES
            </Link>
          ) : (
            <Link to={`/spectate/${game.id}`} style={actionBtnStyle('#00ff88', false)}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#00ff8833'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = '#00ff8811'; }}
            >
              👁 ASSISTIR
            </Link>
          )}
        </div>
      </div>

      {/* Feedback bar */}
      {feedback && (
        <div style={{ padding: '6px 20px 6px 28px', fontFamily: 'Share Tech Mono', fontSize: '0.7rem', color: feedback.type === 'success' ? '#00ff88' : '#ff2d55', background: feedback.type === 'success' ? '#00ff8811' : '#ff2d5511', borderTop: `1px solid ${feedback.type === 'success' ? '#00ff8833' : '#ff2d5533'}` }}>
          {feedback.type === 'success' ? '✓' : '⚠'} {feedback.msg}
        </div>
      )}
    </div>
  );
}

export function HomePage() {
  const { player } = useGameContext();
  const [partidas, setPartidas] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');

  async function buscarPartidas(p, status) {
    setLoading(true);
    setError(null);
    try {
      const query = { page: p, page_size: PAGE_SIZE };
      if (status) query.status = status;
      const response = await listGames(query);
      setPartidas(response);
    } catch (err) {
      console.error(err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (player) buscarPartidas(page, statusFilter);
    else setLoading(false);
  }, [page, player, statusFilter]);

  const items = partidas?.items ?? [];
  const total = partidas?.total ?? 0;
  const totalPages = total > 0 ? Math.ceil(total / (partidas?.page_size ?? PAGE_SIZE)) : 1;
  const currentPage = partidas?.page ?? page;
  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;

  if (!player) {
    return (
      <div className={cn('flex flex-col gap-6 py-8 flex-1')}>
        <div className="flex items-center gap-4">
          <div style={{ width: 4, height: 40, background: '#00ff88', boxShadow: '0 0 12px #00ff88' }} />
          <Typography variant={'h1'} asTag={'h1'} className={cn('text-3xl')}>PARTIDAS</Typography>
        </div>
        <div style={{ border: '1px solid #ffe60044', background: '#0d1008', padding: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, textAlign: 'center' }}>
          <div style={{ fontSize: '2rem' }}>⚠</div>
          <div style={{ fontFamily: 'Orbitron', fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.15em', color: '#ffe600', textShadow: '0 0 10px #ffe60055' }}>ACESSO RESTRITO</div>
          <p style={{ fontFamily: 'Exo 2', color: '#8a9ab0', fontSize: '0.9rem', maxWidth: 420, lineHeight: 1.7 }}>
            Para visualizar as partidas disponíveis, você precisa estar registrado como jogador.
          </p>
          <Link to="/player" style={{ marginTop: 8, fontFamily: 'Orbitron', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.2em', padding: '12px 28px', background: '#ffe60011', border: '1px solid #ffe600', color: '#ffe600', textDecoration: 'none', textShadow: '0 0 6px #ffe600' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#ffe60033'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#ffe60011'; }}
          >
            ▶ IR PARA REGISTRO DE JOGADOR
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col gap-6 py-8 flex-1')}>
      {/* Title + criar partida */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <div style={{ width: 4, height: 40, background: '#00ff88', boxShadow: '0 0 12px #00ff88' }} />
          <div>
            <Typography variant={'h1'} asTag={'h1'} className={cn('text-3xl')}>PARTIDAS</Typography>
            <p style={{ fontFamily: 'Share Tech Mono', fontSize: '0.7rem', color: '#00ff8866', marginTop: 2 }}>
              SELECIONE UMA PARTIDA PARA ASSISTIR
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            style={{
              fontFamily: 'Orbitron, sans-serif',
              fontSize: '0.65rem',
              fontWeight: 600,
              letterSpacing: '0.1em',
              padding: '9px 14px',
              background: '#0a0e14',
              border: '1px solid #1e3a4a',
              color: statusFilter ? '#00ff88' : '#4a6a7a',
              cursor: 'pointer',
              outline: 'none',
              transition: 'all 0.2s',
            }}
            onFocus={(e) => { e.target.style.borderColor = '#00ff88'; }}
            onBlur={(e) => { e.target.style.borderColor = '#1e3a4a'; }}
          >
            <option value="">TODOS OS STATUS</option>
            <option value="WAITING_PLAYERS">ESPERANDO JOGADORES</option>
            <option value="PLAYING">EM ANDAMENTO</option>
            <option value="PAUSED">PAUSADO</option>
            <option value="FINISHED">ENCERRADO</option>
          </select>

          <Link
            to="/games/create"
            style={{ fontFamily: 'Orbitron', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.15em', padding: '10px 22px', background: '#00e5ff11', border: '1px solid #00e5ff', color: '#00e5ff', textDecoration: 'none', textShadow: '0 0 6px #00e5ff', transition: 'all 0.2s' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#00e5ff33'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#00e5ff11'; }}
          >
            + CRIAR PARTIDA
          </Link>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div style={{ border: '1px solid #1e3a4a', background: '#0d1117', padding: '24px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 16, height: 16, border: '2px solid #00ff88', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          <span style={{ fontFamily: 'Share Tech Mono', color: '#00ff8888', fontSize: '0.85rem', letterSpacing: '0.1em' }}>CARREGANDO PARTIDAS...</span>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{ border: '1px solid #ff2d55', background: '#1a0810', padding: '16px', color: '#ff2d55', fontFamily: 'Share Tech Mono', fontSize: '0.8rem' }}>
          [ERRO] {String(error)}
        </div>
      )}

      {/* List */}
      {!loading && (
        <div className="flex flex-col gap-3">
          {items.map((game) => (
            <GameRow key={game.id} game={game} player={player} onRefresh={() => buscarPartidas(page)} />
          ))}
          {!items.length && (
            <div style={{ border: '1px dashed #1e3a4a', padding: '40px', textAlign: 'center', color: '#3a5a6a', fontFamily: 'Share Tech Mono', fontSize: '0.8rem', letterSpacing: '0.1em' }}>
              NENHUMA PARTIDA DISPONÍVEL
            </div>
          )}
        </div>
      )}

      {/* Pagination */}
      {!loading && (hasPrev || hasNext) && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 8 }}>
          <NavButton onClick={() => setPage(1)} disabled={!hasPrev}>«</NavButton>
          <NavButton onClick={() => setPage((p) => p - 1)} disabled={!hasPrev}>‹ ANTERIOR</NavButton>
          <div style={{ margin: '0 8px', fontFamily: 'Share Tech Mono', fontSize: '0.75rem', color: '#00ff8888', letterSpacing: '0.1em' }}>
            PÁG <span style={{ color: '#00ff88' }}>{currentPage}</span> / {totalPages}
          </div>
          <NavButton onClick={() => setPage((p) => p + 1)} disabled={!hasNext}>PRÓXIMA ›</NavButton>
          <NavButton onClick={() => setPage(totalPages)} disabled={!hasNext}>»</NavButton>
        </div>
      )}
    </div>
  );
}