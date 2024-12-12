import { Space } from 'antd-mobile';
import { useEffect, useState } from 'react';
import { Spin } from 'antd';
import useConnect from './hooks/useConnect';
import useNetwork from './hooks/useNetwork';
import Account from './components/account';
import Network from './components/network';
import DontHaveWallet from '../../components/DontHaveWallet';
import Connect from './components/connect';
import SwitchChain from './components/switchChain';
import SignMessage from './components/signMessage';
import Psbt from './components/psbt';
import Send from './components/send';
import ComingSoon from './components/comingSoon';

const key = 'Btc';

function Btc() {
  const [provider, setProvider] = useState(null);
  const {
    account, publicKey, connect, disconnect,
  } = useConnect(provider);
  const { chain, getNetwork } = useNetwork(provider);

  useEffect(() => {
    if (!window?.okxWallet?.bitcoin) {
      return;
    }
    const init = async () => {
      setProvider(window.okxWallet.bitcoin); // set window.okxWallet.bitcoin as provider
    };

    init();
  }, []);

  if (!window?.okxWallet?.bitcoin) {
    return <DontHaveWallet chain={key} />;
  }

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <>
        <Connect account={account} connect={connect} disconnect={disconnect} />
        {provider ? (
          <>
            <Account account={account} publicKey={publicKey} />
            <Network chain={chain} />

            <SwitchChain
              provider={provider}
              disabled={!account}
              getNetwork={getNetwork}
            />
            <SignMessage provider={provider} disabled={!account} />
            <Psbt provider={provider} account={account} disabled={!account} />
            <Send provider={provider} disabled={!account} />
            <ComingSoon provider={provider} disabled />
          </>
        ) : (
          <Spin />
        )}
      </>
    </Space>
  );
}

export default {
  key,
  children: <Btc />,
};
