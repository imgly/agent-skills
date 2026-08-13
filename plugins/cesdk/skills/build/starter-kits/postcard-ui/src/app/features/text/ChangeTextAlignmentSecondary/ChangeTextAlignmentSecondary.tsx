import { useSelectedProperty } from '@/app/hooks/useSelectedProperty';
import AlignmentSelect from '@/app/components/AlignmentSelect/AlignmentSelect';

const ChangeTextAlignmentSecondary = () => {
  const [alignment, setAlignment] = useSelectedProperty<string>(
    'text/horizontalAlignment'
  );

  return (
    <AlignmentSelect
      onClick={(fontUri) => setAlignment(fontUri)}
      activeAlignment={alignment ?? ''}
    />
  );
};
export default ChangeTextAlignmentSecondary;
