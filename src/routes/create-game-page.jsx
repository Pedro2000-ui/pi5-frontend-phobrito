import { cn } from '@core/helpers';
import { createGame, registerSpectator } from '@feature/game/api';
import { useGameContext } from '@feature/game/context/game-context';
import { Typography } from '@ui/text/typography';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router';

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

function ToggleButton({ value, onChange, options }) {
    return (
        <div style={{ display: 'flex', gap: 0 }}>
            {options.map((opt) => {
                const active = value === opt.value;
                return (
                    <button
                        key={opt.value}
                        type="button"
                        onClick={() => onChange(opt.value)}
                        style={{
                            fontFamily: 'Orbitron',
                            fontSize: '0.65rem',
                            fontWeight: 700,
                            letterSpacing: '0.1em',
                            padding: '10px 20px',
                            background: active ? '#00ff8822' : 'transparent',
                            border: `1px solid ${active ? '#00ff88' : '#1e3a4a'}`,
                            color: active ? '#00ff88' : '#4a6a7a',
                            textShadow: active ? '0 0 6px #00ff88' : 'none',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            marginLeft: -1,
                        }}
                    >
                        {opt.label}
                    </button>
                );
            })}
        </div>
    );
}

export function CreateGamePage() {
    const { player, setSpectator } = useGameContext();
    const navigate = useNavigate();

    const [teamSlot, setTeamSlot] = useState('1');
    const [vsRandomBot, setVsRandomBot] = useState(false);
    const [autoStart, setAutoStart] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    async function handleSubmit(e) {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            const game = await createGame({
                player_id: player?.id,
                team_slot: teamSlot,
                vs_random_bot: vsRandomBot,
                auto_start: autoStart,
            });

            // Registra automaticamente como espectador com os dados do jogador
            try {
                const spectatorData = await registerSpectator(game.id, {
                    spectator_name: player?.ai_player_name || `Jogador #${player?.id}`,
                    spectator_avatar: player?.ai_player_avatar || 'https://example.com/avatar.png',
                });
                setSpectator(spectatorData);
            } catch (specErr) {
                console.warn('Não foi possível registrar como espectador automaticamente:', specErr);
            }

            navigate(`/spectate/${game.id}`);
        } catch (err) {
            console.error(err);
            setError('Erro ao criar partida. Verifique os dados e tente novamente.');
        } finally {
            setLoading(false);
        }
    }

    if (!player) {
        return (
            <div className={cn('flex flex-col gap-6 py-8 flex-1')}>
                <div style={{ border: '1px solid #ffe60044', background: '#0d1008', padding: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, textAlign: 'center' }}>
                    <div style={{ fontSize: '2rem' }}>⚠</div>
                    <div style={{ fontFamily: 'Orbitron', fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.15em', color: '#ffe600' }}>
                        ACESSO RESTRITO
                    </div>
                    <p style={{ fontFamily: 'Exo 2', color: '#8a9ab0', fontSize: '0.9rem' }}>
                        Você precisa estar registrado como jogador para criar uma partida.
                    </p>
                    <Link to="/player" style={{ fontFamily: 'Orbitron', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.2em', padding: '12px 28px', background: '#ffe60011', border: '1px solid #ffe600', color: '#ffe600', textDecoration: 'none' }}>
                        ▶ IR PARA REGISTRO DE JOGADOR
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className={cn('flex flex-col gap-6 py-8 flex-1')}>
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div style={{ width: 4, height: 40, background: '#00e5ff', boxShadow: '0 0 12px #00e5ff' }} />
                    <div>
                        <Typography variant={'h1'} asTag={'h1'} className={cn('text-3xl')} style={{ color: '#00e5ff', textShadow: '0 0 20px #00e5ff55' }}>
                            CRIAR PARTIDA
                        </Typography>
                        <p style={{ fontFamily: 'Share Tech Mono', fontSize: '0.7rem', color: '#00e5ff66', marginTop: 2 }}>
                            CONFIGURE OS PARÂMETROS DA NOVA PARTIDA
                        </p>
                    </div>
                </div>
                <Link
                    to="/"
                    style={{ fontFamily: 'Orbitron', fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.15em', color: '#6a8a9a', textDecoration: 'none', padding: '6px 12px', border: '1px solid #1e3a4a', transition: 'all 0.2s' }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = '#c8d8e0'; e.currentTarget.style.borderColor = '#3a5a6a'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = '#6a8a9a'; e.currentTarget.style.borderColor = '#1e3a4a'; }}
                >
                    ‹ VOLTAR
                </Link>
            </div>

            <div style={{ border: '1px solid #1e3a4a', background: '#0d1117', padding: '28px', maxWidth: 560 }}>
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">

                    {/* Player ID (readonly) */}
                    <div className="flex flex-col">
                        <label style={labelStyle}>JOGADOR</label>
                        <input
                            style={{ ...inputStyle, color: '#6a8a9a', cursor: 'not-allowed' }}
                            type="text"
                            readOnly
                            value={`#${player?.id} — ${player?.ai_player_name || 'Jogador'}`}
                        />
                    </div>

                    {/* Team slot */}
                    <div className="flex flex-col gap-2">
                        <label style={labelStyle}>SLOT DO TIME</label>
                        <ToggleButton
                            value={teamSlot}
                            onChange={setTeamSlot}
                            options={[
                                { value: '1', label: 'TIME 1' },
                                { value: '2', label: 'TIME 2' },
                            ]}
                        />
                    </div>

                    {/* vs random bot */}
                    <div className="flex flex-col gap-2">
                        <label style={labelStyle}>ADVERSÁRIO</label>
                        <ToggleButton
                            value={vsRandomBot}
                            onChange={setVsRandomBot}
                            options={[
                                { value: false, label: 'AGUARDAR JOGADOR' },
                                { value: true, label: 'BOT ALEATÓRIO' },
                            ]}
                        />
                    </div>

                    {/* auto start */}
                    <div className="flex flex-col gap-2">
                        <label style={labelStyle}>INÍCIO</label>
                        <ToggleButton
                            value={autoStart}
                            onChange={setAutoStart}
                            options={[
                                { value: false, label: 'MANUAL' },
                                { value: true, label: 'AUTOMÁTICO' },
                            ]}
                        />
                        <p style={{ fontFamily: 'Share Tech Mono', fontSize: '0.65rem', color: '#4a6a7a', marginTop: 2 }}>
                            {autoStart
                                ? 'A partida inicia automaticamente quando o segundo jogador entrar.'
                                : 'A partida só inicia quando você acionar manualmente.'}
                        </p>
                    </div>

                    {error && (
                        <div style={{ padding: '10px 14px', border: '1px solid #ff2d55', background: '#1a0810', fontFamily: 'Share Tech Mono', fontSize: '0.75rem', color: '#ff2d55' }}>
                            ⚠ {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            padding: '14px 28px',
                            background: loading ? '#0a1520' : '#00e5ff11',
                            border: '1px solid #00e5ff',
                            color: '#00e5ff',
                            fontFamily: 'Orbitron',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            letterSpacing: '0.2em',
                            textShadow: loading ? 'none' : '0 0 8px #00e5ff',
                            boxShadow: loading ? 'none' : '0 0 16px #00e5ff22',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            opacity: loading ? 0.5 : 1,
                            transition: 'all 0.2s',
                            alignSelf: 'flex-start',
                        }}
                        onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = '#00e5ff33'; }}
                        onMouseLeave={(e) => { if (!loading) e.currentTarget.style.background = '#00e5ff11'; }}
                    >
                        {loading ? 'CRIANDO PARTIDA...' : '▶ CRIAR PARTIDA'}
                    </button>
                </form>
            </div>
        </div>
    );
}