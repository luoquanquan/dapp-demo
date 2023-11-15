import { message } from 'antd';
import { useEffect, useState } from 'react';

export default () => {
  // 连接钱包
  const [account, setAccount] = useState('');
  const handleConnect = async () => {
    try {
      const { publicKey } = await okxwallet.solana.connect();
      setAccount(publicKey.toString());
    } catch (error) {
      message.error(error.message);
    }
  };

  useEffect(() => {
    okxwallet.solana.on('accountChanged', (publicKey) => {
      if (publicKey) {
        setAccount(publicKey.toString());
      } else {
        setAccount('');
      }
    });
  }, []);

  return { account, handleConnect };
};
