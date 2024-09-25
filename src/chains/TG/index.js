import { TonConnectUIProvider, TonConnectButton, useTonAddress } from '@tonconnect/ui-react';
import TonConnect from '@tonconnect/sdk';
import {
  Button,
} from 'antd-mobile';
import { useEffect, useState } from 'react';

const connector = new TonConnect({
  manifestUrl: 'https://app.ston.fi/tonconnect-manifest.json',
});

const walletCliecntId = '68a1ecbb7ad7ebe3d0107a8d183316dc036efa90d0c8a8effce7e9eea645832a';

function APP() {
  const initConnection = localStorage.getItem('ton-connect-storage_bridge-connection');
  const initPublicKey = initConnection ? JSON.parse(initConnection)?.sessionCrypto?.publicKey : '';

  const [ulink, setUlink] = useState(initPublicKey);

  const connect = () => {
    const walletConnectionSource = {
      universalLink: 'https://t.me/herewalletbot?attach=wallet',
      bridgeUrl: 'https://sse-bridge.hot-labs.org',
    };
    const universalLink = connector.connect(walletConnectionSource);
    console.log({ universalLink });
    setUlink(universalLink);
  };

  const sendTx = async () => {
    const transaction = {
      validUntil: Math.floor(Date.now() / 1000) + 60, // 60 sec
      messages: [
        {
          address: 'EQBBJBB3HagsujBqVfqeDUPJ0kXjgTPLWPFFffuNXNiJL0aA',
          amount: '20000000',
          // stateInit: "base64bocblahblahblah==" // just for instance. Replace with your transaction initState or remove
        },
      ],
    };
    await connector.sendTransaction(transaction);
  };

  useEffect(() => {
    connector.restoreConnection();
    connector.onStatusChange((wallet) => {
      console.log('status change', wallet);
    });
    window.addEventListener('ton-connect-transaction-sent-for-signature', (event) => {
      console.log('Transaction init', event.detail);
    });
  }, []);

  useEffect(() => {
    console.log('universalLink change', ulink);
  }, [ulink]);

  return (
    <>
      <Button onClick={connect}>Connect</Button>
      <Button onClick={sendTx}>模拟发送交易</Button>
    </>
  );
}

function TG() {
  return (
    <TonConnectUIProvider manifestUrl="https://app.ston.fi/tonconnect-manifest.json">
      <APP />
    </TonConnectUIProvider>
  );
}

const key = 'TG';
export default {
  key,
  children: <TG />,
};
