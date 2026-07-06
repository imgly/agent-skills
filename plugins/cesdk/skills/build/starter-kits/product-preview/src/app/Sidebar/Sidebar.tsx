/**
 * CE.SDK Mockup Editor - Sidebar
 *
 * Orchestrates the mockup preview panel and mockup editor modal.
 */

import { useCallback, useState } from 'react';
import { MockupPreview } from '../MockupPreview/MockupPreview';
import { MockupModal } from '../MockupModal/MockupModal';
import { PRODUCTS } from '../../constants';
import { getMockupSceneUrl } from '../utils';

interface SidebarProps {
  currentProductKey: string;
  mockupImageUrl: string | null;
  mockupSceneString: string | undefined;
  isLoading: boolean;
  isFullscreen: boolean;
  license?: string;
  baseURL?: string;
  onFullscreenChange: (isFullscreen: boolean) => void;
  onMockupSceneSave: (sceneString: string) => Promise<void>;
  onDownload: () => void;
}

export function Sidebar({
  currentProductKey,
  mockupImageUrl,
  mockupSceneString,
  isLoading,
  isFullscreen,
  license,
  baseURL,
  onFullscreenChange,
  onMockupSceneSave,
  onDownload
}: SidebarProps) {
  // Local state for modal only
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleToggleFullscreen = useCallback(() => {
    onFullscreenChange(!isFullscreen);
  }, [isFullscreen, onFullscreenChange]);

  const handleEditMockup = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const handleModalSave = useCallback(
    async (sceneString: string) => {
      setIsModalOpen(false);
      await onMockupSceneSave(sceneString);
    },
    [onMockupSceneSave]
  );

  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const product = PRODUCTS[currentProductKey];

  return (
    <>
      <MockupPreview
        imageUrl={mockupImageUrl}
        isLoading={isLoading}
        isFullscreen={isFullscreen}
        onToggleFullscreen={handleToggleFullscreen}
        onEditMockup={handleEditMockup}
        onDownload={onDownload}
      />

      {isModalOpen && (
        <MockupModal
          title={`${product.label} Mockup`}
          sceneString={mockupSceneString}
          sceneUrl={getMockupSceneUrl(currentProductKey)}
          license={license}
          baseURL={baseURL}
          onSave={handleModalSave}
          onClose={handleModalClose}
        />
      )}
    </>
  );
}

export { type SidebarProps };
