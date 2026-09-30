import { useSelectedProperty } from '../../contexts/UseSelectedProperty';
import AlignmentSelect from '../AlignmentSelect/AlignmentSelect';

function ChangeTextAlignmentSecondary() {
  const [alignment, setAlignment] = useSelectedProperty(
    'text/horizontalAlignment'
  );

  return (
    <AlignmentSelect
      onClick={(fontUri) => setAlignment(fontUri)}
      activeAlignment={alignment}
    />
  );
}
export default ChangeTextAlignmentSecondary;
