import { useCallback, useState } from 'react';

import type { Template } from '../../imgly';
import { DEFAULT_TEMPLATES } from '../constants';

export function useTemplates() {
  const [templates, setTemplates] = useState<Template[]>(() => [
    ...DEFAULT_TEMPLATES
  ]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const updateTemplate = useCallback(
    (target: Template, sceneString: string, previewUrl?: string) => {
      setTemplates((prev) =>
        prev.map((t) =>
          t === target
            ? {
                ...t,
                sceneString,
                ...(previewUrl ? { previewImagePath: previewUrl } : {})
              }
            : t
        )
      );
    },
    []
  );

  return {
    templates,
    selectedIndex,
    selectedTemplate: templates[selectedIndex],
    select: setSelectedIndex,
    updateTemplate
  };
}
