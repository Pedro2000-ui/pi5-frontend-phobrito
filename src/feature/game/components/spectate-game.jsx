import { getGame, joinGame, registerSpectator, startGame } from '@feature/game/api';
import { useGameSocket } from '@feature/game/hooks/useGameSocket';
import { Typography } from '@ui/text/typography';
import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { useGameContext } from '../context/game-context';
import ViewGame from './view-game';

function ActionButton({ onClick, disabled, color = '#00ff88', children }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        fontFamily: 'Orbitron',
        fontSize: '0.65rem',
        fontWeight: 700,
        letterSpacing: '0.15em',
        padding: '10px 20px',
        background: hover && !disabled ? `${color}33` : `${color}11`,
        border: `1px solid ${disabled ? '#1e3a4a' : color}`,
        color: disabled ? '#2a4a5a' : color,
        textShadow: disabled ? 'none' : `0 0 6px ${color}`,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'all 0.2s',
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </button>
  );
}
function resolveTeamSlot(game, playerId) {
  const turingId = game?.turing_player?.id;
  const lovelaceId = game?.lovelace_player?.id;

  // Se já está em algum slot, retorna o seu
  if (turingId === playerId) return '1';
  if (lovelaceId === playerId) return '2';

  // Slots livres: prefere o 1, depois o 2
  if (!turingId) return '1';
  if (!lovelaceId) return '2';
  return '1';
}

export function SpectateGame({ gameId }) {
  const { spectator: storedSpectator, player, setSpectator: saveSpectator } = useGameContext();
  const [game, setGame] = useState(null);
  const [loadingGame, setLoadingGame] = useState(true);
  const [loadingJoin, setLoadingJoin] = useState(false);
  const [loadingStart, setLoadingStart] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const [spectator, setSpectator] = useState(() =>
    storedSpectator?.[gameId] ?? null
  );

  useEffect(() => {
    if (storedSpectator?.[gameId]) setSpectator(storedSpectator?.[gameId]);
  }, [storedSpectator]);

  // WebSocket — conecta assim que tiver token (espectador ou jogador)
  const wsToken = spectator?.spectator_access_token ?? player?.player_access_token;
  const { gameState } = useGameSocket(gameId, wsToken);

  // WS só atualiza campos dinâmicos — merge com os dados fixos do getGame
  const currentGame = game
    ? { ...game, ...(gameState ?? {}) }
    : gameState;

  const isPlayer = player && (
    player.id === currentGame?.turing_player?.id ||
    player.id === currentGame?.lovelace_player?.id
  );
  const isWaiting = currentGame?.status === 'WAITING_PLAYERS';
  const isPaused = currentGame?.status === 'PAUSED';
  const isFinished = currentGame?.status === 'FINISHED';
  const canJoin = isWaiting && player && !isPlayer;
  const canStart = isPaused && isPlayer;
  const canWatch = spectator || isPlayer;

  async function fetchGame() {
    try {
      const data = await getGame(gameId);
      setGame(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingGame(false);
    }
  }

  useEffect(() => { fetchGame(); }, [gameId]);

  // Auto-registro como espectador ao entrar na página (se logado e ainda não registrado)
  useEffect(() => {
    if (!player || loadingGame || spectator || isPlayer) return;
    registerSpectator(gameId, {
      spectator_name: player.ai_player_name || `Jogador #${player.id}`,
      spectator_avatar: player.ai_player_avatar || 'https://example.com/avatar.png',
    })
      .then((data) => {
        if (data?.spectator_access_token) {
          saveSpectator({ ...data, game_id: Number(gameId) });
        }
      })
      .catch((err) => console.warn('Não foi possível registrar como espectador:', err));
  }, [player, loadingGame, gameId]);

  async function handleJoin() {
    setLoadingJoin(true); setFeedback(null);
    try {
      const teamSlot = resolveTeamSlot(currentGame, player?.id);
      await joinGame(gameId, { player_id: player?.id, team_slot: teamSlot });

      // Registra como espectador se ainda não for
      if (!spectator) {
        try {
          const spectatorData = await registerSpectator(gameId, {
            spectator_name: player?.ai_player_name || `Jogador #${player?.id}`,
            spectator_avatar: player?.ai_player_avatar || 'https://example.com/avatar.png',
          });
          if (spectatorData?.spectator_access_token) {
            saveSpectator({ ...spectatorData, game_id: Number(gameId) });
          }
        } catch (specErr) {
          console.warn('Não foi possível registrar como espectador:', specErr);
        }
      }

      setFeedback({ type: 'success', msg: 'Você entrou na partida!' });
      fetchGame();
    } catch { setFeedback({ type: 'error', msg: 'Erro ao entrar na partida.' }); }
    finally { setLoadingJoin(false); }
  }

  async function handleStart() {
    setLoadingStart(true); setFeedback(null);
    try {
      await startGame(gameId);

      if (!spectator) {
        try {
          const spectatorData = await registerSpectator(gameId, {
            spectator_name: player?.ai_player_name || `Jogador #${player?.id}`,
            spectator_avatar: player?.ai_player_avatar || 'https://example.com/avatar.png',
          });
          if (spectatorData?.spectator_access_token) {
            saveSpectator({ ...spectatorData, game_id: Number(gameId) });
          }
        } catch (specErr) {
          console.warn('Não foi possível registrar como espectador:', specErr);
        }
      }

      setFeedback({ type: 'success', msg: 'Partida iniciada!' });
      fetchGame();
    } catch { setFeedback({ type: 'error', msg: 'Erro ao iniciar a partida.' }); }
    finally { setLoadingStart(false); }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Back + actions bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <Link
          to="/"
          style={{ fontFamily: 'Orbitron', fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.15em', color: '#6a8a9a', textDecoration: 'none', padding: '6px 12px', border: '1px solid #1e3a4a', transition: 'all 0.2s' }}
          onMouseEnter={(e) => { e.currentTarget.style.color = '#c8d8e0'; e.currentTarget.style.borderColor = '#3a5a6a'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = '#6a8a9a'; e.currentTarget.style.borderColor = '#1e3a4a'; }}
        >
          ‹ VOLTAR
        </Link>

        {(canJoin || canStart) && (
          <>
            {canJoin && (
              <ActionButton onClick={handleJoin} disabled={loadingJoin} color="#ffe600">
                {loadingJoin ? 'ENTRANDO...' : '⚡ ENTRAR NA PARTIDA'}
              </ActionButton>
            )}
            {canStart && (
              <ActionButton onClick={handleStart} disabled={loadingStart} color="#00e5ff">
                {loadingStart ? 'INICIANDO...' : '▶ INICIAR PARTIDA'}
              </ActionButton>
            )}
          </>
        )}

        {!isFinished && (
          <div style={{ marginLeft: 'auto', fontFamily: 'Share Tech Mono', fontSize: '0.6rem', color: '#00ff8855', letterSpacing: '0.1em' }}>
            ● AO VIVO
          </div>
        )}
      </div>

      {feedback && (
        <div style={{ padding: '8px 14px', border: `1px solid ${feedback.type === 'success' ? '#00ff8833' : '#ff2d5533'}`, fontFamily: 'Share Tech Mono', fontSize: '0.75rem', color: feedback.type === 'success' ? '#00ff88' : '#ff2d55' }}>
          {feedback.type === 'success' ? '✓' : '⚠'} {feedback.msg}
        </div>
      )}

      {/* Tabuleiro — visível para todos */}
      {!loadingGame && currentGame && (
        <ViewGame gameData={currentGame} />
      )}
    </div>
  );
}
