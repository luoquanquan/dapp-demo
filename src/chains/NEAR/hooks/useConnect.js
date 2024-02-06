import { message } from 'antd';
import { useEffect, useState } from 'react';

export default () => {
  // 连接钱包
  const [account, setAccount] = useState('');
  const handleConnect = async () => {
    try {
      console.log(1);
    } catch (error) {
      message.error(error.message);
    }
  };

  useEffect(() => {
    solana.on('accountChanged', handleConnect);
    handleConnect();
  }, []);

  return { account, handleConnect };
};
