/**
 * Icon component that loads SVGs from public/icons and supports currentColor
 * via CSS mask-image technique.
 */

import { resolveAssetPath } from '../resolveAssetPath';
import styles from './Icon.module.css';

interface IconProps {
  name: 'fullscreen' | 'fullscreen-leave' | 'edit' | 'download';
  className?: string;
}

export function Icon({ name, className = '' }: IconProps) {
  const iconUrl = resolveAssetPath(`/icons/${name}.svg`);

  return (
    <span
      className={`${styles.icon} ${className}`}
      style={{
        maskImage: `url(${iconUrl})`,
        WebkitMaskImage: `url(${iconUrl})`
      }}
      aria-hidden="true"
    />
  );
}
