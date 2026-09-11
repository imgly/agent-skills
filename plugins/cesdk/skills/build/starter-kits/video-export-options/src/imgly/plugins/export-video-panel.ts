/**
 * Export Video Panel Plugin
 *
 * Provides a custom export panel with resolution and FPS selection options.
 * Allows users to choose from predefined resolutions (SD, HD, FHD, 2K, 4K)
 * or specify custom dimensions while maintaining aspect ratio.
 */

import { EditorPlugin } from '@cesdk/cesdk-js';

const MAX_RESOLUTION = 4000;

const ALL_RESOLUTIONS = [
  {
    id: 'SD (Standard Definition), 480p',
    label: 'video-export.resolution.sd',
    description: 'video-export.resolution.480p',
    value: {
      width: 640,
      height: 480
    }
  },
  {
    id: 'HD (High Definition), 720p',
    label: 'video-export.resolution.hd',
    description: 'video-export.resolution.720p',
    value: {
      width: 1280,
      height: 720
    }
  },
  {
    id: 'FHD (Full HD), 1080p',
    label: 'video-export.resolution.fhd',
    description: 'video-export.resolution.1080p',
    value: {
      width: 1920,
      height: 1080
    }
  },
  {
    id: '2K (Quad HD), 1440p',
    label: 'video-export.resolution.quad_hd',
    description: 'video-export.resolution.1440p',
    value: {
      width: 2560,
      height: 1440
    }
  },
  {
    id: '4K (Ultra HD), 2160p',
    label: 'video-export.resolution.ultra_hd',
    description: 'video-export.resolution.2160p',
    value: {
      width: 3840,
      height: 2160
    }
  },
  // custom resolution
  {
    id: 'Custom',
    label: 'video-export.resolution.custom',
    description: 'video-export.resolution.custom',
    value: {
      width: 1000,
      height: 1000
    }
  }
];

interface ResolutionOption {
  id: string;
  label: string;
  description: string;
  value: Resolution;
}
interface Resolution {
  width: number;
  height: number;
}

const ALL_FPS_OPTIONS = [
  { id: '24', label: 'video-export.fps.24', value: 24 },
  { id: '30', label: 'video-export.fps.30', value: 30 },
  { id: '60', label: 'video-export.fps.60', value: 60 },
  { id: '120', label: 'video-export.fps.120', value: 120 }
];
interface FpsOption {
  id: string;
  label: string;
  value: number;
}

interface PluginOptions {
  fpsOptions: FpsOption[];
  resolutionOptions: ResolutionOption[];
  onExport?: (blob: Blob) => void;
}

const translations = {
  en: {
    'panel.//ly.img.panel/video-export': 'Export Video',
    'formats/video/mp4': 'MP4',
    'video-export.intro': 'Videos are exported as MP4 with H.264 Codec',
    'video-export.resolution.label': 'Resolution',
    'video-export.resolution.sd': 'Standard Definition (SD)',
    'video-export.resolution.480p': '480p',
    'video-export.resolution.hd': 'High Definition (HD)',
    'video-export.resolution.720p': '720p',
    'video-export.resolution.fhd': 'Full HD (FHD)',
    'video-export.resolution.1080p': '1080p',
    'video-export.resolution.quad_hd': 'Quad HD (2K)',
    'video-export.resolution.1440p': '1440p',
    'video-export.resolution.ultra_hd': 'Ultra HD (4K)',
    'video-export.resolution.2160p': '2160p',
    'video-export.resolution.custom': 'Custom',
    'video-export.fps.24': '24 FPS',
    'video-export.fps.30': '30 FPS',
    'video-export.fps.60': '60 FPS',
    'video-export.fps.120': '120 FPS',
    'video-export.fps-select.label': 'Frames per Second',
    'video-export.fps-select.tooltip':
      'Select the frames per second (FPS) for the exported video to determine video smoothness. Higher FPS is smoother, but affects file size and export time.',

    'video-export.custom-resolution.width.label': 'Width',
    'video-export.custom-resolution.height.label': 'Height',
    'video-export.custom-resolution.max-error.label': `Height or width can't be greater than ${MAX_RESOLUTION}`,
    'video-export.custom-resolution.min-error.label':
      'Height and width must be at least 16',
    'video-export.export-video': 'Export Video',
    'video-export.exporting.title': 'Exporting',
    'video-export.exporting.message': 'Exporting video...',
    'video-export.exporting.cancel': 'Cancel'
  }
};

export const ExportVideoPanelPlugin = (
  options: Partial<PluginOptions> = {}
): EditorPlugin => ({
  name: 'ly.img.export-options-plugin',
  version: '1.0.0',
  initialize: async ({ cesdk }) => {
    if (cesdk == null) return;
    const fpsOptions = options.fpsOptions ?? ALL_FPS_OPTIONS;
    const resolutionOptions = options.resolutionOptions ?? ALL_RESOLUTIONS;
    const onExport =
      options.onExport ??
      ((blob) => cesdk.utils.downloadFile(blob, 'video/mp4'));

    cesdk.i18n.setTranslations(translations);

    cesdk.ui.registerComponent(
      'ly.img.export-options.navigationBar',
      ({ builder }) => {
        builder.Button('export-video-button', {
          color: 'accent',
          variant: 'regular',
          label: 'video-export.export-video',
          onClick: () => {
            if (cesdk.ui.isPanelOpen('//ly.img.panel/video-export')) {
              cesdk.ui.closePanel('//ly.img.panel/video-export');
            } else {
              cesdk.ui.openPanel('//ly.img.panel/video-export');
            }
          }
        });
      }
    );
    // On active scene change, close the panel
    // This also ensures that custom values formats are reset when switching scenes
    cesdk.engine.scene.onActiveChanged(() => {
      cesdk.ui.closePanel('//ly.img.panel/video-export');
    });

    cesdk.ui.registerPanel(
      '//ly.img.panel/video-export',
      ({ builder, engine, state }) => {
        const page = engine.scene.getCurrentPage();
        if (!page) return;

        const fpsState = state('fps', fpsOptions[1]) as {
          value: FpsOption;
          setValue: (v: FpsOption) => void;
        };
        const pageWidth = engine.block.getFrameWidth(page);
        const pageHeight = engine.block.getFrameHeight(page);
        const errorMessages: string[] = [];
        const availableResolutions = resolutionOptions.filter(
          (res) =>
            res.id === 'Custom' ||
            resolutionHasSameAspectRatio(res.value, {
              width: pageWidth,
              height: pageHeight
            })
        );
        const currentResolution =
          availableResolutions.find(
            (res) =>
              res.value.width === pageWidth && res.value.height === pageHeight
          ) ?? availableResolutions.find((res) => res.id === 'Custom')!;
        const resolutionState = state('resolution', currentResolution) as {
          value: ResolutionOption;
          setValue: (v: ResolutionOption) => void;
        };

        const widthState = state('custom-resolution-width', pageWidth) as {
          value: number;
          setValue: (v: number) => void;
        };
        const heightState = state('custom-resolution-height', pageHeight) as {
          value: number;
          setValue: (v: number) => void;
        };
        // if current resolution is not in the list, e.g due to a switch in page format, set it to custom
        if (
          !availableResolutions.find(
            (res) =>
              res.value.width === pageWidth && res.value.height === pageHeight
          ) &&
          resolutionState.value.id !== 'Custom'
        ) {
          resolutionState.setValue(
            availableResolutions.find(
              (res) =>
                res.value.width === pageWidth && res.value.height === pageHeight
            ) ?? availableResolutions.find((res) => res.id === 'Custom')!
          );
        }
        const isExportingState = state('isExporting', false) as {
          value: boolean;
          setValue: (v: boolean) => void;
        };

        builder.Section('video-format-section', {
          children: () => {
            builder.Text('format-description', {
              content: 'video-export.intro',
              align: 'left'
            });
          }
        });

        builder.Section('parameters-section', {
          children: () => {
            builder.Select('fps-select', {
              inputLabel: 'video-export.fps-select.label',
              values: fpsOptions,
              value: fpsState.value,
              setValue: (newValue) => fpsState.setValue(newValue as FpsOption),
              tooltip: 'video-export.fps-select.tooltip'
            });
            builder.Select('resolution-select', {
              inputLabel: 'video-export.resolution.label',
              values: availableResolutions,
              value: resolutionState.value,
              setValue: (newValue) =>
                resolutionState.setValue(newValue as ResolutionOption)
            });

            if (resolutionState.value.id === 'Custom') {
              // if custom height or width is different from custom resolution value, update it to custom resolution
              if (
                widthState.value !== resolutionState.value.value.width ||
                heightState.value !== resolutionState.value.value.height
              ) {
                resolutionState.value.value.width = widthState.value;
                resolutionState.value.value.height = heightState.value;
              }
              if (
                heightState.value > MAX_RESOLUTION ||
                widthState.value > MAX_RESOLUTION
              ) {
                errorMessages.push(ERRORS.MAX_RESOLUTION);
              }
              if (heightState.value < 16 || widthState.value < 16) {
                errorMessages.push(ERRORS.MIN_RESOLUTION);
              }

              builder.NumberInput('custom-resolution-height', {
                inputLabel: 'video-export.custom-resolution.height.label',
                min: 16,
                max: MAX_RESOLUTION,
                step: 1,
                value: heightState.value,
                setValue: (newHeight) => {
                  heightState.setValue(newHeight);
                  const newWidth = (pageWidth * newHeight) / pageHeight;
                  widthState.setValue(newWidth);
                }
              });
              builder.NumberInput('custom-resolution-width', {
                inputLabel: 'video-export.custom-resolution.width.label',
                min: 16,
                max: MAX_RESOLUTION,
                step: 1,
                value: widthState.value,
                setValue: (newWidth) => {
                  widthState.setValue(newWidth);
                  const newHeight = (pageHeight * newWidth) / pageWidth;
                  heightState.setValue(newHeight);
                }
              });

              errorMessages.forEach((error) => {
                builder.Text(`custom-resolution-${error}-error`, {
                  content: error,
                  align: 'right'
                });
              });
            }
          }
        });

        builder.Section('export-button-section', {
          children: () => {
            builder.Button('export-video-button', {
              label: 'video-export.export-video',
              isLoading: isExportingState.value,
              isDisabled: !!isExportingState.value || errorMessages.length > 0,
              color: 'accent',
              onClick: async () => {
                isExportingState.setValue(true);
                try {
                  const { blobs } = await cesdk.utils.export({
                    mimeType: 'video/mp4',
                    targetWidth: resolutionState.value.value.width,
                    targetHeight: resolutionState.value.value.height,
                    framerate: fpsState.value.value
                  });
                  if (blobs[0]) onExport(blobs[0]);
                } finally {
                  isExportingState.setValue(false);
                }
              }
            });
          }
        });
      }
    );

    cesdk.ui.setPanelPosition(
      '//ly.img.panel/video-export',
      'right' as 'left' | 'right'
    );

    // Insert to navigation bar
    cesdk.ui.insertOrderComponent(
      { in: 'ly.img.navigation.bar', position: 'end' },
      {
        id: 'ly.img.export-options.navigationBar'
      }
    );
  }
});

enum ERRORS {
  MAX_RESOLUTION = 'video-export.custom-resolution.max-error.label',
  MIN_RESOLUTION = 'video-export.custom-resolution.min-error.label'
}

function resolutionHasSameAspectRatio(
  resolution1: Resolution,
  resolution2: Resolution
) {
  return (
    resolution1.width / resolution1.height ===
    resolution2.width / resolution2.height
  );
}
