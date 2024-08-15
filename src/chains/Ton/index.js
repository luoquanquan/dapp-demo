import { Space } from 'antd';

import { TonConnectButton, TonConnectUIProvider } from '@tonconnect/ui-react';

import DontHaveWallet from '../../components/DontHaveWallet';
import SignTransaction from './components/SignTransaction';
import BlackAddress from '../../components/BlackAddress';

import { blackAddress, strongBlackAddress } from './const';

function Ton() {
  return (
    <TonConnectUIProvider manifestUrl="https://luoquanquan.github.io/dapp-demo/tonconnect-manifest.json">
      <Space direction="vertical" style={{ width: '100%' }}>
        <TonConnectButton />
        <SignTransaction />
        <BlackAddress type={BlackAddress.typeMap.eoa} address={blackAddress} />
        <BlackAddress type={BlackAddress.typeMap.strongEoa} address={strongBlackAddress} />
      </Space>
    </TonConnectUIProvider>
  );
}

const key = 'Ton';
export default {
  key,
  children: window.tronLink ? <Ton /> : <DontHaveWallet chain={key} />,
};
