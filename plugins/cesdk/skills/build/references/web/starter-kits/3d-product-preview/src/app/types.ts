/**
 * 3D Mockup Editor - Type Definitions
 */

/**
 * Extended HTMLElement interface for Google's model-viewer web component.
 */
export interface ModelViewerElement extends HTMLElement {
  model?: {
    materials: Array<{
      pbrMetallicRoughness: {
        baseColorTexture: {
          setTexture: (texture: unknown) => void;
        };
      };
    }>;
  };
  createTexture: (url: string) => Promise<unknown>;
  cameraOrbit: string;
  cameraControls: boolean;
  src: string;
  jumpCameraToGoal?: () => void;
}

// Extend JSX.IntrinsicElements for model-viewer web component
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          src?: string;
          'camera-controls'?: boolean;
          'camera-orbit'?: string;
          'shadow-intensity'?: string;
        },
        HTMLElement
      >;
    }
  }
}
