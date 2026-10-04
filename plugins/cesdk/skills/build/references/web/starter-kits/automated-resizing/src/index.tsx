import type { Configuration } from '@cesdk/cesdk-js';
import { createRoot } from 'react-dom/client';

import App from './app/App';

const config: Partial<Configuration> = {
  userId: 'starterkit-automated-resizing-user',

};

const container = document.getElementById('root');
if (!container) {
  throw new Error('Root container not found');
}

const root = createRoot(container);
root.render(<App config={config} />);
