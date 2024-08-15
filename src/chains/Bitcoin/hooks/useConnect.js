import { message } from 'antd';
import { useEffect, useState } from 'react';

export default () => {
  // 连接钱包
  const [account, setAccount] = useState('');

  const handleConnect = async () => {
    try {
      const { address } = await okxwallet.bitcoin.connect();
      setAccount(address);
    } catch (error) {
      message.error(error.message);
    }
  };

  useEffect(() => {
    okxwallet.bitcoin.on('walletChanged', ([connected]) => {
      if (connected) {
        handleConnect();
      } else {
        setAccount('');
      }
    });

    okxwallet.bitcoin.on('accountChanged', (...args) => {
      console.log('Current log: args: ', args);
    });
  }, []);

  return { account, handleConnect };
};
