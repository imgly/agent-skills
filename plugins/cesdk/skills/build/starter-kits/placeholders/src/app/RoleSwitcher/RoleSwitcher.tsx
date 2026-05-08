/**
 * RoleSwitcher Component
 *
 * A segmented control for switching between Creator and Adopter roles.
 * Pure UI component that emits callbacks.
 */

import classNames from 'classnames';

import styles from './RoleSwitcher.module.css';

// ============================================================================
// Types
// ============================================================================

type Role = 'Creator' | 'Adopter';

interface RoleSwitcherProps {
  /** Currently selected role */
  value: Role;
  /** Callback when role changes */
  onChange: (role: Role) => void;
}

// ============================================================================
// Constants
// ============================================================================

const ROLES: Role[] = ['Creator', 'Adopter'];

// ============================================================================
// Component
// ============================================================================

// highlight-role-switcher
export default function RoleSwitcher({ value, onChange }: RoleSwitcherProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.controlWrapper}>
        <div className={styles.control}>
          {ROLES.map((role) => (
            <button
              key={role}
              type="button"
              className={classNames(styles.button, {
                [styles.active]: role === value
              })}
              onClick={() => onChange(role)}
            >
              {role}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
// highlight-role-switcher
