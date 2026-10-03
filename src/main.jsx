import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { VaultProvider } from './context/VaultContext';
import './index.css';

const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <VaultProvider>
        <App />
      </VaultProvider>
    </React.StrictMode>
  );
}
