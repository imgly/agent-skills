import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import classes from './Select.module.css';

type SelectProps = {
  children?: ReactNode;
  onChange?: (value: string) => void;
} & Omit<ComponentPropsWithoutRef<'select'>, 'onChange'>;

const Select = ({ children, onChange, ...rest }: SelectProps) => {
  return (
    <select
      className={classes.select}
      onChange={(e) => onChange && onChange(e.target.value)}
      {...rest}
    >
      {children}
    </select>
  );
};
export default Select;
