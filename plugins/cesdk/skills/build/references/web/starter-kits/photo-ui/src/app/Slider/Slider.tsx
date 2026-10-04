import Draggable from 'react-draggable';
import { useState, useRef, useEffect, useMemo } from 'react';
import classes from './Slider.module.css';
import TickMarkSvg from './TickMarkSvg';

// Type assertion to fix react-draggable compatibility with React 18
const DraggableComponent = Draggable as any;

function getPositon(x: number, min: number, max: number) {
  const dist = max - min;
  const middle = min + dist / 2;
  const pos = x - middle;
  return pos;
}

interface SliderProps {
  current: number;
  onChange?: (value: number) => void;
  onStart?: (event: any) => void;
  onStop?: (event: any, current: number) => void;
  onDrag?: (event: any, deltaCurrent: number) => void;
  formatCurrentValue: (value: number) => string;
  min?: number;
  max?: number;
  distanceBetweenMarkers?: number;
}

export default function Slider({
  current,
  onChange,
  onStart,
  onStop,
  onDrag,
  formatCurrentValue,
  min = 0,
  max = 100,
  distanceBetweenMarkers = 10
}: SliderProps) {
  const [_current, setCurrent] = useState(current ?? (max - min) / 2);
  const controlled = current !== undefined;
  const nodeRef = useRef(null);
  // Sync controlled prop with internal state - this is a valid pattern for controlled components
  // eslint-disable-next-line
  useEffect(() => {
    if (controlled) {
      if (current > max) {
        setCurrent(max);
      } else if (current < min) {
        setCurrent(min);
      } else {
        setCurrent(current);
      }
    }
  }, [current, controlled, min, max]);
  // Position needs to be flipped and then multiplied by the distance between markers
  // because of the way react draggable works.
  const position = -getPositon(_current, min, max) * distanceBetweenMarkers;
  const numberText =
    Math.round(current) <= max
      ? Math.round(current) >= min
        ? Math.round(current)
        : `<${min}`
      : `>${max}`;

  const label = useMemo(
    () => formatCurrentValue?.(current) ?? numberText,
    [formatCurrentValue, current, numberText]
  );

  return (
    <button className={classes.sliderWrapper}>
      <div className={classes.label}>{label}</div>
      <DraggableComponent
        nodeRef={nodeRef}
        axis="x"
        position={{ x: position, y: 0 }}
        grid={[distanceBetweenMarkers, 1]}
        bounds={{
          left: -(distanceBetweenMarkers / 2) * (max - min),
          right: (distanceBetweenMarkers / 2) * (max - min)
        }}
        onStart={(event: any) => {
          onStart?.(event);
        }}
        onDrag={(event: any, data: any) => {
          const newCurrent = -data.x / distanceBetweenMarkers + (max + min) / 2;
          const deltaCurrent = newCurrent - current;
          onDrag?.(event, deltaCurrent);
          setCurrent(newCurrent);
          onChange?.(newCurrent);
        }}
        onStop={(event: any) => {
          onStop?.(event, current);
          if (_current !== current && controlled) {
            setCurrent(current);
          }
        }}
      >
        <span ref={nodeRef}>
          <TickMarkSvg
            min={min}
            max={max}
            current={_current}
            deadzone={label.toString().length}
            distanceBetweenMarkers={distanceBetweenMarkers}
          />
        </span>
      </DraggableComponent>
    </button>
  );
}
