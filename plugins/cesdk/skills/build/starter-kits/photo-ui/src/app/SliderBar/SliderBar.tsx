import ResetButton from '../ResetButton/ResetButton';
import Slider from '../Slider/Slider';
import classes from './SliderBar.module.css';

interface SliderBarProps {
  onReset: () => void;
  onChange: (value: number) => void;
  min: number;
  max: number;
  current: number;
  resetEnabled: boolean;
  onStart?: () => void;
  onStop?: () => void;
  onDrag?: () => void;
}

const SliderBar = ({
  onReset,
  onChange,
  min,
  max,
  current,
  resetEnabled,
  onStart,
  onStop,
  onDrag
}: SliderBarProps) => {
  return (
    <div className={classes.bar}>
      <div className={classes.wrapper}>
        <div className={classes.sliderBarButtonWrapper}>
          <ResetButton onClick={onReset} disabled={!resetEnabled} />
        </div>
        <Slider
          onChange={onChange}
          onStart={onStart}
          onStop={onStop}
          onDrag={onDrag}
          min={min}
          max={max}
          current={current}
          formatCurrentValue={(value) => Math.round(value).toString()}
        />
        <div className={classes.sliderBarButtonWrapper} />
      </div>
    </div>
  );
};
export default SliderBar;
