/**
 * TemplateSelector Component
 *
 * Displays available templates and allows selection/editing.
 */

import classNames from 'classnames';

import { resolveAssetPath } from '../resolveAssetPath';
import type { Template } from '../types';

import styles from './TemplateSelector.module.css';

interface TemplateSelectorProps {
  templates: Record<string, Template>;
  selectedTemplateName: string;
  onSelect: (templateName: string) => void;
  onEdit: () => void;
}

export function TemplateSelector({
  templates,
  selectedTemplateName,
  onSelect,
  onEdit
}: TemplateSelectorProps) {
  return (
    <div className={styles.container}>
      {Object.entries(templates).map(([templateName, template]) => {
        const isSelected = templateName === selectedTemplateName;

        return (
          <div
            key={templateName}
            role="button"
            tabIndex={0}
            className={classNames(styles.button, {
              [styles.buttonSelected]: isSelected
            })}
            onClick={() => {
              if (!isSelected) {
                onSelect(templateName);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !isSelected) {
                onSelect(templateName);
              }
            }}
          >
            <div className={styles.imageWrapper}>
              <img
                src={template.previewImagePath}
                alt={template.label}
                className={styles.preview}
              />
              {isSelected && (
                <div className={styles.editOverlay}>
                  <button
                    type="button"
                    className={styles.editButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit();
                    }}
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
      })}
    </div>
  );
}
