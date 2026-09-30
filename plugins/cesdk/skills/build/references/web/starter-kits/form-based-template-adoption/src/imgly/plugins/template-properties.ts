/**
 * Template traversal for the form-based adoption panel.
 *
 * Which blocks of a template become editable image, text and color properties,
 * and how they are named, grouped and ordered.
 */

import CreativeEngine, { isRGBAColor, type RGBAColor } from '@cesdk/engine';

// ============================================================================
// Type Definitions
// ============================================================================

export type ImageEditingOptions = Record<string, never>;

export interface TextEditingOptions {
  expanded: boolean;
}

export type EditingOptions = ImageEditingOptions & TextEditingOptions;

export interface EditableProperty {
  name: string;
  blocks: number[];
  options: EditingOptions;
}

export interface FoundColor {
  id: number;
  color: RGBAColor;
  initialOpacity: number;
  type: 'fill' | 'stroke' | 'text';
}

export const waitUntilLoaded = async (
  engine: CreativeEngine
): Promise<void> => {
  await engine.block.forceLoadResources([engine.scene.get()!]);
};

export const readCurrentColor = (
  engine: CreativeEngine,
  found: { id: number; color: RGBAColor; type: 'fill' | 'stroke' | 'text' }
): RGBAColor => {
  let color;
  if (found.type === 'fill') {
    color = engine.block.getColor(
      engine.block.getFill(found.id),
      'fill/color/value'
    );
  } else if (found.type === 'stroke') {
    color = engine.block.getStrokeColor(found.id);
  } else {
    color = engine.block.getTextColors(found.id)[0];
  }
  return isRGBAColor(color) ? { ...color, a: 1 } : found.color;
};

export const getAllColors = (engine: CreativeEngine) => {
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

export function relocateResourcesToBlobURLs(engine: CreativeEngine) {
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

export function orderBlocksByDistanceToTopLeft(
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

export function getTemplateTextBlocks(engine: CreativeEngine): number[] {
  return orderBlocksByDistanceToTopLeft(
    engine,
    engine.block.findByType('text').filter((block) => {
      return engine.block.isScopeEnabled(block, 'text/edit');
    })
  );
}

export function getTemplateImageBlocks(engine: CreativeEngine): number[] {
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

export function BlocksToEditableProperties(
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
