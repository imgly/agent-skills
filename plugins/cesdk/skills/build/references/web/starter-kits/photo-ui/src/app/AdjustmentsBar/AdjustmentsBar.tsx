import classNames from 'classnames';
import classes from './AdjustmentsBar.module.css';
import { CSSProperties } from 'react';

interface AdjustmentsBarProps {
  children?: React.ReactNode;
  scroll?: CSSProperties['overflowX'];
  gap?: 'sm' | 'md' | 'lg';
}

const AdjustmentsBar = ({
  children,
  scroll = 'auto',
  gap = 'md'
}: AdjustmentsBarProps) => {
  return (
    <div className={classes.wrapper} style={{ overflowX: scroll }}>
      <div
        className={classNames(
          classes.innerWrapper,
          classes[`innerWrapper--gap-${gap}`]
        )}
      >
        {children}
      </div>
    </div>
  );
};
export default AdjustmentsBar;
