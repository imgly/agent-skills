import CreativeEditor from '@cesdk/cesdk-js/react';
import type CreativeEditorSDK from '@cesdk/cesdk-js';

interface PhotoEditorProps {
  imageUrl: string;
}

const config = {
  // license: 'YOUR_CESDK_LICENSE_KEY',
};

export default function PhotoEditor({ imageUrl }: PhotoEditorProps) {
  const init = async (cesdk: CreativeEditorSDK) => {
    try {
      await Promise.all([
        cesdk.addDefaultAssetSources(),
        cesdk.addDemoAssetSources({
          sceneMode: 'Design',
          withUploadAssetSources: true,
        }),
      ]);

      await cesdk.engine.scene.createFromImage(imageUrl);
    } catch (error) {
      console.error('[CE.SDK init] Failed:', error);
    }
  };

  return (
    <CreativeEditor
      config={config}
      init={init}
      width="100vw"
      height="100vh"
    />
  );
}
