import IMGLYEditor, {
  EditorPreset,
  EditorSettingsModel
} from '@imgly/editor-react-native';

export const basicEditor = async (): Promise<void> => {
  const settings = new EditorSettingsModel({
    license: 'YOUR_LICENSE_KEY', // Request a license at https://img.ly/forms/contact-sales/, pass null for evaluation mode with watermark
    baseUri: 'YOUR_BASE_URI',
    userId: 'YOUR_USER_ID'
  });

  const source = require('MY_CUSTOM_SOURCE');
  const preset: EditorPreset = EditorPreset.DESIGN;
  const metadata = {
    MY_KEY: 'MY_VALUE'
  };

  const result = await IMGLYEditor?.openEditor(
    settings,
    source,
    preset,
    metadata
  );
};
