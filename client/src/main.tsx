import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';

// StrictMode helps catch bugs during development by rendering components twice
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);