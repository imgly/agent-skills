import classNames from 'classnames';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import classes from './Card.module.css';

type CardProps = {
  children?: ReactNode;
  className?: string;
  backgroundImage?: string;
  ariaLabel?: string;
  hasPadding?: boolean;
} & ComponentPropsWithoutRef<'button'>;

function Card({
  children,
  className,
  backgroundImage,
  ariaLabel,
  hasPadding = true,
  ...props
}: CardProps) {
  return (
    <button
      type="button"
      className={classNames(classes.card, className, {
        [classes.hasPadding]: hasPadding
      })}
      {...props}
    >
      {backgroundImage && (
        <img className={classes.image} src={backgroundImage} alt={ariaLabel} />
      )}
      {children}
    </button>
  );
}

export default Card;
