import { useSelectedProperty } from '../../hooks/UseSelectedProperty';
import AlignmentSelect from '../AlignmentSelect/AlignmentSelect';
import {
  SlideUpPanelBody,
  SlideUpPanelHeader
} from '../SlideUpPanel/SlideUpPanel';

const ChangeTextAlignmentSecondary = () => {
  const [horizontalAlignment, setHorizontalAlignment] = useSelectedProperty(
    'text/horizontalAlignment'
  );

  return (
    <>
      <SlideUpPanelHeader headline="Align"></SlideUpPanelHeader>
      <SlideUpPanelBody>
        <AlignmentSelect
          onClick={(value: string) => setHorizontalAlignment(value)}
          activeAlignment={horizontalAlignment}
        />
      </SlideUpPanelBody>
    </>
  );
};
export default ChangeTextAlignmentSecondary;
