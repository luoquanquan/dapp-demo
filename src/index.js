import React from 'react';
import VConsole from 'vconsole';
import ReactDOM from 'react-dom/client';
import { openConnectModal } from '@repo/dapp-connect-sdk';
import App from './App';

import './index.css';

setTimeout(() => {
  // eslint-disable-next-line no-new
  process.env.NODE_ENV !== 'development' && new VConsole();
}, 1e3);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
