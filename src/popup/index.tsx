import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import './style/index.css';

document.body.innerHTML = '<div id="root"></div>';
export const root = createRoot(
  document.getElementById('root') as HTMLDivElement
);

root.render(<App />);
