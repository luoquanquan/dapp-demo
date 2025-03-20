import { Space } from 'antd';
import { AptosWalletAdapterProvider } from '@aptos-labs/wallet-adapter-react';
import { WalletSelector } from '@aptos-labs/wallet-adapter-ant-design';
import { Network } from '@aptos-labs/ts-sdk';
import DontHaveWallet from '../../components/DontHaveWallet';
import SignMessage from './components/SignMessage';

import '@aptos-labs/wallet-adapter-ant-design/dist/index.css';

function AptosWrap() {
  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <WalletSelector />
      <SignMessage />
    </Space>
  );
}

function Aptos() {
  return (
    <AptosWalletAdapterProvider
      autoConnect
      dappConfig={{ network: Network.MAINNET }}
    >
      <AptosWrap />
    </AptosWalletAdapterProvider>
  );
}

const key = 'Aptos';
export default {
  key,
  children: window.aptos ? <Aptos /> : <DontHaveWallet chain={key} />,
};
