import React from 'react';
import ReactDOM from 'react-dom/client';
import "primereact/resources/themes/lara-light-cyan/theme.css";
import "primereact/resources/primereact.min.css";
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import './index.css';
import App from './App';
import { PrimeReactProvider } from 'primereact/api';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <PrimeReactProvider>
    <App />
  </PrimeReactProvider>
);
