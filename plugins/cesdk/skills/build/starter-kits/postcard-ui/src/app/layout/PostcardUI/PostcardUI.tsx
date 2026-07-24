import LoadingSpinner from '@/app/components/LoadingSpinner/LoadingSpinner';
import { useEditor } from '@/app/contexts/EditorContext';
import BottomControls from '@/app/features/blocks/BottomControls/BottomControls';
import CESDKCanvas from '@/app/components/CESDKCanvas/CESDKCanvas';
import ChooseTemplateStep from '@/app/steps/ChooseTemplateStep/ChooseTemplateStep';
import PageToolbar from '../PageToolbar/PageToolbar';
import TopBar from '@/app/components/TopBar/TopBar';
import ProcessNavigation from '../ProcessNavigation/ProcessNavigation';
import { useEditMode } from '@/app/hooks/useEditMode';
import { useEngine } from '@/app/contexts/EngineContext';

const PostcardUI = () => {
  const { sceneIsLoaded, currentStep } = useEditor();
  const { engine } = useEngine();
  const { editMode } = useEditMode({
    engine
  });

  if (currentStep === 'Style') {
    return (
      <>
        <ChooseTemplateStep />
        <CESDKCanvas isVisible={false} key="canvas" />
      </>
    );
  }

  return (
    <>
      {/* Setting the node key allows react to leave the canvas in the dom without rerendering */}
      <CESDKCanvas isVisible={sceneIsLoaded} key="canvas" />
      {!sceneIsLoaded && <LoadingSpinner />}
      {sceneIsLoaded && (
        <TopBar>
          <ProcessNavigation disabled={!sceneIsLoaded || editMode === 'Crop'} />
        </TopBar>
      )}
      {sceneIsLoaded && <PageToolbar />}
      {/* We want hide the bottom controls in the last step */}
      {sceneIsLoaded && <BottomControls visible={currentStep === 'Design'} />}
    </>
  );
};

export default PostcardUI;
