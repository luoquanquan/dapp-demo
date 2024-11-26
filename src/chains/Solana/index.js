import { Space } from 'antd-mobile';

import useConnect from './hooks/useConnect';

import Connect from '../../components/Connect';
import Account from '../../components/Account';
import SignMessage from './components/SignMessage';
import SignTransaction from './components/SignTransaction';
import DontHaveWallet from '../../components/DontHaveWallet';

function Solana() {
  const { account, handleConnect, connection, handleDisconnect } = useConnect();

  if (!window.solana) {
    return <DontHaveWallet chain="Solana" />;
  }
  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Account account={account} />
      <Connect
        handleConnect={handleConnect}
        account={account}
        handleDisconnect={handleDisconnect}
      />
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
