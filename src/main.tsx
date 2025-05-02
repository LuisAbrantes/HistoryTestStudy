import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Add keyboard shortcut listener for the whole application
document.addEventListener('keydown', e => {
    // Only handle global shortcuts here
    // Component-specific shortcuts are handled in their respective components
});

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
