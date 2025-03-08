import React, { Suspense } from 'react';

const NetflixNavBar = React.lazy(() => import('breadcrumbs/Breadcrumbs'));
const RandomMovie = React.lazy(() => import('catalogue/RandomMovie'));


const App = () => {
  return (

    <div>

      <main>
        <Suspense fallback={<div>Chargement du catalogue...</div>}>
        <NetflixNavBar />
          <RandomMovie />
        </Suspense>
      </main>
    </div>
  );
};

export default App;