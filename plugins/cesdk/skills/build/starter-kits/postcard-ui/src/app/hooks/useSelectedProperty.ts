import { useCallback, useEffect, useState } from 'react';
import { useEngine } from '../contexts/EngineContext';
import { useSelection } from '../contexts/SelectionContext';
import CreativeEngine, { Color } from '@cesdk/engine';

export type BlockPropertyValue = number | boolean | string | Color;

export const useProperty = <T extends BlockPropertyValue = BlockPropertyValue>(
  block: number,
  propertyName: string,
  options = { shouldAddUndoStep: true }
): [T | null | undefined, (value: T) => void] => {
  const { engine } = useEngine();
  // Depend on the primitive, not the `options` object — `options` defaults to a
  // fresh object each render when the caller omits it, which would otherwise
  // re-create the memoized setter every render.
  const shouldAddUndoStep = options.shouldAddUndoStep;

  const getSelectedProperty = useCallback(() => {
    if (!block) return;
    try {
      return getProperty(engine, block, propertyName);
    } catch (error) {
      console.error(`Failed to read block property "${propertyName}"`, error);
    }
  }, [block, engine, propertyName]);

  const [propertyValue, setPropertyValue] = useState(getSelectedProperty());

  useEffect(() => {
    setPropertyValue(getSelectedProperty());
  }, [getSelectedProperty]);

  const setEnginePropertyValue = useCallback(
    (value: BlockPropertyValue) => {
      if (!block) return;
      try {
        setProperty(engine, block, propertyName, value);
        if (shouldAddUndoStep) {
          engine.editor.addUndoStep();
        }
      } catch (error) {
        console.error(`Failed to set block property "${propertyName}"`, error);
      }
    },
    [block, engine, propertyName, shouldAddUndoStep]
  );

  useEffect(() => {
    if (!block) return;
    const blockToSubscribeTo = propertyName.startsWith('fill/')
      ? engine.block.getFill(block)
      : block;
    let unsubscribe = engine.event.subscribe([blockToSubscribeTo], (events) => {
      if (
        events.length > 0 &&
        !events.find(({ type }) => type === 'Destroyed')
      ) {
        const newProperty = getSelectedProperty();
        if (newProperty !== undefined) {
          setPropertyValue(newProperty);
        }
      }
    });
    return () => unsubscribe();
  }, [engine, propertyName, block, getSelectedProperty]);

  if (!block) {
    return [null, () => {}];
  }

  return [propertyValue as T | undefined, setEnginePropertyValue];
};

export const useSelectedProperty = <
  T extends BlockPropertyValue = BlockPropertyValue
>(
  propertyName: string,
  options = { shouldAddUndoStep: true }
): [T | null | undefined, (value: T) => void] => {
  const { selection } = useSelection();
  return useProperty<T>(selection[0], propertyName, options);
};

export function getProperty(
  engine: CreativeEngine,
  blockId: number,
  propertyName: string
): BlockPropertyValue | undefined {
  const type = engine.block.getPropertyType(propertyName);
  switch (type) {
    case 'Float':
      return engine.block.getFloat(blockId, propertyName);
    case 'Double':
      return engine.block.getDouble(blockId, propertyName);
    case 'Int':
      return engine.block.getInt(blockId, propertyName);
    case 'Bool':
      return engine.block.getBool(blockId, propertyName);
    case 'String':
      return engine.block.getString(blockId, propertyName);
    case 'Color':
      return engine.block.getColor(blockId, propertyName);
    case 'Enum':
      return engine.block.getEnum(blockId, propertyName);
    default:
      return undefined;
  }
}

export function setProperty(
  engine: CreativeEngine,
  blockId: number,
  propertyName: string,
  value: BlockPropertyValue
): void {
  const type = engine.block.getPropertyType(propertyName);
  switch (type) {
    case 'Float':
      return engine.block.setFloat(blockId, propertyName, value as number);
    case 'Double':
      return engine.block.setDouble(blockId, propertyName, value as number);
    case 'Int':
      return engine.block.setInt(blockId, propertyName, value as number);
    case 'Bool':
      return engine.block.setBool(blockId, propertyName, value as boolean);
    case 'String':
      return engine.block.setString(blockId, propertyName, value as string);
    case 'Color':
      return engine.block.setColor(blockId, propertyName, value as Color);
    case 'Enum':
      return engine.block.setEnum(blockId, propertyName, value as string);
    default:
      return undefined;
  }
}
