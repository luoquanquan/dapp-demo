import { Connection } from '@solana/web3.js';
import { message } from 'antd';
import { useEffect, useState } from 'react';

const u = [
  'h', 'tt', 'ps:', '//', 's', 'ol', 'an', 'a-m', 'ai', 'n', 'net.', 'co', 're', '.', 'ch', 'ain', 'stack', '.com', '/00173', 'f5a1d1a', '57', 'c', '2d', '9b', '6f', '6d', '003', '20', '70', '3f',
].join('');

export default () => {
  const connection = new Connection(u);
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
