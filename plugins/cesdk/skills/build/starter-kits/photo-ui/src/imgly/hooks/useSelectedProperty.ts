/**
 * Selected Property Hook
 *
 * React hook for reading and writing block properties with automatic updates.
 * Subscribes to block changes and provides a reactive interface.
 */

import type CreativeEngine from '@cesdk/engine';
import { useCallback, useEffect, useState } from 'react';

interface UsePropertyOptions {
  shouldAddUndoStep?: boolean;
}

/**
 * Hook for managing a property on a specific block.
 */
export function useProperty<T>(
  engine: CreativeEngine | null,
  block: number | undefined,
  propertyName: string,
  options: UsePropertyOptions = { shouldAddUndoStep: true }
): [T | undefined, (...value: any[]) => void] {
  const getSelectedProperty = useCallback(() => {
    if (!engine || !block) return undefined;
    try {
      return getProperty(engine, block, propertyName) as T;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  }, [block, engine, propertyName]);

  const [propertyValue, setPropertyValue] = useState<T | undefined>(
    getSelectedProperty()
  );

  const setEnginePropertyValue = useCallback(
    (...value: any[]) => {
      if (!engine || !block) return;
      try {
        if (Array.isArray(value)) {
          setProperty(engine, block, propertyName, ...value);
        } else {
          setProperty(engine, block, propertyName, value);
        }
        if (options.shouldAddUndoStep) {
          engine.editor.addUndoStep();
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
      }
    },
    [block, engine, propertyName, options]
  );

  useEffect(() => {
    if (!engine || !block) return;
    const unsubscribe = engine.event.subscribe([block], (events) => {
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
  }, [engine, block, getSelectedProperty]);

  return [propertyValue, setEnginePropertyValue];
}

/**
 * Hook for managing a property on the currently selected block.
 * Note: This captures the initially selected block and doesn't update if selection changes.
 */
export function useSelectedProperty<T>(
  engine: CreativeEngine | null,
  propertyName: string,
  options: UsePropertyOptions = { shouldAddUndoStep: true }
): [T | undefined, (...value: any[]) => void] {
  // Store the initially selected block and stop getting updating properties when the block changed
  const [initialSelectedBlocks] = useState(() =>
    engine ? engine.block.findAllSelected() : []
  );
  const [propertyValue, setEnginePropertyValue] = useProperty<T>(
    engine,
    initialSelectedBlocks[0],
    propertyName,
    options
  );
  return [propertyValue, setEnginePropertyValue];
}

const BLOCK_PROPERTY_METHODS = {
  Float: {
    get: 'getFloat',
    set: 'setFloat'
  },
  Bool: {
    get: 'getBool',
    set: 'setBool'
  },
  String: {
    get: 'getString',
    set: 'setString'
  },
  Color: {
    get: 'getColorRGBA',
    set: 'setColorRGBA'
  },
  Enum: {
    get: 'getEnum',
    set: 'setEnum'
  }
} as const;

function setProperty(
  engine: CreativeEngine,
  blockId: number,
  propertyName: string,
  ...values: any[]
): void {
  const blockType = engine.block.getPropertyType(
    propertyName
  ) as keyof typeof BLOCK_PROPERTY_METHODS;
  const typeDependentMethodName = BLOCK_PROPERTY_METHODS[blockType];
  if (typeDependentMethodName?.set) {
    const setMethod = engine.block[
      typeDependentMethodName.set as 'setFloat' | 'setBool' | 'setString'
    ] as (...args: any[]) => void;
    if (Array.isArray(values)) {
      setMethod.call(engine.block, blockId, propertyName, ...values);
    } else {
      setMethod.call(engine.block, blockId, propertyName, values);
    }
  }
}

function getProperty(
  engine: CreativeEngine,
  blockId: number,
  propertyName: string
): any {
  const blockType = engine.block.getPropertyType(
    propertyName
  ) as keyof typeof BLOCK_PROPERTY_METHODS;
  const typeDependentMethodName = BLOCK_PROPERTY_METHODS[blockType];
  if (typeDependentMethodName?.get) {
    const getMethod = engine.block[
      typeDependentMethodName.get as 'getFloat' | 'getBool' | 'getString'
    ] as (blockId: number, propertyName: string) => any;
    return getMethod.call(engine.block, blockId, propertyName);
  }
}
