/**
 * EmployeeCard Component
 *
 * Displays a generated employee card with edit functionality.
 */

import classNames from 'classnames';

import { resolveAssetPath } from '../resolveAssetPath';
import type { TeamImage } from '../types';

import styles from './EmployeeCard.module.css';

interface EmployeeCardProps {
  teamImage: TeamImage;
  width: number;
  height: number;
  onEdit: (teamImage: TeamImage) => void;
}

export function EmployeeCard({
  teamImage,
  width,
  height,
  onEdit
}: EmployeeCardProps) {
  const { employee, isLoading, src } = teamImage;

  return (
    <div className={styles.card} style={{ width: width + 40 }}>
      <div className={styles.imageContainer} style={{ width, height }}>
        {isLoading && <div className={styles.loadingSpinner} />}
        <img
          src={src}
          alt={`${employee.firstName} ${employee.lastName}`}
          className={classNames(styles.image, {
            [styles.imageLoading]: isLoading
          })}
        />
        {!isLoading && (
          <div className={styles.editOverlay}>
            <button
              type="button"
              className={styles.editButton}
              onClick={() => onEdit(teamImage)}
            >
              <img
                src={resolveAssetPath('./icons/edit.svg')}
                alt=""
                width={16}
                height={16}
              />
              <span>Edit</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
