import React from 'react';
import VConsole from 'vconsole';
import ReactDOM from 'react-dom/client';
import { init } from '@repo/dapp-connect-sdk';
import App from './App';

import './index.css';

const sdk = await init();
console.log('dappppp add event listener', sdk);
window.addEventListener('eip6963:announceProvider', (event) => {
  console.log('test eip6963:announceProvider', event.detail.provider);

  event.detail.provider.on('accountsChanged', (data) => {
    console.log('dappppppppppppp accountsChanged', data);
  });
});
window.dispatchEvent(new Event('eip6963:requestProvider'));

setTimeout(() => {
  // eslint-disable-next-line no-new
  process.env.NODE_ENV !== 'development' && new VConsole();
}, 1e3);

const root = ReactDOM.createRoot(document.getElementById('root'));

// add telegram web app script
const script = document.createElement('script');
script.src = 'https://telegram.org/js/telegram-web-app.js';
script.id = 'tgsdk';

document.getElementsByTagName('head')[0].appendChild(script);

root.render(<App />);
