import { Space } from 'antd';

import useConnect from './hooks/useConnect';

import Connect from '../../components/Connect';
import Account from '../../components/Account';
import SignMessage from './components/SignMessage';
import SignTransaction from './components/SignTransaction';

function Stacks() {
  const { account, handleConnect } = useConnect();

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Account account={account} />
      <Connect handleConnect={handleConnect} account={account} />
      <SignMessage account={account} />
      <SignTransaction account={account} />
    </Space>
  );
}

export default {
  key: 'Stacks',
  label: 'Stacks',
  children: <Stacks />,
};
