import { message } from 'antd';
import { useEffect, useState } from 'react';

export default () => {
  // 连接钱包
  const [account, setAccount] = useState('');
  const handleConnect = async () => {
    if (!window.ton) {
      message.error('Ton wallet is not available');
      return;
    }
    try {
      const { address } = await window.ton.connect();
      setAccount(address);
    } catch (error) {
      message.error(error.message);
    }
  };

  const handleDisconnect = async () => {
    try {
      await window?.ton.disconnect();
      setAccount('');
    } catch (error) {
      message.error(error.message);
    }
  };

  useEffect(() => {
    if (window.ton) {
      window.ton.on('accountChanged', handleConnect);
      window.ton.on('connect', (data) => {
        console.log('window.ton connect: ', data);
        if (data.address) {
          setAccount(data.address);
        }
      });
      window.ton.on('disconnect', (data) => {
        console.log('window.ton disconnect: ', data);
        setTimeout(() => {
          setAccount('');
        }, 0);
      });
      handleConnect();
    }
  }, []);

  return {
    account, handleConnect, handleDisconnect,
  };
};
