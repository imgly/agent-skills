/**
 * CE.SDK Form-Based Template Adoption Plugin
 *
 * This plugin demonstrates form-based template editing where users
 * can modify template content through a structured panel UI instead
 * of direct canvas manipulation.
 *
 * Features:
 * - Image editing through file upload
 * - Text editing through form inputs
 * - Color editing across all elements
 * - Hidden dock/inspector for simplified UI
 *
 * @see https://img.ly/docs/cesdk/js/plugins/
 */

import { EditorPlugin } from '@cesdk/cesdk-js';
import CreativeEngine, {
  isRGBAColor,
  type RGBAColor
} from '@cesdk/engine';

const SCENE_PADDING = 60;

// ============================================================================
// Type Definitions
// ============================================================================

type ImageEditingOptions = Record<string, never>;

interface TextEditingOptions {
  expanded: boolean;
}

type EditingOptions = ImageEditingOptions & TextEditingOptions;

interface EditableProperty {
  name: string;
  blocks: number[];
  options: EditingOptions;
}

// ============================================================================
// Plugin Factory
// ============================================================================

// highlight-plugin
export const FormBasedTemplateAdoptionPlugin = (): EditorPlugin => ({
  name: 'ly.img.form-based-template-adoption',
  version: '1.0.0',
  initialize: async ({ cesdk }) => {
    if (cesdk == null) return;

    const engine = cesdk.engine;

    // ========================================================================
    // Editor Settings
    // ========================================================================

    // highlight-editor-settings
    engine.editor.setSetting('page/title/show', false);
    engine.editor.setSetting('mouse/enableScroll', false);
    engine.editor.setSetting('mouse/enableZoom', false);
    // highlight-editor-settings

    // ========================================================================
    // UI Configuration - Hide all elements for form-based editing
    // ========================================================================

    // highlight-ui-config
    // Disable dock feature entirely (replaces deprecated ui.elements.dock.show)
    cesdk.feature.set('ly.img.dock', false);

    cesdk.ui.setComponentOrder({ in: 'ly.img.inspector.bar' }, []);
    cesdk.ui.setComponentOrder({ in: 'ly.img.dock' }, []);
    cesdk.ui.setComponentOrder({ in: 'ly.img.canvas.bar', at: 'bottom' }, []);

    // Configure navigation bar with actions dropdown containing export buttons
    cesdk.ui.setComponentOrder({ in: 'ly.img.navigation.bar' }, [
      'ly.img.undoRedo.navigationBar',
      'ly.img.spacer',
      {
        id: 'ly.img.actions.navigationBar',
        children: [
          'ly.img.exportImage.navigationBar',
          'ly.img.exportPDF.navigationBar'
        ]
      }
    ]);

    // Hide 'Resize' button on the navigation bar
    cesdk.feature.set('ly.img.page.resize', false);
    // highlight-ui-config

    // ========================================================================
    // Localization
    // ========================================================================

    // highlight-localization
    cesdk.i18n.setTranslations({
      en: {
        'panel.form-based-adaption': 'Edit Template'
      },
      de: {
        'panel.form-based-adaption': 'Template bearbeiten'
      }
    });
    // highlight-localization

    // ========================================================================
    // Disable Direct Selection
    // ========================================================================

    // highlight-disable-selection
    engine.editor.setGlobalScope('editor/select', 'Deny');
    // highlight-disable-selection

    // ========================================================================
    // State Variables
    // ========================================================================

    let imageBlocks: number[] = [];
    let editableImageTemplateBlocks: EditableProperty[] = [];
    let textBlocks: number[] = [];
    let editableTextTemplateBlocks: EditableProperty[] = [];

    let colors: Record<
      string,
      | {
          id: number;
          color: RGBAColor;
          initialOpacity: number;
          type: 'fill' | 'stroke' | 'text';
        }[]
      | undefined
    > = {};

    // ========================================================================
    // Resize Observer - Zoom to Canvas
    // ========================================================================

    // highlight-resize-observer
    const resizeObserver = new ResizeObserver(() => {
      const scene = engine.scene?.get();
      if (!engine.scene) {
        resizeObserver.disconnect();
        return;
      }
      if (scene === null) return;
      engine.scene.zoomToBlock(scene!, { padding: SCENE_PADDING });
    });
    resizeObserver.observe(engine.element!);
    // highlight-resize-observer

    // ========================================================================
    // Scene Change Handler
    // ========================================================================

    // highlight-scene-handler
    let hasInitialized = false;
    engine.scene.onActiveChanged(() => {
      if (hasInitialized) return;
      hasInitialized = true;
      async function setupScene() {
        const engine = cesdk!.engine;
        // Relocate all transient resources to blob and blob urls.
        // This is important to be able to show image previews in the UI
        relocateResourcesToBlobURLs(engine);
        // Deselect all blocks
        engine.block.findAllSelected().forEach((block) => {
          engine.block.setSelected(block, false);
        });

        imageBlocks = getTemplateImageBlocks(engine);
        editableImageTemplateBlocks = BlocksToEditableProperties(
          engine,
          imageBlocks
        );

        textBlocks = getTemplateTextBlocks(engine);
        editableTextTemplateBlocks = BlocksToEditableProperties(
          engine,
          textBlocks,
          (block) => {
            const text = engine.block.getString(block, 'text/text');
            return {
              expanded: text.includes('\n')
            } as EditingOptions;
          }
        );

        colors = getAllColors(engine);

        await waitUntilLoaded(engine);
        engine.scene.zoomToBlock(engine.scene.get()!, {
          padding: SCENE_PADDING
        });
        // reset history, e.g to include selection changes made above
        const oldHistory = engine.editor.getActiveHistory();
        const newHistory = engine.editor.createHistory();
        engine.editor.setActiveHistory(newHistory);
        engine.editor.destroyHistory(oldHistory);
        engine.editor.addUndoStep();
      }
      setupScene();
    });
    // highlight-scene-handler

    // ========================================================================
    // Custom Panel Registration
    // ========================================================================

    // highlight-panel-registration
    cesdk.ui.registerPanel(
      'form-based-adaption',
      ({ builder, engine, state }) => {
        const pages = engine.block.findByType('page');
        if (pages.length === 0) return;

        // Image Section
        if (imageBlocks.length > 0) {
          builder.Section('form-based-adaption.image', {
            title: 'Image',
            children: () => {
              editableImageTemplateBlocks.forEach(({ blocks }) => {
                const block = blocks[0];
                const fillBlock = engine.block.getFill(block);
                const uri =
                  engine.block.getSourceSet(
                    fillBlock,
                    'fill/image/sourceSet'
                  )?.[0]?.uri ??
                  engine.block.getString(fillBlock, 'fill/image/imageFileURI');

                const uploadState = state(`imageUpload-${block}`, false);

                const blockName = engine.block.getName(block);

                builder.MediaPreview(`imagePreview-${block}`, {
                  size: 'small',
                  preview: {
                    type: 'image',
                    uri
                  },
                  action: {
                    label: `Change ${blockName || 'Image'}`,
                    isLoading: uploadState.value,
                    onClick: () => {
                      uploadFile({
                        supportedMimeTypes: ['image/*']
                      }).then((files) => {
                        const [file] = files;
                        if (file != null) {
                          const url = URL.createObjectURL(file);
                          blocks.map((blockToChange) => {
                            const fillToChange =
                              engine.block.getFill(blockToChange);
                            engine.block.setString(
                              fillToChange,
                              'fill/image/imageFileURI',
                              ''
                            );
                            engine.block.setSourceSet(
                              fillToChange,
                              'fill/image/sourceSet',
                              []
                            );
                            return engine.block
                              .addImageFileURIToSourceSet(
                                fillToChange,
                                'fill/image/sourceSet',
                                url
                              )
                              .then(() => {
                                uploadState.setValue(false);
                                engine.editor.addUndoStep();
                              })
                              .catch(() => {
                                // eslint-disable-next-line no-console
                                console.error('Error uploading image');
                                uploadState.setValue(false);
                              });
                          });
                        }
                      });
                    }
                  }
                });
              });
            }
          });
        }

        // Text Section
        if (textBlocks.length > 0) {
          const textBlockState = state<Map<string, TextEditingOptions>>(
            'textBlockState',
            new Map(
              editableTextTemplateBlocks.map(({ name, options }) => [
                name,
                options
              ])
            )
          );
          builder.Section('form-based-adaption.text', {
            title: 'Text',
            children: () => {
              editableTextTemplateBlocks.forEach(({ blocks, name }) => {
                const value = engine.block.getString(blocks[0], 'text/text');
                const setValue = (newValue: string) => {
                  blocks.forEach((block) => {
                    engine.block.replaceText(block, newValue);
                  });
                  cesdk.engine.editor.addUndoStep();
                };
                const expanded =
                  textBlockState.value.get(name)!.expanded ?? false;
                if (expanded) {
                  builder.TextArea(`text-${name}`, {
                    inputLabel: name,
                    value,
                    setValue
                  });
                } else {
                  builder.TextInput(`text-${name}`, {
                    inputLabel: name,
                    value,
                    setValue
                  });
                }
              });
            }
          });
        }

        // Color Section
        builder.Section('form-based-adaption.color', {
          title: 'Color',
          children: () => {
            Object.keys(colors).forEach((colorId, i) => {
              const foundsColors = colors[colorId];
              const currentColor = readCurrentColor(engine, foundsColors![0]);

              builder.ColorInput(`color-${colorId}`, {
                inputLabel: `Color ${i + 1}`,
                label: `Color ${i + 1}`,
                value: currentColor,

                setValue: (newValue) => {
                  foundsColors!.forEach((foundColor) => {
                    if (foundColor.type === 'fill') {
                      const fill = engine.block.getFill(foundColor.id);
                      engine.block.setColor(fill, 'fill/color/value', {
                        ...newValue,
                        a: foundColor.initialOpacity
                      });
                    } else if (foundColor.type === 'stroke') {
                      engine.block.setStrokeColor(foundColor.id, {
                        ...newValue,
                        a: foundColor.initialOpacity
                      });
                    } else if (foundColor.type === 'text') {
                      engine.block.setTextColor(foundColor.id, {
                        ...newValue,
                        a: foundColor.initialOpacity
                      });
                    }
                  });
                  cesdk.engine.editor.addUndoStep();
                }
              });
            });
          }
        });
      }
    );
    // highlight-panel-registration

    // ========================================================================
    // Open the Panel
    // ========================================================================

    // highlight-open-panel
    cesdk.ui.openPanel('form-based-adaption', { closableByUser: false });
    // highlight-open-panel
  }
});
// highlight-plugin

// ============================================================================
// Helper Functions
// ============================================================================

// highlight-helpers
const waitUntilLoaded = async (engine: CreativeEngine): Promise<void> => {
  await engine.block.forceLoadResources([engine.scene.get()!]);
};

const readCurrentColor = (
  engine: CreativeEngine,
  found: { id: number; color: RGBAColor; type: 'fill' | 'stroke' | 'text' }
): RGBAColor => {
  let color;
  if (found.type === 'fill') {
    color = engine.block.getColor(engine.block.getFill(found.id), 'fill/color/value');
  } else if (found.type === 'stroke') {
    color = engine.block.getStrokeColor(found.id);
  } else {
    color = engine.block.getTextColors(found.id)[0];
  }
  return isRGBAColor(color) ? { ...color, a: 1 } : found.color;
};

const getAllColors = (engine: CreativeEngine) => {
  const allElements = engine.block.findAll();
  const elementsWithFillColor: number[] = [];
  const elementsWithStroke: number[] = [];
  const elementsWithTextColor: number[] = [];

  allElements.forEach((element) => {
    const withFillColor =
      engine.block.supportsFill(element) &&
      engine.block.isValid(engine.block.getFill(element)) &&
      engine.block.getType(engine.block.getFill(element)) ===
        '//ly.img.ubq/fill/color' &&
      engine.block.isFillEnabled(element) &&
      !(engine.block.getType(element) === '//ly.img.ubq/text');

    if (withFillColor) {
      elementsWithFillColor.push(element);
    }

    const withStroke =
      engine.block.supportsStroke(element) &&
      engine.block.isStrokeEnabled(element);

    if (withStroke) {
      elementsWithStroke.push(element);
    }

    const withTextColor = engine.block.getType(element) === '//ly.img.ubq/text';
    if (withTextColor) {
      elementsWithTextColor.push(element);
    }
  });

  const blocksByColors: Record<
    string,
    {
      id: number;
      color: RGBAColor;
      initialOpacity: number;
      type: 'fill' | 'stroke' | 'text';
    }[]
  > = {};

  elementsWithFillColor.forEach((element) => {
    const fill = engine.block.getFill(element);
    const color = engine.block.getColor(fill, 'fill/color/value');
    if (!isRGBAColor(color)) return;

    const initialOpacity = color.a;
    color.a = 1;

    const colorId = JSON.stringify(color);
    blocksByColors[colorId] = blocksByColors[colorId] || [];
    blocksByColors[colorId].push({
      id: element,
      color,
      initialOpacity,
      type: 'fill'
    });
  });

  elementsWithStroke.forEach((element) => {
    const color = engine.block.getStrokeColor(element);
    if (!isRGBAColor(color)) return;

    const initialOpacity = color.a;
    color.a = 1;

    const colorId = JSON.stringify(color);
    blocksByColors[colorId] = blocksByColors[colorId] || [];
    blocksByColors[colorId].push({
      id: element,
      color,
      initialOpacity,
      type: 'stroke'
    });
  });

  elementsWithTextColor.forEach((element) => {
    const textColors = engine.block.getTextColors(element);
    if (textColors.length === 1) {
      const color = textColors[0];

      if (!isRGBAColor(color)) return;

      const initialOpacity = color.a;
      color.a = 1;

      const colorId = JSON.stringify(color);
      blocksByColors[colorId] = blocksByColors[colorId] || [];
      blocksByColors[colorId].push({
        id: element,
        color,
        initialOpacity,
        type: 'text'
      });
    }
  });

  return blocksByColors;
};

export const uploadFile = (() => {
  const element: HTMLInputElement = document.createElement('input');
  element.setAttribute('type', 'file');
  element.style.display = 'none';
  document.body.appendChild(element);

  return ({
    supportedMimeTypes,
    multiple = true
  }: {
    supportedMimeTypes: string[];
    multiple?: boolean;
  }) => {
    const accept = supportedMimeTypes.join(',');

    if (element == null) {
      return Promise.reject(new Error('No valid upload element created'));
    }
    const element_ = element;
    return new Promise<File[]>((resolve, reject) => {
      if (accept) {
        element_.setAttribute('accept', accept);
      }
      if (multiple) {
        element_.setAttribute('multiple', String(multiple));
      }
      element_.onchange = (e: Event) => {
        const target = e.target as HTMLInputElement;
        if (target.files) {
          const files = Object.values(target.files);
          resolve(files);
        } else {
          reject(new Error('No files selected'));
        }
        element_.onchange = null;
        element_.value = '';
      };
      element_.click();
    });
  };
})();

function relocateResourcesToBlobURLs(engine: CreativeEngine) {
  engine.editor.findAllTransientResources().forEach((resource) => {
    const uri = resource.URL;
    if (uri.includes('bundle://ly.img.cesdk/')) return;

    const length = engine.editor.getBufferLength(uri);
    const data = engine.editor.getBufferData(uri, 0, length);

    const blob = new Blob([data as unknown as ArrayBuffer]);
    const blobURL = URL.createObjectURL(blob);
    engine.editor.relocateResource(uri, blobURL);
  });
}

function orderBlocksByDistanceToTopLeft(
  engine: CreativeEngine,
  blocks: number[]
): number[] {
  const topLeft = { x: 0, y: 0 };
  return blocks.sort((a, b) => {
    const aPos = {
      x: engine.block.getPositionX(a),
      y: engine.block.getPositionY(a)
    };
    const bPos = {
      x: engine.block.getPositionX(b),
      y: engine.block.getPositionY(b)
    };

    const aDistance = Math.sqrt(
      Math.pow(aPos.x - topLeft.x, 2) + Math.pow(aPos.y - topLeft.y, 2)
    );
    const bDistance = Math.sqrt(
      Math.pow(bPos.x - topLeft.x, 2) + Math.pow(bPos.y - topLeft.y, 2)
    );

    return aDistance - bDistance;
  });
}

function getTemplateTextBlocks(engine: CreativeEngine): number[] {
  return orderBlocksByDistanceToTopLeft(
    engine,
    engine.block.findByType('text').filter((block) => {
      return engine.block.isScopeEnabled(block, 'text/edit');
    })
  );
}

function getTemplateImageBlocks(engine: CreativeEngine): number[] {
  return orderBlocksByDistanceToTopLeft(
    engine,
    engine.block.findByType('graphic').filter((block) => {
      if (!engine.block.supportsFill(block)) return false;

      const fillBlock = engine.block.getFill(block);
      const fillType = engine.block.getType(fillBlock);
      if (fillType !== '//ly.img.ubq/fill/image') return false;

      const scopeEnabled = engine.block.isScopeEnabled(block, 'fill/change');
      if (!scopeEnabled) return false;

      return true;
    })
  );
}

function BlocksToEditableProperties(
  engine: CreativeEngine,
  blocks: number[],
  defaultOptions?: (block: number) => EditingOptions
): EditableProperty[] {
  return blocks
    .map((block) => {
      const name = engine.block.getName(block) || block.toString();
      return {
        name,
        blocks: [block],
        options: defaultOptions?.(block) ?? ({} as EditingOptions)
      };
    })
    .reduce<EditableProperty[]>((acc, block) => {
      const name = block.name;
      const existing = acc.find((existing) => existing.name === name);
      if (existing) {
        existing.blocks.push(...block.blocks);
      } else {
        acc.push(block);
      }
      return acc;
    }, []);
}
// highlight-helpers
