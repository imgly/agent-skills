import classNames from 'classnames';
import { cloneElement, ReactElement, useRef, useState } from 'react';
import { HexColorInput, HexAlphaColorPicker } from 'react-colorful';

import classes from './ColorPicker.module.css';
import useDebounceCallback from './UseDebounceCallback';
import { useOnClickOutside } from './UseOnClickOutside';

interface IColorPicker {
  presetColors?: string[];
  name: string;
  label?: string;
  defaultValue?: string;
  value: string;
  theme?: 'light' | 'dark';
  size?: 'sm' | 'lg';
  positionX?: 'right' | 'left';
  positionY?: 'top' | 'bottom';
  children?: ReactElement<any>;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onChange: (value: string) => void;
  onChangeDebounced?: () => void;
}

const CaretBottom = () => (
  <svg
    width="8"
    height="6"
    viewBox="0 0 8 4"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M3.80747 4.92513L0.0790216 0.40918C-0.0555847 0.246142 0.0603807 1.52228e-05 0.271804 1.32594e-05L7.74027 -5.60979e-05C7.95187 -5.8063e-05 8.06779 0.246432 7.93282 0.409403L4.1928 4.92542C4.09272 5.04627 3.90736 5.04612 3.80747 4.92513Z"
      fill="currentColor"
      fillOpacity="0.9"
    />
  </svg>
);

export const ColorPicker = ({
  value,
  label,
  name,
  children,
  onChange,
  onChangeDebounced = () => {},
  positionX = 'right',
  positionY = 'bottom',
  theme = 'dark',
  size = 'sm',
  presetColors = [],
  open,
  onOpenChange
}: IColorPicker) => {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const isControlled = open !== undefined;
  const pickerOpen = isControlled ? open : uncontrolledOpen;
  const setPickerOpen = (next: boolean) => {
    if (!isControlled) setUncontrolledOpen(next);
    onOpenChange?.(next);
  };
  const containerRef = useRef<HTMLDivElement | null>(null);
  useOnClickOutside(containerRef, () => pickerOpen && setPickerOpen(false));

  const TriggerComponent = children ? (
    children
  ) : (
    <label
      htmlFor={name}
      className={classNames(
        classes.inputWrapper,
        'space-x-2',
        classes['inputWrapper--' + theme]
      )}
    >
      <span
        className={classes.colorPreviewSpan}
        style={{ backgroundColor: value }}
      ></span>
      <span className={classes.input} id={name} />
      <CaretBottom />
    </label>
  );

  const debouncedChangeHandler = useDebounceCallback(onChangeDebounced, 500);
  const handleChange = (color: string) => {
    onChange(color);
    debouncedChangeHandler();
  };

  return (
    <div
      ref={containerRef}
      className={classNames(
        'gap-xs flex items-center justify-between',
        classes.wrapper,
        classes['wrapper--' + theme],
        classes['wrapper--' + size]
      )}
    >
      {label && (
        <label htmlFor={name} className={classes.label}>
          {label}
        </label>
      )}
      <div className={classNames('space-x-2', classes.selectionWrapper)}>
        {presetColors.length > 0 && (
          <div className="flex space-x-1">
            {presetColors.map((color, i) => (
              <button
                key={color + i}
                style={{ backgroundColor: color }}
                onClick={() => {
                  handleChange(color);
                }}
                className={classes.colorPreset}
              ></button>
            ))}
          </div>
        )}
        {cloneElement(TriggerComponent, {
          onClick: (e: Event) => {
            setPickerOpen(!pickerOpen);
            e.stopPropagation();
          }
        })}

        <div
          style={{
            display: pickerOpen ? 'block' : 'none'
          }}
          className={classNames(
            classes.pickerModal,
            'space-y-1',
            classes[`pickerModal--${positionX}`],
            classes[`pickerModal--${positionY}`]
          )}
        >
          <HexAlphaColorPicker color={value} onChange={handleChange} />
          <div className={'flex space-x-2'}>
            <span>#</span>
            <HexColorInput color={value} onChange={handleChange} />
          </div>
        </div>
      </div>
    </div>
  );
};
