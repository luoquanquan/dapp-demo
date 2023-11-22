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
      const [evmAddress] = await ethereum.request({ method: 'eth_requestAccounts' });
      setAccount(evmAddress);
    } catch (error) {
      message.error(errorMap[error.code] || error.message);
    }
  };

  useEffect(() => {
    okxwallet.on('walletChanged', ([connected]) => {
      if (connected) {
        handleConnect();
      } else {
        setAccount('');
      }
    });

    handleConnect();
  }, []);

  return { account, handleConnect };
};
