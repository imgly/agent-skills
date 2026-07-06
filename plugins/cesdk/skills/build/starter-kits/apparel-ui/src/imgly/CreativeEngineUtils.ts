import type CreativeEngine from '@cesdk/engine';

export const zoomToSelectedText = async (
  engine: CreativeEngine,
  paddingTop = 0,
  paddingBottom = 0
) => {
  const canvasBounding = engine.element!.getBoundingClientRect();
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
    const cursorPosIsValid = cursorPosY !== 0;
    if (!cursorPosIsValid) {
      return;
    }
    const visiblePageAreaY = canvasHeight - overlapBottom - paddingBottom;
    const camera = engine.block.findByType('camera')[0];

    const cursorPosYCanvas =
      pixelToCanvasUnit(
        engine,
        engine.editor.getTextCursorPositionInScreenSpaceY()
      ) +
      engine.block.getPositionY(camera) -
      pixelToCanvasUnit(engine, visiblePageAreaY);
    if (
      cursorPosY > visiblePageAreaY ||
      cursorPosY < paddingTop * window.devicePixelRatio
    ) {
      engine.block.setPositionY(camera, cursorPosYCanvas);
    }
  }
};

export const pixelToCanvasUnit = (
  engine: CreativeEngine,
  pixel: number
): number => {
  const sceneUnit = engine.block.getEnum(
    engine.scene.get()!,
    'scene/designUnit'
  );
  let densityFactor = 1;
  if (sceneUnit === 'Millimeter') {
    densityFactor =
      engine.block.getFloat(engine.scene.get()!, 'scene/dpi') / 25.4;
  }
  if (sceneUnit === 'Inch') {
    densityFactor = engine.block.getFloat(engine.scene.get()!, 'scene/dpi');
  }
  return (
    pixel /
    (window.devicePixelRatio * densityFactor * engine.scene.getZoomLevel())
  );
};

export const autoPlaceBlockOnPage = (
  engine: CreativeEngine,
  page: number,
  block: number,
  config: {
    basePosX: number;
    basePosY: number;
    randomPosX: number;
    randomPosY: number;
  } = {
    basePosX: 0.25,
    basePosY: 0.25,
    randomPosX: 0.05,
    randomPosY: 0.05
  }
) => {
  engine.block
    .findAllSelected()
    .forEach((blockId) => engine.block.setSelected(blockId, false));
  engine.block.appendChild(page, block);

  const pageWidth = engine.block.getWidth(page);
  const posX =
    pageWidth * (config.basePosX + Math.random() * config.randomPosX);
  engine.block.setPositionXMode(block, 'Absolute');
  engine.block.setPositionX(block, posX);

  const pageHeight = engine.block.getWidth(page);
  const posY =
    pageHeight * (config.basePosY + Math.random() * config.randomPosY);
  engine.block.setPositionYMode(block, 'Absolute');
  engine.block.setPositionY(block, posY);

  engine.block.setSelected(block, true);
  engine.editor.addUndoStep();
};

export function getImageSize(
  url: string
): Promise<{ width: number; height: number }> {
  const img = document.createElement('img');

  const promise = new Promise<{ width: number; height: number }>(
    (resolve, reject) => {
      img.onload = () => {
        const width = img.naturalWidth;
        const height = img.naturalHeight;
        resolve({ width, height });
      };
      img.onerror = reject;
    }
  );

  img.src = url;
  return promise;
}
