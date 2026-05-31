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

export function Typography({
  asTag,
  children,
  className,
  variant = 'p',
  ...props
}) {
  const Tag = asTag || 'p';

  return (
    <Tag className={cn(typographyVariants({ variant }), className)} {...props}>
      {children}
    </Tag>
  );
}
