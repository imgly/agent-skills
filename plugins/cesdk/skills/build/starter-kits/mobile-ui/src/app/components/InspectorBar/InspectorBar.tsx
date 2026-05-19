import type { ComponentType } from 'react';
import { useMemo } from 'react';
import DeleteSelectedButton from '../DeleteSelectedButton/DeleteSelectedButton';
import IconButton from '../IconButton/IconButton';
import classes from './InspectorBar.module.css';

interface Adjustment {
  id: string;
  label?: string;
  Icon: any;
  align?: 'left' | 'middle' | 'right';
  onClick?: () => any;
  Body?: ComponentType<any>;
}

type InspectorBarProps = {
  adjustments: Adjustment[];
  onAdjustmentChange: (id?: string) => void;
  activeAdjustmentId?: string;
  hasDeleteButton?: boolean;
};

const InspectorBar = ({
  adjustments,
  onAdjustmentChange,
  activeAdjustmentId,
  hasDeleteButton = true
}: InspectorBarProps) => {
  const adjustmentToComponent = useMemo(
    () =>
      // eslint-disable-next-line react/display-name
      ({ label, id, Icon, onClick }: Adjustment) => (
        <IconButton
          key={id}
          onClick={() =>
            (onClick && onClick()) || activeAdjustmentId === id
              ? onAdjustmentChange()
              : onAdjustmentChange(id)
          }
          icon={<Icon />}
          isActive={activeAdjustmentId === id}
        >
          {label}
        </IconButton>
      ),
    [onAdjustmentChange, activeAdjustmentId]
  );
  const leftAdjustments = useMemo(
    () =>
      adjustments
        .filter(({ align }) => align === 'left')
        .map(adjustmentToComponent),
    [adjustments, adjustmentToComponent]
  );
  const centerAdjustments = useMemo(
    () =>
      adjustments
        .filter(({ align = 'middle' }) => align === 'middle')
        .map(adjustmentToComponent),
    [adjustments, adjustmentToComponent]
  );
  const rightAdjustments = useMemo(
    () =>
      adjustments
        .filter(({ align }) => align === 'right')
        .map(adjustmentToComponent),
    [adjustments, adjustmentToComponent]
  );
  return (
    <div className={classes.wrapper}>
      <div>{leftAdjustments}</div>
      <div>{centerAdjustments}</div>
      <div>
        {rightAdjustments}
        {hasDeleteButton && <DeleteSelectedButton />}
      </div>
    </div>
  );
};

InspectorBar.displayName = 'InspectorBar';

export default InspectorBar;
