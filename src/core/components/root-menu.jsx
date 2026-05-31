import { cn } from '@core/helpers';
import { useGameContext } from '@feature/game/context/game-context';
import { Container } from '@ui/layout/container';
import { Link, useNavigate, useResolvedPath } from 'react-router';

export function RootMenu() {
  const { player, logout } = useGameContext();
  const navigate = useNavigate();
  const resolvedPath = useResolvedPath();

  return (
    <div className={cn('bg-neutral-900 text-white')}>
      <Container>
        <nav id={'root-menu'} className={cn('flex flex-row gap-4')}>
          <Link
            to={'/'}
            className={cn(
              'text-lg',
              'p-2 px-4',
              'hover:bg-neutral-700',
              'transition-all',
              {
                'bg-neutral-700': resolvedPath.pathname === '/',
              }
            )}
          >
            Home
          </Link>
          <Link
            to={'/about'}
            className={cn(
              'text-lg',
              'p-2 px-4',
              'hover:bg-neutral-700',
              'transition-all',
              {
                'bg-neutral-700': resolvedPath.pathname.startsWith('/about'),
              }
            )}
          >
            Sobre
          </Link>
          <Link
            to={'/player'}
            className={cn(
              'text-lg',
              'p-2 px-4',
              'hover:bg-neutral-700',
              'transition-all',
              {
                'bg-neutral-700': resolvedPath.pathname.startsWith('/player'),
              }
            )}
          >
            Jogador
          </Link>

          {player && (
            <button
              type="button"
              className={cn(
                'text-lg',
                'p-2 px-4',
                'bg-red-500',
                'hover:bg-red-700',
                'transition-all',
                'ml-auto'
              )}
              onClick={() => {
                logout();
                navigate('/', {
                  replace: true,
                });
              }}
            >
              Sair ({player.ai_player_name})
            </button>
          )}
        </nav>
      </Container>
    </div>
  );
}
