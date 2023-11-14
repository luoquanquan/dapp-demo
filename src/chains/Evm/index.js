import {
  Space,
} from 'antd';
import SignMessage from './components/SignMessage';
import useNetwork from './hooks/useNetwork';
import Network from './components/Network';
import Connect from '../../components/Connect';
import useConnect from './hooks/useConnect';
import Account from '../../components/Account';

function Evm() {
  const { chainId, network } = useNetwork();
  const { account, handleConnect } = useConnect();

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Network chainId={chainId} network={network} account={account} />
      <Account account={account} />
      <Connect handleConnect={handleConnect} account={account} />
      <SignMessage account={account} />
    </Space>
  );
}

export default {
  key: 'Evm',
  label: 'Evm',
  children: <Evm />,
};
