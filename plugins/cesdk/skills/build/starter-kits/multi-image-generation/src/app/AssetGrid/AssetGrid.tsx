import classNames from 'classnames';

import type { Template, GeneratedAsset } from '../types';
import { resolveAssetPath } from '../resolveAssetPath';

import styles from './AssetGrid.module.css';

interface AssetGridProps {
  templates: Template[];
  assets: GeneratedAsset[];
  onEdit: (template: Template, index: number) => void;
}

function EditIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
    </svg>
  );
}

export default function AssetGrid({
  templates,
  assets,
  onEdit
}: AssetGridProps) {
  return (
    <section className={styles.section}>
      <h3 className={styles.title}>Generated Assets</h3>
      <div className={styles.grid}>
        {templates.map((template, index) => {
          const asset = assets[index];
          return (
            <div
              key={template.label}
              className={classNames(styles.wrapper, {
                [styles.loading]: asset.isLoading
              })}
              style={{ width: template.width }}
            >
              <img
                src={asset.src || resolveAssetPath(template.previewImagePath)}
                width={template.width}
                height={template.height}
                alt={`${template.label} template`}
              />

              {asset.isLoading && <div className={styles.spinner} />}

              <div className={styles.overlay}>
                <button
                  className={styles.editButton}
                  onClick={() => onEdit(template, index)}
                >
                  <EditIcon />
                  <span>Edit</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
