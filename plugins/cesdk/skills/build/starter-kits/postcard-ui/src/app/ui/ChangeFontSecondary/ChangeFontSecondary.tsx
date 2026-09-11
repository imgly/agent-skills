import { Typeface } from '@cesdk/engine';
import { useState } from 'react';
import { useEngine } from '../../../imgly/contexts/EngineContext';
import FontSelect from '../FontSelect/FontSelect';

const ChangeFontSecondary = () => {
  const { engine } = useEngine();
  const [activeTypeface, setActiveTypeface] = useState<Typeface | undefined>(
    () => {
      const [block] = engine.block.findAllSelected();
      if (block == null) return undefined;
      // Newly created text blocks have no typeface set yet, so getTypeface
      // throws. Treat that as "no active typeface" instead of crashing.
      try {
        return engine.block.getTypeface(block);
      } catch {
        return undefined;
      }
    }
  );

  return (
    <FontSelect
      onSelect={(font, typeface) => {
        engine.block.findAllSelected().forEach((block) => {
          engine.block.setFont(block, font.uri, typeface);
        });
        setActiveTypeface(typeface);
      }}
      activeTypeface={activeTypeface}
    />
  );
};
export default ChangeFontSecondary;
