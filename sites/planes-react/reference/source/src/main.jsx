import React from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App.jsx';
import './styles.css';

// Restore the user's explicit choice before React renders, avoiding theme flash.
try {
  const saved = localStorage.getItem('theme');
  const dark = saved === 'dark' ||
    (saved !== 'light' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.classList.toggle('dark', dark);
} catch {
  // Private browsing or disabled storage must not prevent the app from loading.
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
);
