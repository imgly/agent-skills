import type { Template } from '../../imgly';
import { TemplateCard } from '../TemplateCard/TemplateCard';

import styles from './TemplateSection.module.css';

interface TemplateSectionProps {
  templates: Template[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  onEdit: (template: Template) => void;
  onGenerate: () => void;
}

export function TemplateSection({
  templates,
  selectedIndex,
  onSelect,
  onEdit,
  onGenerate
}: TemplateSectionProps) {
  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h4 className={styles.title}>Source Template</h4>
        <p className={styles.description}>
          This template will be used to generate the other sizes
        </p>
      </div>

      <div className={styles.grid}>
        {templates.map((template, index) => (
          <TemplateCard
            key={template.id}
            template={template}
            index={index}
            isSelected={index === selectedIndex}
            onClick={() => onSelect(index)}
            onEdit={() => onEdit(template)}
          />
        ))}
      </div>

      <div className={styles.header}>
        <button className={styles.button} onClick={onGenerate}>
          Generate
        </button>
      </div>
    </section>
  );
}
