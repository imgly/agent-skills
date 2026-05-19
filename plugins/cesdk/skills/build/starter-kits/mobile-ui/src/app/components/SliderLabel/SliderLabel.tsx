import type { ReactNode } from 'react';
import classes from './SliderLabel.module.css';

type SliderLabelProps = {
  label: ReactNode;
  children?: ReactNode;
};

const SliderLabel = ({ label, children }: SliderLabelProps) => {
  return (
    <div className={classes.wrapper}>
      <span className={classes.label}>{label}</span>
      {children}
    </div>
  );
};
export default SliderLabel;
