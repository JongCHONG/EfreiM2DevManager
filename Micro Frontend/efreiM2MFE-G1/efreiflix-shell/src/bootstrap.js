/**
 * Bootstrap de l'application Shell
 * 
 * Ce fichier est crucial pour Module Federation car il gère l'initialisation
 * asynchrone de l'application. Cette approche est nécessaire pour :
 * 1. Assurer le chargement correct des dépendances partagées
 * 2. Éviter les problèmes de chargement des modules fédérés
 * 3. Permettre une initialisation propre de React
 * 
 * Note: Ce fichier est chargé de manière asynchrone par index.js
 */

import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// Initialisation de React 18 avec createRoot
const container = document.getElementById('root');
const root = createRoot(container);

// Rendu de l'application
root.render(<App />); 