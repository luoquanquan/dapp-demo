import { TonConnectUIProvider, TonConnectButton } from '@tonconnect/ui-react';
import TonConnect from '@tonconnect/sdk';
import {
  Button,
  Space,
} from 'antd-mobile';
import { useEffect } from 'react';
import SignTransaction from './components/SignTransaction';

const connector = new TonConnect({
  manifestUrl: 'https://app.ston.fi/tonconnect-manifest.json',
});

function APP() {
  const disconnect = () => {
    connector.disconnect();
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

  return (
    <>
      <Space>
        <TonConnectButton>Ton 链接</TonConnectButton>
        <Button onClick={disconnect}>Disconnect</Button>
      </Space>
      <SignTransaction />
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
