import { message } from 'antd';
import { useEffect, useState } from 'react';
import TonWeb from 'tonweb';

const { Address } = TonWeb.utils;

// const provider = window.okxTonWallet;
const provider = window.tonkeeper;

export default () => {
  // 连接钱包
  const [account, setAccount] = useState('');
  const [address, setAddress] = useState('');
  const handleConnect = async () => {
    const result = await provider.tonconnect.connect(2, {
      manifestUrl: 'https://luoquanquan.github.io/dapp-demo/tonconnect-manifest.json',
      items: [{ name: 'ton_addr' }],
    });
    console.log('Current log: %cresult: ', 'color: green;', result);
    if (result.event === 'connect') {
      setAddress(result.payload.items[0].address);
      setAccount(new Address(result.payload.items[0].address).toString(true, true, false));
    } else {
      message.error(result.payload.message);
    }
  };

  const handleConnectWithProof = async () => {
    const result = await provider.tonconnect.connect(2, {
      manifestUrl: 'https://luoquanquan.github.io/dapp-demo/tonconnect-manifest.json',
      items: [
        { name: 'ton_addr' },
        { name: 'ton_proof', payload: 'circle' },
      ],
    });

    console.log('Current log: %cresult: ', 'color: green;', result);

    if (result.event === 'connect') {
      setAddress(result.payload.items[0].address);
      setAccount(result.payload.items[0].address);
    } else {
      message.error(result.payload.message);
    }
  };

  const handleDisConnect = () => {
    setAccount('');
    provider.tonconnect.disconnect();
  };

  useEffect(() => {
    handleConnect();
  }, []);

  return {
    account, address, handleConnect, handleDisConnect, handleConnectWithProof, provider,
  };
};
