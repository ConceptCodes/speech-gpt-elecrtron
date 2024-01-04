import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from '$components/App';
import '$renderer/styles/globals.css';

// Say something
console.log('[EVite] : renderer executed');

// Render application
createRoot(document.getElementById('app') as HTMLElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
