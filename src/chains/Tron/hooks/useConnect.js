import { message } from 'antd';
import { useEffect, useState } from 'react';

export default () => {
  const [account, setAccount] = useState('');
  const handleConnect = async () => {
    const { code } = await tronWeb.request({ method: 'tron_requestAccounts' });
    code && code !== 200 && message.error(code);
    setAccount(tronWeb.defaultAddress?.base58 || '');
  };

  useEffect(() => {
    window.addEventListener('message', ({ data }) => {
      if (data.message?.action === 'accountsChanged') {
        setAccount(tronWeb.defaultAddress?.base58 || '');
      }
    });

    handleConnect();
  }, []);

  return { account, handleConnect };
};
