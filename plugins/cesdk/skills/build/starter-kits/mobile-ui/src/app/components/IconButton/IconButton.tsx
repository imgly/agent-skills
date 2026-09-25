import classNames from 'classnames';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import classes from './IconButton.module.css';

type IconButtonProps = {
  icon: ReactNode;
  isActive?: boolean;
  iconColor?: string;
  theme?: 'menu' | 'primary';
  size?: 'sm' | 'md';
} & ComponentPropsWithoutRef<'button'>;

const IconButton = ({
  icon,
  isActive,
  iconColor,
  theme,
  onClick,
  size = 'md',
  ...rest
}: IconButtonProps) => {
  return (
    <button
      className={classNames(classes.wrapper, classes[`wrapper--size-${size}`], {
        [classes['wrapper--active']]: isActive,
        [classes['wrapper--theme-menu']]: theme === 'menu',
        [classes['wrapper--theme-primary']]: theme === 'primary'
      })}
      onClick={onClick}
      {...rest}
    >
      <span className={classes.iconWrapper} style={{ color: iconColor }}>
        {icon}
      </span>
    </button>
  );
};
export default IconButton;
