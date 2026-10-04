import type CreativeEngine from '@cesdk/engine';
import type { Font, Typeface } from '@cesdk/engine';
import { useState } from 'react';
import { useEditor } from '../../contexts/EditorContext';
import FontSelect from '../FontSelect/FontSelect';
import {
  SlideUpPanelBody,
  SlideUpPanelHeader
} from '../SlideUpPanel/SlideUpPanel';

const getTypeface = (engine: CreativeEngine | null): Typeface | null => {
  try {
    return engine.block.getTypeface(engine.block.findAllSelected()[0]);
  } catch {
    console.error('Error getting typeface');
    return null;
  }
};

const ChangeTextFontSecondary = () => {
  const { engine } = useEditor();
  const [activeTypeface, setActiveTypeface] = useState<Typeface | null>(
    getTypeface(engine)
  );

  return (
    <>
      <SlideUpPanelHeader headline="Font"></SlideUpPanelHeader>
      <SlideUpPanelBody>
        <FontSelect
          onSelect={(font: Font, typeface: Typeface) => {
            engine.block.findAllSelected().forEach((block) => {
              engine.block.setFont(block, font.uri, typeface);
            });
            setActiveTypeface(typeface);
          }}
          activeTypeface={activeTypeface}
        />
      </SlideUpPanelBody>
    </>
  );
};
export default ChangeTextFontSecondary;
