import { message } from 'antd';
import { useEffect, useState } from 'react';

const errorMap = {
  4000: '同一个 DApp 已经发起了连接网站请求',
  4001: '用户拒绝连接',
};

export default () => {
  const { ethereum } = window;
  // 连接钱包
  const [account, setAccount] = useState('');
  const handleConnect = async () => {
    try {
      if (ethereum) {
        const resp = await ethereum.request({ method: 'eth_requestAccounts' });
        const [evmAddress] = resp;
        setAccount(evmAddress);
      }
    } catch (error) {
      message.error(errorMap[error.code] || error.message);
    }
  };

  const handleConnectAllChains = async () => {
    try {
      const resp = await okxwallet.requestWallets(true);
      const evmAddress = resp[0].address.find(({ chainId }) => chainId === '66').address;
      setAccount(evmAddress);
    } catch (error) {
      message.error(errorMap[error.code] || error.message);
    }
  };

  const handleDisConnect = async () => {
    try {
      await ethereum.disconnect();
    } catch (_) {
      // do nothing
    }

    window.location.reload();
  };

  useEffect(() => {
    try {
      ethereum.on('accountChanged', ([connected]) => {
        if (connected) {
          handleConnect();
        } else {
          setAccount('');
        }
      });
    } catch (error) {
      console.log('Current log: error: ', error);
    }

    setTimeout(() => {
      handleConnect();
    }, 2e2);
  }, []);

  return {
    account, handleConnect, handleConnectAllChains, handleDisConnect,
  };
};
