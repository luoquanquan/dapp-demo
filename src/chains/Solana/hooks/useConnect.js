import { Connection } from '@solana/web3.js';
import { message } from 'antd';
import { useEffect, useState } from 'react';

export default () => {
  const connection = new Connection('https://solana-mainnet.core.chainstack.com/4916995a26690b007a6ada71d9b1ac4a');
  // 连接钱包
  const [account, setAccount] = useState('');
  const handleConnect = async () => {
    try {
      const { publicKey } = await solana.connect();
      setAccount(publicKey.toBase58());
    } catch (error) {
      message.error(error.message);
    }
  };

  useEffect(() => {
    solana.on('accountChanged', handleConnect);
    handleConnect();
  }, []);

  return { account, handleConnect, connection };
};
