import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import { useEditor } from '../../contexts/EditorContext';
import BottomControls from '../BottomControls/BottomControls';
import CESDKCanvas from '../CESDKCanvas/CESDKCanvas';
import TopBar from '../TopBar/TopBar';

const MobileUI = () => {
  const { engineIsLoaded } = useEditor();

  return (
    <>
      {!engineIsLoaded && <LoadingSpinner />}
      {engineIsLoaded && <TopBar />}
      <CESDKCanvas />
      {engineIsLoaded && <BottomControls />}
    </>
  );
};

export default MobileUI;
