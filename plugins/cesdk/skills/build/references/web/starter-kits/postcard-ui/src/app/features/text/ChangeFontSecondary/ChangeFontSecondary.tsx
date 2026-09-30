import { Typeface } from '@cesdk/engine';
import { useState } from 'react';
import { useEngine } from '@/app/contexts/EngineContext';
import { getSelectedTypeface } from '@/imgly/utils';
import FontSelect from '@/app/components/FontSelect/FontSelect';

const ChangeFontSecondary = () => {
  const { engine } = useEngine();
  const [activeTypeface, setActiveTypeface] = useState<Typeface | undefined>(
    () => getSelectedTypeface(engine)
  );

  return (
    <FontSelect
      onSelect={(font, typeface) => {
        engine.actions.run('replaceFontOnSelection', font, typeface);
        setActiveTypeface(typeface);
      }}
      activeTypeface={activeTypeface}
    />
  );
};
export default ChangeFontSecondary;
