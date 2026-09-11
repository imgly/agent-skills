import { useSelectedProperty } from '../../../imgly/hooks/UseSelectedProperty';
import classes from './CurrentColorIcon.module.css';
import { rgbaToHex } from '../../../imgly/utils/ColorUtilities';

const CurrentColorIcon = ({ property = 'fill/solid/color' }) => {
  const [color] = useSelectedProperty(property);

  return (
    <span
      className={classes.icon}
      style={{ backgroundColor: rgbaToHex(color) }}
    />
  );
};
export default CurrentColorIcon;
