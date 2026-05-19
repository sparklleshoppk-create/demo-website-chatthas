import React from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import App from './App.jsx';
import './index.css';

const rootEl = document.getElementById('root');

function showBootError(message) {
  rootEl.innerHTML = `
    <div style="min-height:100vh;background:#0A0A0A;color:#FAF7F0;display:flex;align-items:center;justify-content:center;padding:2rem;font-family:sans-serif;">
      <div style="max-width:480px;text-align:center;">
        <h1 style="color:#C9A84C;margin-bottom:1rem;">Chattha's failed to load</h1>
        <p style="opacity:0.7;margin-bottom:1.5rem;">${message}</p>
        <button onclick="location.reload()" style="background:#C9A84C;color:#0A0A0A;border:none;padding:12px 24px;font-weight:bold;cursor:pointer;">
          Reload
        </button>
      </div>
    </div>
  `;
}

try {
  ReactDOM.createRoot(rootEl).render(
    <HelmetProvider>
      <App />
    </HelmetProvider>
  );
} catch (err) {
  showBootError(err?.message || 'Unknown startup error');
  console.error(err);
}
