import {
  Space,
} from 'antd';
import { useState } from 'react';
import SignMessage from './components/SignMessage';
import useNetwork from './hooks/useNetwork';
import Network from './components/Network';
import Connect from './components/Connect';

function Evm() {
  const [account, setAccount] = useState('');
  const { chainId, network } = useNetwork();

  return (
    <Space direction="vertical">
      <Network chainId={chainId} network={network} account={account} />
      <Connect setAccount={setAccount} />
      <SignMessage account={account} />
    </Space>
  );
}

export default {
  key: 'Evm',
  label: 'Evm',
  children: <Evm />,
};
