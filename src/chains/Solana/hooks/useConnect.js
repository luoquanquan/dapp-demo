import { Connection } from '@solana/web3.js';
import { message } from 'antd';
import { useEffect, useState } from 'react';

export default () => {
  const connection = new Connection(['h', 'tt', 'ps:', '//', 'solana-main', 'net.core.', 'ch', 'ain', 'stack', '.com', '/4916', '995a', '26690b', '007a6ad', 'a71d9', 'b1ac4a'].join(''));
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
