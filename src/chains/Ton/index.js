import { Space } from 'antd';

import { TonConnectButton, TonConnectUIProvider } from '@tonconnect/ui-react';

import SignTransaction from './components/SignTransaction';
import BlackAddress from '../../components/BlackAddress';

import { blackTonAddress, strongBlackTonAddress } from './const';

function Ton() {
  return (
    <TonConnectUIProvider manifestUrl="https://luoquanquan.github.io/dapp-demo/tonconnect-manifest.json">
      <Space direction="vertical" style={{ width: '100%' }}>
        <TonConnectButton />
        <SignTransaction />
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
