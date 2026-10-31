import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react';
import { useMagnetic } from '../hooks/useMagnetic';
import { cx } from '../lib/cx';
import styles from './Button.module.css';

type AnchorVariant = AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };
type ButtonVariant = ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };
type MagneticButtonProps = AnchorVariant | ButtonVariant;

function MagneticAnchor({ className, children, ...rest }: AnchorVariant) {
  const ref = useMagnetic<HTMLAnchorElement>();
  return (
    <a ref={ref} className={cx(styles.button, className)} {...rest}>
      {children}
    </a>
  );
}

function MagneticNativeButton({ className, children, type = 'button', ...rest }: ButtonVariant) {
  const ref = useMagnetic<HTMLButtonElement>();
  return (
    <button ref={ref} type={type} className={cx(styles.button, className)} {...rest}>
      {children}
    </button>
  );
}

export function MagneticButton(props: MagneticButtonProps) {
  if (props.href !== undefined) return <MagneticAnchor {...props} />;
  return <MagneticNativeButton {...props} />;
}
