import { cn } from '@core/helpers';
import { cva } from 'class-variance-authority';

const typographyVariants = cva('', {
  variants: {
    variant: {
      h1: 'text-4xl font-bold',
      h2: 'text-3xl font-semibold',
      h3: 'text-2xl font-medium',
      h4: 'text-xl font-medium',
      h5: 'text-lg font-medium',
      h6: 'text-base font-medium',
      p: 'text-base',
      span: 'text-base',
    },
  },
  defaultVariants: {
    variant: 'p',
  },
});

const variantStyles = {
  h1: {
    fontFamily: 'Orbitron, sans-serif',
    fontWeight: 800,
    letterSpacing: '0.1em',
    color: '#00ff88',
    textShadow: '0 0 20px #00ff8855',
  },
  h2: {
    fontFamily: 'Orbitron, sans-serif',
    fontWeight: 700,
    letterSpacing: '0.08em',
    color: '#00e5ff',
    textShadow: '0 0 15px #00e5ff44',
  },
  h3: {
    fontFamily: 'Orbitron, sans-serif',
    fontWeight: 600,
    letterSpacing: '0.06em',
    color: '#c8d8e0',
  },
  h4: { fontFamily: 'Exo 2, sans-serif', fontWeight: 700, color: '#c8d8e0' },
  h5: { fontFamily: 'Exo 2, sans-serif', fontWeight: 600, color: '#c8d8e0' },
  h6: { fontFamily: 'Exo 2, sans-serif', fontWeight: 500, color: '#8a9ab0' },
  p: { fontFamily: 'Exo 2, sans-serif', color: '#8a9ab0', lineHeight: 1.7 },
  span: { fontFamily: 'Share Tech Mono, monospace', color: '#00ff8899' },
};

export function Typography({
  asTag,
  children,
  className,
  variant = 'p',
  ...props
}) {
  const Tag = asTag || 'p';

  return (
    <Tag
      className={cn(typographyVariants({ variant }), className)}
      style={variantStyles[variant] || {}}
      {...props}
    >
      {children}
    </Tag>
  );
}
