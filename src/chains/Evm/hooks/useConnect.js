import { message } from 'antd';
import { useEffect, useState } from 'react';

const errorMap = {
  4000: '同一个 DApp 已经发起了连接网站请求',
  4001: '用户拒绝连接',
};

export default (provider) => {
  // 连接钱包
  const [account, setAccount] = useState('');
  const handleConnect = async () => {
    try {
      if (provider.request) {
        const resp = await provider.request({ method: 'eth_requestAccounts' });
        const [evmAddress] = resp;
        setAccount(evmAddress);
      }
    } catch (error) {
      message.error(errorMap[error.code] || error.message);
    }
  };

  const handleConnectAllChains = async () => {
    try {
      const resp = await provider.requestWallets(true);
      const evmAddress = resp[0].address.find(({ chainId }) => chainId === '66').address;
      setAccount(evmAddress);
    } catch (error) {
      message.error(errorMap[error.code] || error.message);
    }
  };

  const handleDisConnect = async () => {
    try {
      await provider.disconnect();
    } catch (_) {
      // do nothing
    }

    window.location.reload();
  };

  useEffect(() => {
    setAccount('');
    if (!provider || !provider?.on) return;

    try {
      provider.on('accountsChanged', ([connected]) => {
        if (connected) {
          handleConnect();
        } else {
          setAccount('');
        }
      });
    } catch (error) {
      console.log(error);
    }

    handleConnect();
  }, [provider]);

  return {
    account, handleConnect, handleConnectAllChains, handleDisConnect,
  };
};
