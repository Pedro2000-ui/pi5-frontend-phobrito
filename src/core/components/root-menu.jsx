import { cn } from '@core/helpers';
import { useGameContext } from '@feature/game/context/game-context';
import { Container } from '@ui/layout/container';
import { Link, useNavigate, useResolvedPath } from 'react-router';

export function RootMenu() {
  const { player, logout } = useGameContext();
  const navigate = useNavigate();
  const resolvedPath = useResolvedPath();

  const isActive = (to, exact = false) =>
    exact
      ? resolvedPath.pathname === to
      : resolvedPath.pathname.startsWith(to);

  const linkStyle = (active) => ({
    fontFamily: 'Orbitron, sans-serif',
    fontSize: '0.72rem',
    fontWeight: 600,
    letterSpacing: '0.15em',
    padding: '10px 20px',
    borderBottom: active ? '2px solid #00ff88' : '2px solid transparent',
    color: active ? '#00ff88' : '#6a8a9a',
    textShadow: active ? '0 0 8px #00ff88' : 'none',
    transition: 'all 0.2s',
    textDecoration: 'none',
    display: 'block',
  });

  const navLinks = [
    { to: '/', label: 'HOME', exact: true },
    { to: '/about', label: 'SOBRE', exact: false },
    { to: '/player', label: 'JOGADOR', exact: false },
  ];

  if (player) {
    navLinks.push({ to: '/games/create', label: '+ CRIAR PARTIDA', exact: false });
  }

  return (
    <div style={{ background: '#0a0e14', borderBottom: '1px solid #1e3a4a' }}>
      <Container>
        <nav id={'root-menu'} className={cn('flex flex-row gap-0 items-stretch')}>
          {navLinks.map(({ to, label, exact }) => {
            const active = isActive(to, exact);
            return (
              <Link
                key={to}
                to={to}
                style={linkStyle(active)}
                onMouseEnter={(e) => { if (!active) { e.target.style.color = '#c8d8e0'; e.target.style.borderBottomColor = '#1e3a4a'; } }}
                onMouseLeave={(e) => { if (!active) { e.target.style.color = '#6a8a9a'; e.target.style.borderBottomColor = 'transparent'; } }}
              >
                {label}
              </Link>
            );
          })}

          {player && (
            <button
              type="button"
              style={{
                marginLeft: 'auto',
                fontFamily: 'Orbitron',
                fontSize: '0.65rem',
                fontWeight: 600,
                letterSpacing: '0.1em',
                padding: '8px 16px',
                background: 'transparent',
                border: '1px solid #ff2d55',
                color: '#ff2d55',
                textShadow: '0 0 6px #ff2d5588',
                cursor: 'pointer',
                alignSelf: 'center',
                transition: 'all 0.2s',
              }}
              onClick={() => { logout(); navigate('/', { replace: true }); }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#ff2d5522'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
            >
              SAIR [{player.ai_player_name || `#${player.id}`}]
            </button>
          )}
        </nav>
      </Container>
    </div>
  );
}