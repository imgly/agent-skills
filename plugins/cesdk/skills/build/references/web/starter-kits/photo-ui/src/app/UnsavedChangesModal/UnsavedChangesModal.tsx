import { useEditor } from '../contexts/EditorContext';
import Modal from '../Modal/Modal';
import SmallButton from '../SmallButton/SmallButton';
import classes from './UnsavedChangesModal.module.css';

interface UnsavedChangesModalProps {
  imageUrl: string;
  onClose: () => void;
}

export default function UnsavedChangesModal({
  imageUrl,
  onClose
}: UnsavedChangesModalProps) {
  const { changeImage } = useEditor();
  return (
    <Modal open title="Unsaved Changes" maxWidth={'380px'} maxHeight="auto">
      <div className={classes.text}>
        <p>
          There are unsaved changes for the current image. Would you like to
          apply them to the new image or <br /> discard them?
        </p>
      </div>
      <hr />
      <div className={classes.actionRow}>
        <SmallButton
          id="cancel-button"
          variant={'secondary-plain'}
          disabled={false}
          onClick={onClose}
        >
          Cancel
        </SmallButton>
        <div className={classes.primaryActions}>
          <SmallButton
            id="discard-button"
            variant={'secondary-plain'}
            disabled={false}
            onClick={async () => {
              await changeImage(imageUrl, false);
              onClose();
            }}
          >
            Discard Changes
          </SmallButton>
          <SmallButton
            id="apply-button"
            variant={'primary'}
            disabled={false}
            onClick={async () => {
              await changeImage(imageUrl, true);
              onClose();
            }}
          >
            Apply Changes
          </SmallButton>
        </div>
      </div>
    </Modal>
  );
}
