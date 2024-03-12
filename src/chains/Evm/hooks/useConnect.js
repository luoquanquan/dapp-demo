import { message } from 'antd';
import { useEffect, useState } from 'react';

const errorMap = {
  4000: '同一个 DApp 已经发起了连接网站请求',
  4001: '用户拒绝连接',
};

export default () => {
  // 连接钱包
  const [account, setAccount] = useState('');
  const handleConnect = async () => {
    try {
      const resp = await ethereum.request({ method: 'eth_requestAccounts' });
      const [evmAddress] = resp;
      setAccount(evmAddress);
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

  useEffect(() => {
    try {
      okxwallet.on('walletChanged', ([connected]) => {
        if (connected) {
          handleConnect();
        } else {
          setAccount('');
        }
      });
    } catch (error) {
      console.log('Current log: error: ', error);
    }

    const urlParams = new URLSearchParams(window.location.search);
    const dontAutoConnect = urlParams.get('dontAutoConnect');
    if (!dontAutoConnect) {
      handleConnect();
    }
  }, []);

  return { account, handleConnect, handleConnectAllChains };
};
