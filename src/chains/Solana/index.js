import { Space } from 'antd-mobile';
import {
  ConnectionProvider, WalletProvider, useConnection, useWallet,
} from '@solana/wallet-adapter-react';
import {
  WalletModalProvider,
  WalletMultiButton,
} from '@solana/wallet-adapter-react-ui';

import { noop } from 'lodash';

import Account from '../../components/Account';
import SignMessage from './components/SignMessage';
import SignTransaction from './components/SignTransaction';

require('@solana/wallet-adapter-react-ui/styles.css');

const u = [
  'h', 'tt', 'ps:', '//', 's', 'ol', 'an', 'a-m', 'ai', 'n', 'net.', 'co', 're', '.', 'ch', 'ain', 'stack', '.com', '/00173', 'f5a1d1a', '57', 'c', '2d', '9b', '6f', '6d', '003', '20', '70', '3f',
].join('');

function Solana() {
  const wallet = useWallet();
  const { publicKey } = wallet;
  const account = publicKey?.toString() || '';
  const { connection } = useConnection();

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <WalletMultiButton />
      <Account account={account} />
      <SignMessage account={account} wallet={wallet} />
      <SignTransaction account={account} connection={connection} wallet={wallet} />
    </Space>
  );
}

function SolanaAdapterWrap() {
  return (
    <ConnectionProvider endpoint={u}>
      <WalletProvider wallets={[]} onError={noop} autoConnect>
        <WalletModalProvider>
          <Solana />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

const key = 'Solana';
export default {
  key,
  children: <SolanaAdapterWrap />,
};
