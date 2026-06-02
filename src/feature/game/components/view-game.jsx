import { getGame } from '@feature/game/api';
import { useEffect, useState } from 'react';

const LEVEL_CONFIG = {
    0: { label: 'VAZIO', bg: '#0d1117', border: '#1e3a4a', text: '#3a5a6a' },  // cinza
    1: { label: 'NÍV. 1', bg: '#0a1a2e', border: '#1e6aaa', text: '#4a9ad4' },  // azul
    2: { label: 'NÍV. 2', bg: '#1a0a2e', border: '#7a1eaa', text: '#b44ad4' },  // roxo
    3: { label: 'VITÓRIA', bg: '#1a0a00', border: '#ff6a00', text: '#ff8c00' },  // laranja
    4: { label: 'BLOQ.', bg: '#1a1a1a', border: '#555555', text: '#888888' },  // bloqueada
};

const TEAM_TURING = { name: 'TURING', color: '#00e5ff', glow: '#00e5ff', bg: '#001a2a' };
const TEAM_LOVELACE = { name: 'LOVELACE', color: '#ff2d55', glow: '#ff2d55', bg: '#2a0010' };

// Professores Turing: CLARO, REY — Lovelace: KARIN, BEATRIZ
// Na API, turing_player ocupa team_id=1 e lovelace_player team_id=2
const TURING_PROFESSORS = ['CLARO', 'REY'];
const LOVELACE_PROFESSORS = ['KARIN', 'BEATRIZ'];

function getProfessorTeam(professor) {
    if (!professor) return null;
    if (TURING_PROFESSORS.includes(professor)) return TEAM_TURING;
    if (LOVELACE_PROFESSORS.includes(professor)) return TEAM_LOVELACE;
    return null;
}

function Cell({ cell }) {
    const lvl = LEVEL_CONFIG[cell.level] ?? LEVEL_CONFIG[0];
    const team = getProfessorTeam(cell.professor);
    const hasPiece = !!cell.professor;

    return (
        <div
            style={{
                position: 'relative',
                aspectRatio: '1',
                background: lvl.bg,
                border: `2px solid ${hasPiece ? team.color : lvl.border}`,
                boxShadow: hasPiece ? `0 0 14px ${team.glow}55, inset 0 0 10px ${team.glow}11` : 'none',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 4,
                transition: 'all 0.2s',
                minWidth: 0,
            }}
        >
            {/* Level indicator — small dots */}
            <div style={{ display: 'flex', gap: 3, position: 'absolute', top: 5, left: 6 }}>
                {Array.from({ length: Math.min(cell.level, 4) }).map((_, i) => (
                    <div
                        key={i}
                        style={{
                            width: 5, height: 5,
                            borderRadius: '50%',
                            background: cell.level === 4 ? '#ffe600' : cell.level === 3 ? '#00ff88' : lvl.text,
                            boxShadow: cell.level >= 3 ? `0 0 4px ${cell.level === 4 ? '#ffe600' : '#00ff88'}` : 'none',
                        }}
                    />
                ))}
            </div>

            {/* Level badge */}
            <div style={{
                position: 'absolute', bottom: 4, right: 5,
                fontFamily: 'Share Tech Mono', fontSize: '0.5rem',
                color: lvl.text, letterSpacing: '0.05em', opacity: 0.7,
            }}>
                L{cell.level}
            </div>

            {/* Professor piece */}
            {hasPiece && (
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 2,
                }}>
                    {/* Avatar circle */}
                    <div style={{
                        width: 36, height: 36,
                        borderRadius: '50%',
                        background: team.bg,
                        border: `2px solid ${team.color}`,
                        boxShadow: `0 0 10px ${team.glow}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontFamily: 'Orbitron',
                        fontWeight: 900,
                        fontSize: '0.65rem',
                        color: team.color,
                        textShadow: `0 0 6px ${team.glow}`,
                    }}>
                        {cell.professor.slice(0, 2)}
                    </div>
                    {/* Name */}
                    <span style={{
                        fontFamily: 'Orbitron',
                        fontSize: '0.42rem',
                        fontWeight: 700,
                        letterSpacing: '0.05em',
                        color: team.color,
                        textShadow: `0 0 4px ${team.glow}`,
                        textAlign: 'center',
                        lineHeight: 1,
                    }}>
                        {cell.professor}
                    </span>
                </div>
            )}
        </div>
    );
}

function PlayerCard({ player, team, isWinner, isCurrentTurn }) {
    if (!player) return null;
    const initial = (player.ai_player_name || '?')[0].toUpperCase();

    return (
        <div style={{
            flex: 1,
            border: `1px solid ${isCurrentTurn ? team.color : '#1e3a4a'}`,
            background: isCurrentTurn ? `${team.bg}` : '#0d1117',
            padding: '14px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            position: 'relative',
            transition: 'all 0.3s',
            boxShadow: isCurrentTurn ? `0 0 20px ${team.glow}33` : 'none',
        }}>
            {/* Team label */}
            <div style={{ fontFamily: 'Orbitron', fontSize: '0.55rem', fontWeight: 700, letterSpacing: '0.2em', color: team.color, textShadow: `0 0 6px ${team.glow}` }}>
                TIME {team.name}
            </div>

            {/* Player info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                    width: 40, height: 40, borderRadius: '50%',
                    background: team.bg,
                    border: `2px solid ${team.color}`,
                    boxShadow: `0 0 8px ${team.glow}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'Orbitron', fontWeight: 900, fontSize: '1rem',
                    color: team.color, flexShrink: 0,
                    overflow: 'hidden',
                }}>
                    {player.ai_player_avatar
                        ? <img src={player.ai_player_avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.style.display = 'none'; }} />
                        : initial
                    }
                </div>
                <div>
                    <div style={{ fontFamily: 'Orbitron', fontWeight: 700, fontSize: '0.8rem', color: '#c8d8e0', letterSpacing: '0.05em' }}>
                        {player.ai_player_name}
                    </div>
                    <div style={{ fontFamily: 'Share Tech Mono', fontSize: '0.6rem', color: '#4a6a7a' }}>
                        {player.group_name}
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
                {[
                    { label: 'PARTIDAS', value: player.games_played ?? 0 },
                    { label: 'VITÓRIAS', value: player.games_won ?? 0 },
                    { label: 'DERROTAS', value: player.games_lost ?? 0 },
                ].map(({ label, value }) => (
                    <div key={label} style={{ textAlign: 'center' }}>
                        <div style={{ fontFamily: 'Orbitron', fontWeight: 700, fontSize: '0.9rem', color: team.color, textShadow: `0 0 6px ${team.glow}` }}>
                            {value}
                        </div>
                        <div style={{ fontFamily: 'Share Tech Mono', fontSize: '0.48rem', color: '#4a6a7a', letterSpacing: '0.1em' }}>
                            {label}
                        </div>
                    </div>
                ))}
            </div>

            {/* Winner badge */}
            {isWinner && (
                <div style={{
                    position: 'absolute', top: 8, right: 10,
                    fontFamily: 'Orbitron', fontSize: '0.55rem', fontWeight: 700, letterSpacing: '0.15em',
                    color: '#ffe600', textShadow: '0 0 8px #ffe600',
                    border: '1px solid #ffe600', padding: '2px 8px',
                    background: '#ffe60011',
                }}>
                    🏆 VENCEDOR
                </div>
            )}

            {/* Turn indicator */}
            {isCurrentTurn && !isWinner && (
                <div style={{
                    position: 'absolute', top: 8, right: 10,
                    fontFamily: 'Share Tech Mono', fontSize: '0.55rem', letterSpacing: '0.15em',
                    color: team.color, display: 'flex', alignItems: 'center', gap: 4,
                }}>
                    <span style={{ animation: 'blink 1s step-end infinite' }}>▮</span> VEZ DELE
                </div>
            )}
        </div>
    );
}

function StatusBadge({ status }) {
    const cfg = {
        FINISHED: { label: 'ENCERRADO', color: '#ff2d55' },
        WAITING_PLAYERS: { label: 'ESPERANDO JOGADORES', color: '#ffe600' },
        PAUSED: { label: 'PAUSADO', color: '#00e5ff' },
    }[status] ?? { label: 'EM ANDAMENTO', color: '#00ff88' };

    return (
        <div style={{
            fontFamily: 'Orbitron', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.15em',
            color: cfg.color, textShadow: `0 0 6px ${cfg.color}`,
            border: `1px solid ${cfg.color}`, padding: '4px 12px',
            background: `${cfg.color}11`,
        }}>
            {cfg.label}
        </div>
    );
}

export default function ViewGame({ gameId, gameData }) {
    const [localGame, setLocalGame] = useState(null);
    const [loading, setLoading] = useState(!gameData && !!gameId);

    useEffect(() => {
        if (gameData) return;
        if (!gameId) return;
        setLoading(true);
        getGame(gameId)
            .then(setLocalGame)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [gameId]);

    const game = gameData ?? localGame;

    if (loading) {
        return (
            <div style={{ border: '1px solid #1e3a4a', background: '#0d1117', padding: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 16, height: 16, border: '2px solid #00ff88', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                <span style={{ fontFamily: 'Share Tech Mono', color: '#00ff8888', fontSize: '0.85rem', letterSpacing: '0.1em' }}>CARREGANDO TABULEIRO...</span>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } } @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }`}</style>
            </div>
        );
    }

    if (!game) return null;

    const turingPlayer = game.turing_player;
    const lovelacePlayer = game.lovelace_player;
    const isFinished = game.status === 'FINISHED';

    const turingIsWinner = isFinished && game.winner_player_id === turingPlayer?.id;
    const lovelaceIsWinner = isFinished && game.winner_player_id === lovelacePlayer?.id;

    // current_turn_team_id: 1 = turing, 2 = lovelace
    const turingTurn = !isFinished && game.current_turn_team_id === 1;
    const lovelaceTurn = !isFinished && game.current_turn_team_id === 2;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <style>{`
        @keyframes spin  { to { transform: rotate(360deg); } }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
      `}</style>

            {/* VS Header */}
            <div style={{ display: 'flex', alignItems: 'stretch', gap: 12 }}>
                <PlayerCard player={turingPlayer} team={TEAM_TURING} isWinner={turingIsWinner} isCurrentTurn={turingTurn} />

                {/* VS divider */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '0 8px' }}>
                    <div style={{ fontFamily: 'Orbitron', fontWeight: 900, fontSize: '1.2rem', color: '#2a4a5a', letterSpacing: '0.1em' }}>VS</div>
                    <StatusBadge status={game.status} />
                    {!isFinished && (
                        <div style={{ fontFamily: 'Share Tech Mono', fontSize: '0.6rem', color: '#4a6a7a', letterSpacing: '0.1em', textAlign: 'center' }}>
                            TURNO {game.current_turn_number}
                        </div>
                    )}
                </div>

                <PlayerCard player={lovelacePlayer} team={TEAM_LOVELACE} isWinner={lovelaceIsWinner} isCurrentTurn={lovelaceTurn} />
            </div>

            {/* Board */}
            <div style={{
                border: '1px solid #1e3a4a',
                background: '#080c10',
                padding: 16,
            }}>
                {/* Legend */}
                <div style={{ display: 'flex', gap: 16, marginBottom: 12, flexWrap: 'wrap', alignItems: 'center' }}>
                    <span style={{ fontFamily: 'Orbitron', fontSize: '0.55rem', letterSpacing: '0.15em', color: '#2a4a5a' }}>LEGENDA:</span>
                    {[0, 1, 2, 3, 4].map((lvl) => (
                        <div key={lvl} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                            <div style={{ width: 10, height: 10, border: `1px solid ${LEVEL_CONFIG[lvl].border}`, background: LEVEL_CONFIG[lvl].bg }} />
                            <span style={{ fontFamily: 'Share Tech Mono', fontSize: '0.55rem', color: LEVEL_CONFIG[lvl].text }}>
                                {lvl === 0 ? 'VAZIO' : lvl === 4 ? 'GRADUADA' : `NÍV. ${lvl}`}
                            </span>
                        </div>
                    ))}
                    <div style={{ marginLeft: 'auto', display: 'flex', gap: 12 }}>
                        {[TEAM_TURING, TEAM_LOVELACE].map((t) => (
                            <div key={t.name} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                                <div style={{ width: 10, height: 10, borderRadius: '50%', background: t.bg, border: `1px solid ${t.color}`, boxShadow: `0 0 4px ${t.glow}` }} />
                                <span style={{ fontFamily: 'Orbitron', fontSize: '0.55rem', color: t.color }}>{t.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(5, 1fr)',
                    gap: 6,
                    maxWidth: 420,
                    margin: '0 auto',
                }}>
                    {game.board?.map((row, r) =>
                        row.map((cell, c) => <Cell key={`${r}-${c}`} cell={cell} />)
                    )}
                </div>

                {/* Coordinates hint */}
                <div style={{ marginTop: 8, display: 'flex', justifyContent: 'center' }}>
                    <span style={{ fontFamily: 'Share Tech Mono', fontSize: '0.55rem', color: '#1e3a4a', letterSpacing: '0.1em' }}>
                        TABULEIRO 5×5
                    </span>
                </div>
            </div>

            {/* Phase info */}
            {!isFinished && game.current_turn_phase && (
                <div style={{ fontFamily: 'Share Tech Mono', fontSize: '0.65rem', color: '#4a6a7a', letterSpacing: '0.1em', textAlign: 'right' }}>
                    FASE: <span style={{ color: '#00ff8888' }}>{game.current_turn_phase.toUpperCase().replace('_', ' ')}</span>
                </div>
            )}
        </div>
    );
}