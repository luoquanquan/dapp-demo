import { message } from 'antd';
import { useEffect, useState } from 'react';

export default () => {
  // 连接钱包
  const [account, setAccount] = useState('');
  const handleConnect = async () => {
    try {
      const result = await window?.ton.connect(2, {
        manifestUrl: 'https://example.com/manifest.json',
        items: [
          { name: 'ton_addr' },
          { name: 'ton_proof', payload: '123' },
        ],
      });
      console.log(result);
      if (result.event === 'connect') {
        console.log(result.payload.items[0].address);
        setAccount(result.payload.items[0].address);
      } else {
        console.log(result.payload.message);
      }
      console.log(result);
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
