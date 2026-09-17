import { useCallback, useEffect, useState } from 'react';
import type CreativeEngine from '@cesdk/engine';
import { useEditor } from '../contexts/EditorContext';

type PropertyType =
  | 'Float'
  | 'Bool'
  | 'String'
  | 'Color'
  | 'Enum'
  | 'Int'
  | 'Double';

const BLOCK_PROPERTY_METHODS: Record<
  PropertyType,
  { get: string; set: string }
> = {
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
    get: 'getColor',
    set: 'setColor'
  },
  Enum: {
    get: 'getEnum',
    set: 'setEnum'
  },
  Int: {
    get: 'getInt',
    set: 'setInt'
  },
  Double: {
    get: 'getDouble',
    set: 'setDouble'
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function setProperty(
  engine: CreativeEngine,
  blockId: number,
  propertyName: string,
  ...values: any[]
) {
  const blockType = engine.block.getPropertyType(propertyName) as PropertyType;
  const typeDependentMethodName = BLOCK_PROPERTY_METHODS[blockType];
  if (typeDependentMethodName?.set) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (engine.block as any)[typeDependentMethodName.set](
      blockId,
      propertyName,
      ...values
    );
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getProperty(
  engine: CreativeEngine,
  blockId: number,
  propertyName: string
): any {
  const blockType = engine.block.getPropertyType(propertyName) as PropertyType;
  const typeDependentMethodName = BLOCK_PROPERTY_METHODS[blockType];
  if (typeDependentMethodName?.get) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (engine.block as any)[typeDependentMethodName.get](
      blockId,
      propertyName
    );
  }
}

export const useProperty = (
  block: number | undefined,
  propertyName: string,
  options = { shouldAddUndoStep: true }
) => {
  const { engine } = useEditor();

  const getSelectedProperty = useCallback(() => {
    if (!block || !engine) return;
    try {
      return getProperty(engine, block, propertyName);
    } catch (error) {
      console.log(error);
    }
  }, [block, engine, propertyName]);

  const [propertyValue, setPropertyValue] = useState(getSelectedProperty());

  useEffect(() => {
    setPropertyValue(getSelectedProperty());
  }, [getSelectedProperty]);

  const setEnginePropertyValue = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (...value: any[]) => {
      if (!block || !engine) return;
      try {
        setProperty(engine, block, propertyName, ...value);
        if (options.shouldAddUndoStep) {
          engine.editor.addUndoStep();
        }
      } catch (error) {
        console.log(error);
      }
    },
    [block, engine, propertyName, options]
  );

  useEffect(() => {
    if (!block || !engine) return;
    // A text block carries its colour itself and has no fill to subscribe to.
    const blockToSubscribeTo =
      propertyName.startsWith('fill/') && engine.block.supportsFill(block)
        ? engine.block.getFill(block)
        : block;
    const unsubscribe = engine.event.subscribe(
      [blockToSubscribeTo],
      (events) => {
        if (
          events.length > 0 &&
          !events.find(({ type }) => type === 'Destroyed')
        ) {
          const newProperty = getSelectedProperty();
          if (newProperty !== undefined) {
            setPropertyValue(newProperty);
          }
        }
      }
    );
    return () => unsubscribe();
  }, [engine, propertyName, block, getSelectedProperty]);

  if (!block) {
    return [null, () => {}] as const;
  }

  return [propertyValue, setEnginePropertyValue] as const;
};

export const useSelectedProperty = (
  propertyName: string,
  options = { shouldAddUndoStep: true }
) => {
  const { selectedBlocks } = useEditor();
  const [propertyValue, setEnginePropertyValue] = useProperty(
    selectedBlocks?.[0]?.id,
    propertyName,
    options
  );
  return [propertyValue, setEnginePropertyValue] as const;
};
