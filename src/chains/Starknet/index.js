import { Space } from 'antd';

import useConnect from './hooks/useConnect';

import Connect from '../../components/Connect';
import Account from '../../components/Account';
import SignMessage from './components/SignMessage';

function Starknet() {
  const { account, handleConnect } = useConnect();

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Account account={account} />
      <Connect handleConnect={handleConnect} account={account} />
      <SignMessage account={account} />
    </Space>
  );
}

export default {
  key: 'Starknet',
  label: 'Starknet',
  children: <Starknet />,
};
