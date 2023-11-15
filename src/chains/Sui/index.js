import { Space } from 'antd';

import useConnect from './hooks/useConnect';

import Connect from '../../components/Connect';
import Account from '../../components/Account';
import SignMessage from './components/SignMessage';

function Sui() {
  const { account, handleConnect } = useConnect();

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Account account={account?.address} />
      <Connect handleConnect={handleConnect} account={account} />
      <SignMessage account={account} />
    </Space>
  );
}

export default {
  key: 'Sui',
  label: 'Sui',
  children: <Sui />,
};
