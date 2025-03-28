import { Space } from 'antd';
import { AptosWalletAdapterProvider } from '@aptos-labs/wallet-adapter-react';
import { WalletSelector } from '@aptos-labs/wallet-adapter-ant-design';
import { Network } from '@aptos-labs/ts-sdk';
import DontHaveWallet from '../../components/DontHaveWallet';
import SignMessage from './components/SignMessage';

import '@aptos-labs/wallet-adapter-ant-design/dist/index.css';
import SignTransaction from './components/SignTransaction';
import LinkButton from '../../components/LinkButton';

function AptosWrap() {
  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <WalletSelector />
      <SignMessage />
      <SignTransaction />

      <LinkButton href="https://aptos-labs.github.io/aptos-wallet-adapter/">
        Offical Dapp
      </LinkButton>
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
