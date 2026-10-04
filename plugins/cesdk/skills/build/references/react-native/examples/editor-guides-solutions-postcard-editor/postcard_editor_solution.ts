import IMGLYEditor, {
    EditorPreset,
    EditorSettingsModel
} from '@imgly/editor-react-native';

export const postcard_editor_solution = async (): Promise<void> => {
  const settings = new EditorSettingsModel({ license: 'YOUR_LICENSE_KEY' }); // Request a license at https://img.ly/forms/contact-sales/, pass null for evaluation mode with watermark
  const preset: EditorPreset = EditorPreset.POSTCARD;
  const result = await IMGLYEditor?.openEditor(
    settings,
    undefined,
    preset,
    undefined
  );
};
