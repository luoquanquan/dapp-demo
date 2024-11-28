import { Space } from 'antd-mobile';
import { useState } from 'react';
import { AptosWalletAdapterProvider } from '@aptos-labs/wallet-adapter-react';
import { Network } from '@aptos-labs/ts-sdk';

import AptosWallet from './components/aptos';
import Account from '../../components/Account';

const key = 'Aptos';

function Aptos() {
  const [provider, setProvider] = useState({});

  return (
    <AptosWalletAdapterProvider
      autoconnect
      dappConfig={{ network: Network.MAINNET }}
      onError={(error) => {
        console.log('Aptos error: ', error);
      }}
    >
      <Space direction="vertical" style={{ width: '100%' }}>
        <AptosWallet>
          {({ account }) => <Account account={account} />}
        </AptosWallet>
      </Space>
    </AptosWalletAdapterProvider>
  );
}

export default {
  key,
  children: <Aptos />,
};
