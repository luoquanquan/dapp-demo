import {
  Space,
} from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { ethers } from 'ethers';
import SignMessage from './components/SignMessage';
import useNetwork from './hooks/useNetwork';
import Network from './components/Network';
import Connect from '../../components/Connect';
import useConnect from './hooks/useConnect';
import Account from '../../components/Account';
import SignTransaction from './components/SignTransaction';
import EvmContext from './context';
import Others from './components/Others';

function Evm() {
  const { chainId } = useNetwork();
  const { account, handleConnect } = useConnect();
  const [provider, setProvider] = useState(null);
  useEffect(() => {
    setProvider(new ethers.providers.Web3Provider(window.ethereum, 'any'));
  }, [chainId]);

  const context = useMemo(() => ({
    account,
    chainId,
    provider,
  }), [account, chainId, provider]);

  return (
    <EvmContext.Provider value={context}>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Network chainId={chainId} account={account} />
        <Account account={account} />
        <Connect handleConnect={handleConnect} account={account} />
        <SignMessage account={account} chainId={chainId} />
        <SignTransaction />
        <Others />
      </Space>
    </EvmContext.Provider>

  );
}

export default {
  key: 'Evm',
  label: 'Evm',
  children: <Evm />,
};
