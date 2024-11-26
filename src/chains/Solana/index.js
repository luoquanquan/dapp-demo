import { Space } from 'antd-mobile';

import { useEffect } from 'react';
import useConnect from './hooks/useConnect';
import Connect from '../../components/Connect';
import Account from '../../components/Account';
import SignMessage from './components/SignMessage';
import SignTransaction from './components/SignTransaction';
import DontHaveWallet from '../../components/DontHaveWallet';

function Solana() {
  const { account, handleConnect, connection } = useConnect();
  useEffect(() => {
    window?.solana?.on('connect', (connectData) => {
      console.log('connectData', connectData);
    });
    window?.solana?.on('disconnect', (disconnectData) => {
      console.log('disconnectData', disconnectData);
    });
    window?.solana?.on('accountsChanged', (accChangedData) => {
      console.log('accChangedData', accChangedData);
    });
    window?.solana?.on('chainChanged', (chainChangeData) => {
      console.log('chainChangeData', chainChangeData);
    });
  }, []);

  if (!window.solana) {
    return <DontHaveWallet chain={key} />;
  }
  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Account account={account} />
      <Connect handleConnect={handleConnect} account={account} />
      <SignMessage account={account} />
      <SignTransaction account={account} connection={connection} />
    </Space>
  );
}

const key = 'Solana';
export default {
  key,
  children: <Solana />,
};
