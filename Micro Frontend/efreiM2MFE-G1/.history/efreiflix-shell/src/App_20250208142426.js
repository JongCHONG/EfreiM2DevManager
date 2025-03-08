import React, { Suspense } from 'react';

// Import dynamique du Header via Module Federation
const Header = React.lazy(() => import('header/Header'));

const App = () => {
  return (
    <div>
      <Suspense fallback={<div>Chargement du header...</div>}>
        <Header />
      </Suspense>
      <main style={{ padding: '2rem' }}>
        <h2>Bienvenue sur EFREIFlix</h2>
        <p>Contenu principal de l'application...</p>
      </main>
    </div>
  );
};

export default App; 