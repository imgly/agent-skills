/**
 * App Component - Main orchestrator for Batch Image Generation
 */

import type { Configuration } from '@cesdk/cesdk-js';
import { useCallback, useEffect, useState } from 'react';

import { batchRender } from '../imgly';

import { EMPLOYEES } from './constants';
import { resolveAssetPath } from './resolveAssetPath';
import { loadTemplates } from './templates';
import type { Employee, TeamImage, Template } from './types';
import { EditorModal } from './EditorModal/EditorModal';
import { EmployeeCard } from './EmployeeCard/EmployeeCard';
import { LoadingOverlay } from './LoadingOverlay/LoadingOverlay';
import { TemplateSelector } from './TemplateSelector/TemplateSelector';

import styles from './App.module.css';

/** Template variable names - must match the CE.SDK template */
const VAR_NAMES = {
  FIRST_NAME: 'FirstName',
  LAST_NAME: 'LastName',
  DEPARTMENT: 'Department'
};

/** Placeholder values for template preview */
const PLACEHOLDERS = {
  firstName: 'Firstname',
  lastName: 'Lastname',
  department: 'Department'
};

interface AppProps {
  config: Configuration;
}

type ModalState =
  | { type: 'closed' }
  | { type: 'template'; template: Template }
  | { type: 'instance'; teamImage: TeamImage };

export default function App({ config }: AppProps) {
  const [templates, setTemplates] = useState<Record<string, Template> | null>(
    null
  );
  const [currentTemplateName, setCurrentTemplateName] = useState('portrait');
  const [teamImages, setTeamImages] = useState<TeamImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalState, setModalState] = useState<ModalState>({ type: 'closed' });

  // Initialize app: load templates and render all employees
  useEffect(() => {
    let mounted = true;

    async function init() {
      try {
        const loadedTemplates = await loadTemplates();
        if (!mounted) return;

        setTemplates(loadedTemplates);
        await renderAllEmployees(loadedTemplates['portrait']);
      } catch (error) {
        console.error('Failed to initialize:', error); // eslint-disable-line no-console
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    init();
    return () => {
      mounted = false;
    };
  }, [config.license, config.baseURL]);

  // Render all employees with a template
  async function renderAllEmployees(template: Template) {
    // Set loading state
    setTeamImages(
      EMPLOYEES.map((emp) => ({
        isLoading: true,
        src: template.previewImagePath,
        sceneString: template.sceneString,
        employee: emp
      }))
    );

    // Build batch items
    const items = EMPLOYEES.map((emp) => ({
      images: { Photo: resolveAssetPath(`/images/${emp.imagePath}`) },
      variables: {
        [VAR_NAMES.FIRST_NAME]: emp.firstName,
        [VAR_NAMES.LAST_NAME]: emp.lastName,
        [VAR_NAMES.DEPARTMENT]: emp.department
      }
    }));

    // Render all at once
    const results = await batchRender(template.sceneString, items, {
      license: config.license,
      baseURL: config.baseURL,
      mimeType: template.outputFormat
    });

    // Update UI with results
    setTeamImages(
      EMPLOYEES.map((emp, i) => ({
        isLoading: false,
        src: URL.createObjectURL(results[i].blob),
        sceneString: results[i].sceneString,
        employee: emp
      }))
    );
  }

  // Handle template selection
  const handleSelectTemplate = useCallback(
    async (name: string) => {
      if (!templates) return;
      setCurrentTemplateName(name);
      await renderAllEmployees(templates[name]);
    },
    [templates, config]
  );

  // Handle template save from editor
  const handleSaveTemplate = useCallback(
    async (sceneString: string) => {
      if (!templates) return;
      const template = templates[currentTemplateName];

      // Render new preview (single item batch)
      const [preview] = await batchRender(sceneString, [{}], {
        license: config.license,
        baseURL: config.baseURL,
        mimeType: template.outputFormat
      });

      // Update template and re-render all employees
      const updated = {
        ...templates,
        [currentTemplateName]: {
          ...template,
          sceneString,
          previewImagePath: URL.createObjectURL(preview.blob)
        }
      };
      setTemplates(updated);
      setModalState({ type: 'closed' });
      await renderAllEmployees(updated[currentTemplateName]);
    },
    [templates, currentTemplateName, config]
  );

  // Handle instance save from editor
  const handleSaveInstance = useCallback(
    async (sceneString: string, employee: Employee) => {
      if (!templates) return;

      // Re-render with updated scene (single item batch)
      const [result] = await batchRender(
        sceneString,
        [
          {
            variables: {
              [VAR_NAMES.FIRST_NAME]: employee.firstName,
              [VAR_NAMES.LAST_NAME]: employee.lastName,
              [VAR_NAMES.DEPARTMENT]: employee.department
            }
          }
        ],
        {
          license: config.license,
          baseURL: config.baseURL,
          mimeType: templates[currentTemplateName].outputFormat
        }
      );

      // Update team image
      setTeamImages((prev) => {
        const idx = prev.findIndex((img) => img.employee.id === employee.id);
        if (idx === -1) return prev;
        const updated = [...prev];
        updated[idx] = {
          isLoading: false,
          src: URL.createObjectURL(result.blob),
          sceneString: result.sceneString,
          employee
        };
        return updated;
      });
      setModalState({ type: 'closed' });
    },
    [templates, currentTemplateName, config]
  );

  const currentTemplate = templates?.[currentTemplateName];

  return (
    <div className={styles.container}>
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Select a Template</h2>
        <p className={styles.sectionDescription}>
          Edit a template to change all images.
        </p>
        {templates && (
          <TemplateSelector
            templates={templates}
            selectedTemplateName={currentTemplateName}
            onSelect={handleSelectTemplate}
            onEdit={() =>
              setModalState({
                type: 'template',
                template: templates[currentTemplateName]
              })
            }
          />
        )}
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Generated Cards</h2>
        <p className={styles.sectionDescription}>
          Edit individual cards leaving all others unchanged.
        </p>
        {currentTemplate && (
          <div className={styles.employeeGrid}>
            {teamImages.map((img) => (
              <EmployeeCard
                key={img.employee.id}
                teamImage={img}
                width={currentTemplate.width}
                height={currentTemplate.height}
                onEdit={(teamImage) =>
                  setModalState({ type: 'instance', teamImage })
                }
              />
            ))}
          </div>
        )}
      </section>

      {modalState.type === 'template' && (
        <EditorModal
          type="template"
          title={modalState.template.label}
          sceneString={modalState.template.sceneString}
          variables={PLACEHOLDERS}
          config={config}
          onSave={handleSaveTemplate}
          onClose={() => setModalState({ type: 'closed' })}
        />
      )}

      {modalState.type === 'instance' && (
        <EditorModal
          type="instance"
          title={`${modalState.teamImage.employee.firstName} ${modalState.teamImage.employee.lastName} ${currentTemplateName}`}
          sceneString={modalState.teamImage.sceneString!}
          variables={{
            firstName: modalState.teamImage.employee.firstName,
            lastName: modalState.teamImage.employee.lastName,
            department: modalState.teamImage.employee.department
          }}
          config={config}
          onSave={(scene) =>
            handleSaveInstance(scene, modalState.teamImage.employee)
          }
          onClose={() => setModalState({ type: 'closed' })}
        />
      )}

      {isLoading && <LoadingOverlay />}
    </div>
  );
}
