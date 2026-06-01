import { Outlet } from 'react-router';
import { RootMenu } from './root-menu';
import { Container } from '@ui/layout/container';
import { cn } from '@core/helpers';

export function RootLayout() {
  return (
    <div className={cn('w-dvw min-h-dvh', 'flex flex-col gap-0')} style={{ background: '#080c10' }}>
      {/* Header */}
      <header
        id={'site-header'}
        style={{
          background: 'linear-gradient(90deg, #080c10 0%, #0d1a0f 50%, #080c10 100%)',
          borderBottom: '1px solid #00ff8833',
          boxShadow: '0 0 30px #00ff8822',
        }}
      >
        <Container className={cn('p-4 flex-row items-center justify-between')}>
          <div className="flex items-center gap-3">
            <div
              style={{
                width: 36,
                height: 36,
                border: '2px solid #00ff88',
                transform: 'rotate(45deg)',
                boxShadow: '0 0 12px #00ff88',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div style={{ transform: 'rotate(-45deg)', color: '#00ff88', fontSize: 12, fontFamily: 'Orbitron', fontWeight: 900 }}>
                P5
              </div>
            </div>
            <h1
              style={{
                fontFamily: 'Orbitron, sans-serif',
                fontWeight: 900,
                fontSize: '1.5rem',
                letterSpacing: '0.2em',
                color: '#00ff88',
                textShadow: '0 0 10px #00ff88, 0 0 30px #00ff8855',
              }}
              className="animate-flicker"
            >
              PI5<span style={{ color: '#00e5ff', textShadow: '0 0 10px #00e5ff' }}>::</span>ARENA
            </h1>
          </div>

          <div style={{ fontFamily: 'Share Tech Mono', fontSize: '0.65rem', color: '#00ff8866', letterSpacing: '0.1em' }}>
            SISTEMA ONLINE <span className="animate-blink">▮</span>
          </div>
        </Container>
      </header>

      <RootMenu />

      <main id={'site-main'} className={cn('flex-1', 'flex flex-col')}>
        <Container className={cn('px-4 py-2', 'flex-1')}>
          <Outlet />
        </Container>
      </main>

      <footer
        id={'site-footer'}
        style={{
          borderTop: '1px solid #1e3a4a',
          background: '#080c10',
        }}
      >
        <Container className={cn('p-4')}>
          <p
            style={{
              fontFamily: 'Share Tech Mono',
              fontSize: '0.7rem',
              color: '#00ff8844',
              letterSpacing: '0.15em',
            }}
          >
            &copy; 2026 PI5 — PHOBRITO O BRABO
          </p>
        </Container>
      </footer>
    </div>
  );
}
