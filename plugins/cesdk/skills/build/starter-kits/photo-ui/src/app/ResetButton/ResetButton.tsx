import SmallButton from '../SmallButton/SmallButton';
import ResetIcon from '../icons/Reset.svg';
import classes from './ResetButton.module.css';

interface ResetButtonProps {
  disabled?: boolean;
  onClick: () => void;
}

export default function ResetButton({ disabled, onClick }: ResetButtonProps) {
  return (
    <SmallButton
      id="reset-button"
      variant={'secondary-plain'}
      disabled={disabled}
      onClick={onClick}
    >
      <ResetIcon />
      <span className={classes.text}>Reset</span>
    </SmallButton>
  );
}
