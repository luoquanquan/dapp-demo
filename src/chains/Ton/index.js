import { Space } from 'antd';

import { TonConnectButton, TonConnectUIProvider } from '@tonconnect/ui-react';

import SignTransaction from './components/SignTransaction';
import BlackAddress from '../../components/BlackAddress';

import { blackTonAddress, strongBlackTonAddress } from './const';
import SignTransactionWithFakeParams from './components/SignTransactionWithFakeParams';

function Ton() {
  return (
    <TonConnectUIProvider
      manifestUrl="https://luoquanquan.github.io/dapp-demo/tonconnect-manifest.json"
      walletsListConfiguration={{
        includeWallets: [
          {
            app_name: 'beta',
            appName: 'beta',
            name: 'Beta',
            image: 'https://static.okx.com/cdn/assets/imgs/247/58E63FEA47A2B7D7.png',
            imageUrl: 'https://static.okx.com/cdn/assets/imgs/247/58E63FEA47A2B7D7.png',
            about_url: 'https://www.okx.com/web3',
            aboutUrl: 'https://www.okx.com/web3',
            universal_url: 't.me/beta_test_wallet_bot/leon_test_beta_wallet',
            universalLink: 't.me/beta_test_wallet_bot/leon_test_beta_wallet',
            bridgeUrl: 'https://www.okx.com/tonbridge/discover/rpc/bridge',
            bridge: [
              {
                type: 'sse',
                url: 'https://www.okx.com/tonbridge/discover/rpc/bridge',
              },
            ],
            platforms: ['ios', 'android', 'chrome', 'firefox', 'macos'],
          },
        ],
      }}
    >
      <Space direction="vertical" style={{ width: '100%' }}>
        <TonConnectButton />
        <SignTransaction />
        <SignTransactionWithFakeParams />
        <BlackAddress type={BlackAddress.typeMap.eoa} address={blackTonAddress} />
        <BlackAddress type={BlackAddress.typeMap.strongEoa} address={strongBlackTonAddress} />
      </Space>
    </TonConnectUIProvider>
  );
}

const key = 'Ton';
export default {
  key,
  children: <Ton />,
};
