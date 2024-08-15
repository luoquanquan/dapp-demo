import { Button, Space } from 'antd-mobile';
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
import DontHaveWallet from '../../components/DontHaveWallet';
import BlackAddress from '../../components/BlackAddress';
import { getEvmBlackEoaAddress, getStrongBlackEoaAddress } from '../../utils/const';

function Evm() {
  const { chainId } = useNetwork();
  const {
    account, handleConnect, handleConnectAllChains, handleDisConnect,
  } = useConnect();
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
        <Network />

        <Account account={account} />

        <Connect handleConnect={handleConnect} account={account} handleDisConnect={handleDisConnect}>
          <Button disabled={!!account} onClick={handleConnectAllChains}>
            Connect All Chain
          </Button>
        </Connect>

        <SignMessage />

        <SignTransaction />

        <Others />

        <BlackAddress type={BlackAddress.typeMap.eoa} address={getEvmBlackEoaAddress(chainId)} />
        <BlackAddress type={BlackAddress.typeMap.strongEoa} address={getStrongBlackEoaAddress(chainId)} />
      </Space>
    </EvmContext.Provider>
  );
}

const key = 'Evm';
export default {
  key,
  children: window.ethereum ? <Evm /> : <DontHaveWallet chain={key} />,
};
