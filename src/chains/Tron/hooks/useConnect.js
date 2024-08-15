import { message } from 'antd';
import { useEffect, useState } from 'react';

export default () => {
  let tronWeb;

  const [account, setAccount] = useState('');
  const handleConnect = async () => {
    const resp = await tronLink.request({ method: 'tron_requestAccounts' });
    const { code } = resp;
    code && code !== 200 && message.error(code);
    tronWeb = tronLink.tronWeb;
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
