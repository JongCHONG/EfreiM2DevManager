import React from 'react';
import { createRoot } from 'react-dom/client';
import Header from './components/Header';

// Point d'entrée pour le développement standalone
const container = document.getElementById('root');
const root = createRoot(container);
root.render(<Header />); 