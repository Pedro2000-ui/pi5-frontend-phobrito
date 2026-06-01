import { cn } from '@core/helpers';
import { Typography } from '@ui/text/typography';

export function AboutPage() {
  return (
    <div className={cn('flex flex-col gap-6 py-8', 'flex-1')}>
      <div className="flex items-center gap-4">
        <div style={{ width: 4, height: 40, background: '#00e5ff', boxShadow: '0 0 12px #00e5ff' }} />
        <Typography variant={'h1'} asTag={'h1'} className={cn('text-3xl')} style={{ color: '#00e5ff', textShadow: '0 0 20px #00e5ff55' }}>
          SOBRE
        </Typography>
      </div>

      <div style={{
        border: '1px solid #1e3a4a',
        background: '#0d1117',
        padding: '24px',
        fontFamily: 'Exo 2, sans-serif',
        color: '#8a9ab0',
        lineHeight: 1.7,
      }}>
        <p>Conteúdo sobre o projeto PI5.</p>
      </div>
    </div>
  );
}
