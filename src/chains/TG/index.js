import { TonConnectUIProvider, TonConnectButton } from '@tonconnect/ui-react';
import TonConnect from '@tonconnect/sdk';
import {
  Button,
} from 'antd-mobile';
import { useEffect, useState } from 'react';

const connector = new TonConnect({
  manifestUrl: 'https://app.ston.fi/tonconnect-manifest.json',
});

function APP() {
  const initConnection = localStorage.getItem('ton-connect-storage_bridge-connection');
  const initPublicKey = initConnection ? JSON.parse(initConnection)?.sessionCrypto?.publicKey : '';

  const [ulink, setUlink] = useState(initPublicKey);

  const connect = () => {
    const walletConnectionSource = {
      universalLink: 'https://t.me/herewalletbot?attach=wallet',
      bridgeUrl: 'https://www.okx.com/tonbridge/discover/rpc/bridge',
    };
    const universalLink = connector.connect(walletConnectionSource);
    console.log({ universalLink });
    setUlink(universalLink);
  };

  const disconnect = () => {
    connector.disconnect();
  };

  const sendTx = async () => {
    const transaction = {
      validUntil: Math.floor(Date.now() / 1000) + 60, // 60 sec
      messages: [
        {
          address: 'UQDZDkV3FCWG1yvhI9REAUFR4wS3COV1I1DqDzg1-3WvP8ph',
          amount: '100',
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
      <Button onClick={disconnect}>Disconnect</Button>
      <Button onClick={sendTx}>模拟发送交易</Button>
      <TonConnectButton>Ton 链接</TonConnectButton>
    </>
  );
}

function TG() {
  return (
    <TonConnectUIProvider
      connector={connector}
      walletsListConfiguration={{
        includeWallets: [{
          app_name: 'okxTestWallet',
          appName: 'okxTestWallet',
          name: 'OKX Test Wallet',
          image: 'https://static.okx.com/cdn/assets/imgs/247/58E63FEA47A2B7D7.png',
          imageUrl: 'https://static.okx.com/cdn/assets/imgs/247/58E63FEA47A2B7D7.png',
          about_url: 'https://www.okx.com/web3',
          aboutUrl: 'https://www.okx.com/web3',
          universal_url: 'https://t.me/TCTestqdqwdqwdqBot?attach=TCTestqdqwdqwdqBot',
          universalLink: 'https://t.me/TCTestqdqwdqwdqBot?attach=TCTestqdqwdqwdqBot',
          bridgeUrl: 'https://www.okx.com/tonbridge/discover/rpc/bridge',
          bridge: [
            {
              type: 'sse',
              url: 'https://www.okx.com/tonbridge/discover/rpc/bridge',
            },
          ],
          platforms: ['ios', 'android', 'chrome', 'firefox', 'macos'],
        }],
      }}
    >
      <APP />
    </TonConnectUIProvider>
  );
}

const key = 'TG';
export default {
  key,
  children: <TG />,
};
