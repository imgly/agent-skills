import { useState } from 'react';
import DownloadIcon from '@/app/icons/Download.svg';
import LoadingSpinnerIcon from '@/app/icons/LoadingSpinner.svg';
import { useEngine } from '@/app/contexts/EngineContext';
import { useSinglePageMode } from '@/app/contexts/SinglePageModeContext';
import { downloadBlob } from '@/imgly/utils';
import classes from './ExportButton.module.css';

interface ExportButtonProps {
  fileName?: string;
}

const ExportButton = ({ fileName = 'my-postcard' }: ExportButtonProps) => {
  const [isExporting, setIsExporting] = useState(false);
  const { engine } = useEngine();
  const { currentPageBlockId } = useSinglePageMode();

  const handleExport = async () => {
    setIsExporting(true);
    try {
      // Wait for the browser to paint the spinner before the (blocking) export.
      await new Promise<void>((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
      );
      const blob = await engine.actions.run('exportToPdf', currentPageBlockId);
      downloadBlob(blob, fileName);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      className={classes.cta}
      onClick={() => handleExport()}
      disabled={isExporting}
    >
      <span className={classes.ctaText}>Export</span>
      {isExporting ? (
        <span className={classes.spinning}>
          <LoadingSpinnerIcon />
        </span>
      ) : (
        <DownloadIcon />
      )}
    </button>
  );
};
export default ExportButton;
