import { useEffect, useState } from 'react';
import { useGameContext } from '../context/game-context';
import { Typography } from '@ui/text/typography';
import { SpectatorRegisterForm } from './spectator-register-form';
import { Link } from 'react-router';
// import ViewGame from './view-game';

export function SpectateGame({ gameId }) {
  const { spectator: storedSpectator } = useGameContext();

  const [spectator, setSpectator] = useState(() => {
    if (storedSpectator?.[gameId]) return storedSpectator?.[gameId];
    return null;
  });

  useEffect(() => {
    if (storedSpectator?.[gameId]) setSpectator(storedSpectator?.[gameId]);
  }, [storedSpectator]);

  return (
    <>
      {!spectator && (
        <div style={{ border: '1px solid #1e3a4a', background: '#0d1117', padding: '24px' }}>
          {/* Back button */}
          <Link
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              fontFamily: 'Orbitron, sans-serif',
              fontSize: '0.6rem',
              fontWeight: 600,
              letterSpacing: '0.15em',
              color: '#6a8a9a',
              textDecoration: 'none',
              marginBottom: 24,
              padding: '6px 12px',
              border: '1px solid #1e3a4a',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#c8d8e0'; e.currentTarget.style.borderColor = '#3a5a6a'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = '#6a8a9a'; e.currentTarget.style.borderColor = '#1e3a4a'; }}
          >
            ‹ VOLTAR PARA HOME
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{ width: 3, height: 32, background: '#ffe600', boxShadow: '0 0 8px #ffe600' }} />
            <Typography variant={'h3'} style={{ fontFamily: 'Orbitron', fontSize: '0.85rem', letterSpacing: '0.1em', color: '#ffe600', textShadow: '0 0 10px #ffe60055' }}>
              REGISTRO DE ESPECTADOR
            </Typography>
          </div>

          <Typography variant={'p'} style={{ marginBottom: 20, fontSize: '0.85rem' }}>
            Para assistir a um jogo, você precisa se registrar como espectador.
            Preencha o formulário abaixo para obter seu token de acesso.
          </Typography>

          <SpectatorRegisterForm gameId={gameId} />
        </div>
      )}

      {/* {spectator && <ViewGame gameId={gameId} />} */}
    </>
  );
}
