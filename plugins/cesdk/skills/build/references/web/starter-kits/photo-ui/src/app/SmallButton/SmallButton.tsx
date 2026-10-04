import classes from './SmallButton.module.css';
import classNames from 'classnames';

interface SmallButtonProps {
  id?: string;
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  variant?: string;
  [key: string]: any;
}

const SmallButton = ({
  id,
  children,
  onClick,
  disabled,
  variant,
  ...rest
}: SmallButtonProps) => {
  return (
    <button
      key={id}
      onClick={onClick}
      disabled={disabled}
      className={classNames(classes.button, {
        [classes[`button--${variant}`]]: !!variant,
        [classes.disabled]: disabled === undefined ? false : disabled
      })}
      {...rest}
    >
      {children}
    </button>
  );
};
export default SmallButton;
