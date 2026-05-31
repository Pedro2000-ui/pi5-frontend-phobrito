import { cn } from '@core/helpers';
import { cva } from 'class-variance-authority';

const containerVariants = cva('flex flex-col', {
  variants: {
    variant: {
      default: 'container w-full mx-auto',
      clean: '',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export function Container({ className, variant = 'default', ...props }) {
  return (
    <div className={cn(containerVariants({ variant }), className)} {...props} />
  );
}
