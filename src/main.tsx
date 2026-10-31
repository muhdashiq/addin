import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import './styles/tokens.css';
import './styles/global.css';
import './styles/retro-skin.css';

const root = document.getElementById('root');
if (!root) throw new Error('index.html must contain <div id="root">');

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
