import classes from './Modal.module.css';

interface ModalProps {
  open: boolean;
  children: React.ReactNode;
  maxWidth?: string;
  maxHeight?: string;
  title?: string;
}

export default function Modal({
  open,
  children,
  maxWidth,
  maxHeight,
  title
}: ModalProps) {
  return open !== undefined && open ? (
    <div className={classes.background}>
      <div className={classes.modal} style={{ maxWidth, maxHeight }}>
        {title ? <div className={classes.title}>{title}</div> : null}
        {children}
      </div>
    </div>
  ) : null;
}
