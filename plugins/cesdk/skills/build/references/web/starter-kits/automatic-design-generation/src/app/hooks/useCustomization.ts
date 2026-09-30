/**
 * useCustomization Hook
 *
 * Manages design customization state - message, colors, sizes, and output type.
 */

import { useCallback, useState } from 'react';

import type { OutputType } from '../../imgly';

import { DEFAULT_BACKGROUND_COLOR, DEFAULT_MESSAGE } from '../constants';

interface UseCustomizationReturn {
  message: string;
  backgroundColor: string;
  selectedSizeIndexes: number[];
  outputType: OutputType;
  setMessage: (msg: string) => void;
  setBackgroundColor: (color: string) => void;
  toggleSize: (index: number) => void;
  setOutputType: (type: OutputType) => void;
}

export function useCustomization(): UseCustomizationReturn {
  const [message, setMessage] = useState(DEFAULT_MESSAGE);
  const [backgroundColor, setBackgroundColor] = useState(
    DEFAULT_BACKGROUND_COLOR
  );
  const [selectedSizeIndexes, setSelectedSizeIndexes] = useState([0, 1, 2]);
  const [outputType, setOutputType] = useState<OutputType>('image');

  const toggleSize = useCallback((index: number) => {
    setSelectedSizeIndexes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  }, []);

  return {
    message,
    backgroundColor,
    selectedSizeIndexes,
    outputType,
    setMessage,
    setBackgroundColor,
    toggleSize,
    setOutputType
  };
}
