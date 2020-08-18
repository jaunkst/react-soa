import React from 'react';
import { serviceContainer, Provider } from '@libs/frontend/utils';
import { BusinessesView } from './features/businesses-view/businesses-view';

const App: React.FC = () => {
  return (
    <Provider container={serviceContainer}>
      <BusinessesView />
    </Provider>
  );
};

export default App;
