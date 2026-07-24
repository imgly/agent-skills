import { RGBAColor } from '@cesdk/engine';
import { useSelectedProperty } from '@/app/hooks/useSelectedProperty';
import classes from './CurrentColorIcon.module.css';
import { rgbaToHex } from '@/imgly/utils';

const CurrentColorIcon = ({ property = 'fill/solid/color' }) => {
  const [color] = useSelectedProperty<RGBAColor>(property);

  return (
    <span
      className={classes.icon}
      style={{ backgroundColor: color ? rgbaToHex(color) : undefined }}
    />
  );
};
export default CurrentColorIcon;
