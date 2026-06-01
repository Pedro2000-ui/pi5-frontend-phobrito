import { cn } from '@core/helpers';
import { listGames } from '@feature/game/api';
import { useGameContext } from '@feature/game/context/game-context';
import { Typography } from '@ui/text/typography';
import { useEffect, useState } from 'react';
import { Link } from 'react-router';

const PAGE_SIZE = 10;

const statusConfig = {
  FINISHED: { label: 'ENCERRADO', color: '#ff2d55', glow: '#ff2d55' },
  WAITING_PLAYERS: { label: 'ESPERANDO JOGADORES', color: '#ffe600', glow: '#ffe600' },
  PAUSED: { label: 'PAUSADO', color: '#00e5ff', glow: '#00e5ff' },
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
        fontFamily: 'Orbitron, sans-serif',
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

export function HomePage() {
  const { player } = useGameContext();
  const [partidas, setPartidas] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);

  async function buscarPartidas(p) {
    setLoading(true);
    setError(null);
    try {
      const response = await listGames({ page: p, page_size: PAGE_SIZE });
      setPartidas(response);
    } catch (err) {
      console.error(err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (player) buscarPartidas(page);
    else setLoading(false);
  }, [page, player]);

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
          <div>
            <Typography variant={'h1'} asTag={'h1'} className={cn('text-3xl')}>
              PARTIDAS
            </Typography>
            <p style={{ fontFamily: 'Share Tech Mono', fontSize: '0.7rem', color: '#00ff8866', marginTop: 2 }}>
              SELECIONE UMA PARTIDA PARA ASSISTIR/JOGAR
            </p>
          </div>
        </div>

        <div style={{
          border: '1px solid #ffe60044',
          background: '#0d1008',
          padding: '32px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 16,
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '2rem' }}>⚠</div>
          <div style={{ fontFamily: 'Orbitron', fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.15em', color: '#ffe600', textShadow: '0 0 10px #ffe60055' }}>
            ACESSO RESTRITO
          </div>
          <p style={{ fontFamily: 'Exo 2, sans-serif', color: '#8a9ab0', fontSize: '0.9rem', maxWidth: 420, lineHeight: 1.7 }}>
            Para visualizar as partidas disponíveis, você precisa estar registrado como jogador.
          </p>
          <Link
            to="/player"
            style={{
              marginTop: 8,
              fontFamily: 'Orbitron',
              fontSize: '0.7rem',
              fontWeight: 700,
              letterSpacing: '0.2em',
              padding: '12px 28px',
              background: '#ffe60011',
              border: '1px solid #ffe600',
              color: '#ffe600',
              textDecoration: 'none',
              textShadow: '0 0 6px #ffe600',
              boxShadow: '0 0 12px #ffe60022',
              transition: 'all 0.2s',
            }}
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
    <div className={cn('flex flex-col gap-6 py-8', 'flex-1')}>
      <div className="flex items-center gap-4">
        <div style={{ width: 4, height: 40, background: '#00ff88', boxShadow: '0 0 12px #00ff88' }} />
        <div>
          <Typography variant={'h1'} asTag={'h1'} className={cn('text-3xl')}>
            PARTIDAS
          </Typography>
          <p style={{ fontFamily: 'Share Tech Mono', fontSize: '0.7rem', color: '#00ff8866', marginTop: 2 }}>
            SELECIONE UMA PARTIDA PARA ASSISTIR/JOGAR
          </p>
        </div>
      </div>

      {loading && (
        <div style={{ border: '1px solid #1e3a4a', background: '#0d1117', padding: '24px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 16, height: 16, border: '2px solid #00ff88', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          <span style={{ fontFamily: 'Share Tech Mono', color: '#00ff8888', fontSize: '0.85rem', letterSpacing: '0.1em' }}>
            CARREGANDO PARTIDAS...
          </span>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {error && (
        <div style={{ border: '1px solid #ff2d55', background: '#1a0810', padding: '16px', color: '#ff2d55', fontFamily: 'Share Tech Mono', fontSize: '0.8rem' }}>
          [ERRO] {String(error)}
        </div>
      )}

      {!loading && (
        <div className="flex flex-col gap-3">
          {items.map((game, g) => {
            const st = getStatus(game?.status);
            const isFinished = game?.status === 'FINISHED';
            return (
              <div
                key={g}
                style={{ background: '#0d1117', border: '1px solid #1e3a4a', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16, transition: 'all 0.2s', position: 'relative', overflow: 'hidden' }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${st.color}44`; e.currentTarget.style.boxShadow = `0 0 20px ${st.glow}11`; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#1e3a4a'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <div style={{ width: 3, height: '100%', position: 'absolute', left: 0, top: 0, background: st.color, boxShadow: `0 0 8px ${st.glow}` }} />
                <div style={{ paddingLeft: 8 }}>
                  <div style={{ fontFamily: 'Share Tech Mono', fontSize: '0.65rem', color: '#00ff8866', letterSpacing: '0.1em' }}>PARTIDA</div>
                  <div style={{ fontFamily: 'Orbitron', fontWeight: 700, fontSize: '1.1rem', color: '#c8d8e0', letterSpacing: '0.05em' }}>#{game.id}</div>
                </div>
                <div style={{ marginLeft: 'auto', padding: '4px 12px', border: `1px solid ${st.color}`, color: st.color, fontFamily: 'Orbitron', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.12em', textShadow: `0 0 6px ${st.glow}`, whiteSpace: 'nowrap' }}>
                  {st.label}
                </div>

                {isFinished ? (
                  <Link
                    to={`/spectate/${game.id}`}
                    style={{ fontFamily: 'Orbitron', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.12em', padding: '8px 20px', background: '#ff2d5511', border: '1px solid #ff2d55', color: '#ff2d55', textDecoration: 'none', textShadow: '0 0 6px #ff2d55', transition: 'all 0.2s', whiteSpace: 'nowrap' }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = '#ff2d5533'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = '#ff2d5511'; }}
                  >
                    ◉ VER DETALHES
                  </Link>
                ) : (
                  <Link
                    to={`/spectate/${game.id}`}
                    style={{ fontFamily: 'Orbitron', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.15em', padding: '8px 20px', background: '#00ff8811', border: '1px solid #00ff88', color: '#00ff88', textDecoration: 'none', textShadow: '0 0 6px #00ff88', transition: 'all 0.2s', whiteSpace: 'nowrap' }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = '#00ff8833'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = '#00ff8811'; }}
                  >
                    ▶ ASSISTIR
                  </Link>
                )}
              </div>
            );
          })}

          {!items.length && (
            <div style={{ border: '1px dashed #1e3a4a', padding: '40px', textAlign: 'center', color: '#3a5a6a', fontFamily: 'Share Tech Mono', fontSize: '0.8rem', letterSpacing: '0.1em' }}>
              NENHUMA PARTIDA DISPONÍVEL
            </div>
          )}
        </div>
      )}

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