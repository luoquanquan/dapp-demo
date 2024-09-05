import { Button, Space } from 'antd-mobile';
import { useMemo, useState } from 'react';
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
import LinkButton from '../../components/LinkButton';
import Eip6963 from './components/Eip6963';
import GetEncryptPublicKey from './components/GetEncryptPublicKey';

function Evm() {
  const [provider, setProvider] = useState({});
  const {
    account, handleConnect, handleConnectAllChains, handleDisConnect,
  } = useConnect(provider);
  const { chainId } = useNetwork(provider);

  const context = useMemo(() => ({
    account,
    chainId,
    provider,
    setProvider,
  }), [account, chainId, provider]);

  return (
    <EvmContext.Provider value={context}>
      <LinkButton href="/dapp-demo/old/">Back To Old Version</LinkButton>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Network />

        <Eip6963 />

        <Account account={account} />

        <Connect handleConnect={handleConnect} account={account} handleDisConnect={handleDisConnect}>
          {
            provider.requestWallets ? (
              <Button disabled={!!account} onClick={handleConnectAllChains}>
                Connect All Chain
              </Button>
            ) : null
          }
        </Connect>

        <SignMessage />

        <SignTransaction />

        <Others />

        <GetEncryptPublicKey />

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
