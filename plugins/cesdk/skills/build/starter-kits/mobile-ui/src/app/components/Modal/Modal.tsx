import type { ReactNode } from 'react';
import CloseIcon from '../../icons/Close.svg';
import IconButton from '../IconButton/IconButton';
import classes from './Modal.module.css';

type ModalProps = {
  title?: ReactNode;
  onClose?: () => void;
  children?: ReactNode;
};

const Modal = ({ title, onClose, children }: ModalProps) => {
  return (
    <div className={classes.wrapper}>
      <div className={classes.header}>
        <div />
        <h3 className={classes.title}>{title}</h3>
        <div>
          <IconButton icon={<CloseIcon />} onClick={onClose} />
        </div>
      </div>
      <div className={classes.body}>{children}</div>
    </div>
  );
};
export default Modal;
