import React from 'react';
import VConsole from 'vconsole';
import ReactDOM from 'react-dom/client';
import { init } from '@repo/dapp-connect';
import App from './App';

import './index.css';

const sdk = await init();
console.log('dappppp add event listener', sdk);

setTimeout(() => {
  // eslint-disable-next-line no-new
  process.env.NODE_ENV !== 'development' && new VConsole();
}, 1e3);

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(<App />);
