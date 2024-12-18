import { Space } from 'antd-mobile';
import { Spin } from 'antd';

import { useEffect, useState } from 'react';
import AccountComponent from './components/account';
import DontHaveWallet from '../../components/DontHaveWallet';
import SignMessage from './components/signMessage';
import SignTransaction from './components/signTransaction';

const key = 'Aptos';

function Aptos() {
  const [context, setContext] = useState(null);

  useEffect(() => {
    if (!window.aptos) {
      return;
    }
    const init = async () => {
      let account = '';
      if (window.aptos.getAccount) {
        account = await window.aptos.getAccount();
      }
      if (window.aptos.account) {
        await window.aptos.connect();
        account = await window.aptos.account();
      }
      setContext({ account });
    };

    init();
  }, []);

  if (!window.aptos) {
    return <DontHaveWallet chain={key} />;
  }

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      {context ? (
        <>
          <AccountComponent account={context.account} />
          <SignMessage disabled={!context.account} />
          <SignTransaction disabled={!context.account} account={context.account} />
        </>
      ) : (
        <Spin />
      )}
    </Space>
  );
}

export default {
  key,
  children: <Aptos />,
};
