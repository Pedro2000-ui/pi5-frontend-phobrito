import { cn } from '@core/helpers';
import { Typography } from '@ui/text/typography';

export function AboutPage() {
  return (
    <div className={cn('flex flex-col gap-4 py-8', 'flex-1')}>
      <Typography
        variant={'h1'}
        asTag={'h1'}
        className={cn('text-4xl', 'font-bold')}
      >
        Sobre
      </Typography>
    </div>
  );
}
