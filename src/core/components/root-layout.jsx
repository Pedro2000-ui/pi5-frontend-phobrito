import { Outlet } from 'react-router';
import { RootMenu } from './root-menu';
import { Container } from '@ui/layout/container';
import { Typography } from '@ui/text/typography';
import { cn } from '@core/helpers';

export function RootLayout() {
  return (
    <div
      className={cn('w-dvw min-h-dvh', 'flex flex-col gap-0', 'bg-gray-100')}
    >
      <header id={'site-header'} className={cn('bg-neutral-600 text-white')}>
        <Container className={cn('p-4')}>
          <Typography variant={'h1'} asTag={'h1'}>
            PI5
          </Typography>
        </Container>
      </header>

      <RootMenu />

      <main id={'site-main'} className={cn('flex-1', 'flex flex-col')}>
        <Container className={cn('px-4', 'flex-1')}>
          <Outlet />
        </Container>
      </main>

      <footer id={'site-footer'} className={cn('bg-neutral-700', 'text-white')}>
        <Container className={cn('p-4')}>
          <Typography
            variant={'p'}
            asTag={'p'}
            className={cn('text-xs', 'font-bold', 'opacity-50')}
          >
            &copy;2026 PI5
          </Typography>
        </Container>
      </footer>
    </div>
  );
}
