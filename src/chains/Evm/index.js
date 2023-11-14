import {
  Space,
} from 'antd';
import SignMessage from './components/SignMessage';
import useNetwork from './hooks/useNetwork';
import Network from './components/Network';
import Connect from '../../components/Connect';
import useConnect from './hooks/useConnect';

function Evm() {
  const { chainId, network } = useNetwork();
  const { account, handleConnect } = useConnect();

  return (
    <Space direction="vertical">
      <Network chainId={chainId} network={network} account={account} />
      <Connect handleConnect={handleConnect} />
      <SignMessage account={account} />
    </Space>
  );
}

export default {
  key: 'Evm',
  label: 'Evm',
  children: <Evm />,
};
