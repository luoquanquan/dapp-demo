import { message } from 'antd';
import { useEffect, useState } from 'react';

export default () => {
  // 连接钱包
  const [account, setAccount] = useState(null);

  const handleConnect = async () => {
    try {
      const { accounts: [receiveAccount] } = await okxwallet.sui.connect();
      // setAccount(address);
      setAccount(receiveAccount);
    } catch (error) {
      message.error(error.message);
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
  }, []);

  return { account, handleConnect };
};
