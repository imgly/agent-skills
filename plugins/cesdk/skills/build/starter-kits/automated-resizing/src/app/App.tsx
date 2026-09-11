import { useCallback } from 'react';
import type { Configuration } from '@cesdk/cesdk-js';

import type { Template, VariantImage } from '../imgly';

import {
  useEngine,
  useTemplates,
  useEditorModal,
  useVariants,
  resolveSceneUrl
} from './hooks';
import { TemplateSection } from './TemplateSection/TemplateSection';
import { VariantsSection } from './VariantsSection/VariantsSection';
import { EditorModal } from './EditorModal/EditorModal';

import styles from './App.module.css';

interface AppProps {
  config: Partial<Configuration>;
}

export default function App({ config }: AppProps) {
  // State hooks
  const { engine, isReady } = useEngine(config);
  const templates = useTemplates();
  const modal = useEditorModal();
  const variants = useVariants(engine, isReady);

  // Render a preview thumbnail blob URL by exporting the given scene through
  // the headless engine.
  const renderPreview = useCallback(
    async (sceneString: string): Promise<string | undefined> => {
      if (!engine) return undefined;
      await engine.scene.loadFromString(sceneString);
      const scene = engine.scene.get();
      if (scene == null) return undefined;
      const blob = await engine.block.export(scene, { mimeType: 'image/png' });
      return URL.createObjectURL(blob);
    },
    [engine]
  );

  // Template edit handler - bridges engine and modal
  const handleTemplateEdit = useCallback(
    async (template: Template) => {
      if (!engine) return;

      try {
        let scene = template.sceneString;
        if (!scene) {
          await engine.scene.loadFromURL(resolveSceneUrl(template.sceneUrl));
          scene = await engine.scene.saveToString();
        }
        if (scene) {
          modal.open(scene, 'advanced', async (sceneString) => {
            const previewUrl = await renderPreview(sceneString);
            templates.updateTemplate(template, sceneString, previewUrl);
            modal.close();
          });
        }
      } catch (error) {
        console.error('Failed to open template editor:', error);
      }
    },
    [engine, modal, renderPreview, templates]
  );

  // Variant edit handler - bridges variant and modal
  const handleVariantEdit = useCallback(
    (variant: VariantImage) => {
      if (!variant.sceneString) return;
      modal.open(variant.sceneString, 'design', async (sceneString) => {
        const previewUrl = await renderPreview(sceneString);
        if (previewUrl) {
          variants.updateVariant(variant.size.id, sceneString, previewUrl);
        }
        modal.close();
      });
    },
    [modal, renderPreview, variants]
  );

  // Generate handler - bridges templates and variants
  const handleGenerate = useCallback(() => {
    variants.generate(templates.selectedTemplate);
  }, [variants, templates.selectedTemplate]);

  return (
    <div className={styles.app}>
      {/* Main content */}
      <div className={styles.content}>
        <TemplateSection
          templates={templates.templates}
          selectedIndex={templates.selectedIndex}
          onSelect={templates.select}
          onEdit={handleTemplateEdit}
          onGenerate={handleGenerate}
        />

        <VariantsSection
          variants={variants.variants}
          onEdit={handleVariantEdit}
          onDownload={variants.download}
        />
      </div>

      {/* Editor Modal */}
      <EditorModal
        config={config}
        isOpen={modal.isOpen}
        scene={modal.scene}
        mode={modal.mode}
        onClose={modal.close}
        onSave={modal.onSave}
      />
    </div>
  );
}
