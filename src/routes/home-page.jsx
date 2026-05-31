
import { cn } from '@core/helpers';
import { listGames } from '@feature/game/api';
import { Typography } from '@ui/text/typography';
import { useEffect, useState } from 'react';
import { Link } from 'react-router';

export function HomePage() {
  const [partidas, setPartidas] = useState({});
  const [loading, setloading] = useState(true);
  const [error, setError] = useState(null);

  async function buscarPartidas() {
    setloading(true);

    try {

      const response = await listGames();
      setPartidas(response)

    } catch (error) {
      console.error(error);
      setError(error);
    } finally {
      setloading(false);
    }

  }

  useEffect(() => {
    buscarPartidas();
  }, []);

  return (
    <div className={cn('flex flex-col gap-4 py-8', 'flex-1')}>
      <Typography
        variant={'h1'}
        asTag={'h1'}
        className={cn('text-4xl', 'font-bold')}
      >
        Partidas
      </Typography>

      {loading && <h3> Carregando partidas... </h3>}
      {error && <h3> {error} </h3>}

      {partidas?.items?.map((game, g) => {
        return (
          <div
            key={g}
            className={cn('p-4', 'bg-white', 'rounded-md', 'shadow')}
          >
            <Typography
              variant={'span'}
              asTag={'p'}
              className={cn('text-xs', 'font-semibold')}
            >
              #{game.id}
            </Typography>

            <Typography
              variant={'h5'}
              asTag={'h5'}
            >
              Status: {game?.status}
            </Typography>

            <Link
              to={`/spectate/${game.id}`}
              className={cn(
                'mt-2',
                'px-4',
                'py-2',
                'bg-blue-500',
                'text-white',
                'rounded-md',
                'hover:bg-blue-600',
                'transition-colors'
              )}
            >
              Assistir

            </Link>
          </div>
        )
      })}

    </div>
  );
}
