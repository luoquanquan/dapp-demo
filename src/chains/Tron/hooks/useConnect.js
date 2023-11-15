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
    const { code } = await okxwallet.tronLink.request({ method: 'tron_requestAccounts' });
    if (code === 200) {
      setAccount(okxwallet.tronWeb.defaultAddress.base58);
    } else {
      message.error(errorMap[code] || 'unknown error');
    }
  };

  useEffect(() => {
    okxwallet.on('walletChanged', () => {
      setAccount(okxwallet.tronWeb.defaultAddress.base58);
    });
  }, []);

  return { account, handleConnect };
};
