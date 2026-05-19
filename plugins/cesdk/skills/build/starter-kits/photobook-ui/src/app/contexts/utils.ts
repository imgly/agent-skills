/**
 * Deep equality check for arrays and objects
 */
export function isEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (typeof a !== typeof b) return false;

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    return a.every((val, index) => isEqual(val, b[index]));
  }

  if (typeof a === 'object' && typeof b === 'object') {
    const keysA = Object.keys(a as object);
    const keysB = Object.keys(b as object);
    if (keysA.length !== keysB.length) return false;
    return keysA.every((key) =>
      isEqual(
        (a as Record<string, unknown>)[key],
        (b as Record<string, unknown>)[key]
      )
    );
  }

  return false;
}

/**
 * Pixel to canvas unit conversion
 */
export function pixelToCanvasUnit(
  engine: {
    block: {
      getEnum: (id: number, prop: string) => string;
      getFloat: (id: number, prop: string) => number;
    };
    scene: { get: () => number; getZoomLevel: () => number };
  },
  pixel: number
): number {
  const sceneUnit = engine.block.getEnum(
    engine.scene.get(),
    'scene/designUnit'
  );
  let densityFactor = 1;
  if (sceneUnit === 'Millimeter') {
    densityFactor =
      engine.block.getFloat(engine.scene.get(), 'scene/dpi') / 25.4;
  }
  if (sceneUnit === 'Inch') {
    densityFactor = engine.block.getFloat(engine.scene.get(), 'scene/dpi');
  }
  return (
    pixel /
    (window.devicePixelRatio * densityFactor * engine.scene.getZoomLevel())
  );
}

/**
 * Zoom to selected text cursor position
 */
export async function zoomToSelectedText(
  engine: {
    element: HTMLElement;
    block: {
      findAllSelected: () => number[];
      findByType: (type: string) => number[];
      getPositionY: (id: number) => number;
      setPositionY: (id: number, y: number) => void;
    };
    editor: {
      getTextCursorPositionInScreenSpaceY: () => number;
    };
  },
  paddingTop = 0,
  paddingBottom = 0
): Promise<void> {
  const canvasBounding = engine.element.getBoundingClientRect();
  const canvasHeight = canvasBounding.height * window.devicePixelRatio;
  const overlapBottom = Math.max(
    (canvasBounding.top +
      canvasBounding.height -
      window.visualViewport!.height) *
      window.devicePixelRatio,
    0
  );
  const selectedTexts = engine.block.findAllSelected();
  if (selectedTexts.length === 1) {
    const cursorPosY = engine.editor.getTextCursorPositionInScreenSpaceY();
    // The first cursorPosY is 0 if no cursor has been laid out yet. Then we ignore zoom commands.
    const cursorPosIsValid = cursorPosY !== 0;
    if (!cursorPosIsValid) {
      return;
    }
    const visiblePageAreaY = canvasHeight - overlapBottom - paddingBottom;
    const camera = engine.block.findByType('camera')[0];

    const cursorPosYCanvas =
      pixelToCanvasUnit(
        engine as unknown as Parameters<typeof pixelToCanvasUnit>[0],
        engine.editor.getTextCursorPositionInScreenSpaceY()
      ) +
      engine.block.getPositionY(camera) -
      pixelToCanvasUnit(
        engine as unknown as Parameters<typeof pixelToCanvasUnit>[0],
        visiblePageAreaY
      );
    if (
      cursorPosY > visiblePageAreaY ||
      cursorPosY < paddingTop * window.devicePixelRatio
    ) {
      engine.block.setPositionY(camera, cursorPosYCanvas);
    }
  }
}
