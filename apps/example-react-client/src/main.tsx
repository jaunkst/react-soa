import 'reflect-metadata';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './app/app';

import { akitaDevtools } from '@datorama/akita';
akitaDevtools({});

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
