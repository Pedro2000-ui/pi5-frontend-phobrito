import { cn } from '@core/helpers';
import { SpectateGame } from '@feature/game/components/spectate-game';
import { Typography } from '@ui/text/typography';
import { useParams } from 'react-router';

export function SpectatePage() {
  const { gameId } = useParams();

  return (
    <div className={cn('flex flex-col gap-6 py-8', 'flex-1')}>
      <div className="flex items-center gap-4">
        <div style={{ width: 4, height: 40, background: '#ffe600', boxShadow: '0 0 12px #ffe600' }} />
        <div>
          <Typography variant={'h1'} asTag={'h1'} className={cn('text-3xl')} style={{ color: '#ffe600', textShadow: '0 0 20px #ffe60055' }}>
            ASSISTINDO
          </Typography>
          <p style={{ fontFamily: 'Share Tech Mono', fontSize: '0.65rem', color: '#ffe60088', marginTop: 2 }}>
            PARTIDA #{gameId}
          </p>
        </div>
      </div>

      <SpectateGame gameId={gameId} />
    </div>
  );
}
