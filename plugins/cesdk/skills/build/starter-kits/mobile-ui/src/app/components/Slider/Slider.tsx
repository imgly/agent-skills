import classes from './Slider.module.css';
import classNames from 'classnames';

import ReactSlider, { ReactSliderProps } from 'react-slider';

type SliderProps = ReactSliderProps<number> & {
  trackStartValue?: number;
};

const Slider = (props: SliderProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { trackStartValue, ...rest } = props;
  return (
    <ReactSlider<number>
      className={classes.slider}
      thumbClassName={classes.thumb}
      trackClassName={classes.track}
      renderThumb={({ key, ...thumbProps }) => (
        <div {...thumbProps} key={key}>
          <span className={classes.innerThumb} />
        </div>
      )}
      renderTrack={({ key, ...trackProps }, state) => (
        <div
          {...trackProps}
          key={key}
          className={classNames(
            trackProps.className,
            classes[`track--part-${state.index}`]
          )}
        />
      )}
      {...rest}
    />
  );
};
export default Slider;
